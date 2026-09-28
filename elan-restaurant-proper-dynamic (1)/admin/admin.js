const $=s=>document.querySelector(s);
let state={menu:[],requests:[]};

async function api(path, options={}){const r=await fetch(path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Request failed');return data;}
async function login(){try{await api('/api/admin',{method:'POST',body:JSON.stringify({action:'login',password:$('#adminPass').value})});$('#login').classList.add('hidden');$('#console').classList.remove('hidden');await load();}catch(e){$('#loginError').textContent=e.message;}}
$('#loginBtn').onclick=login;$('#adminPass').onkeydown=e=>{if(e.key==='Enter')login()};
$('#logout').onclick=async()=>{await api('/api/admin',{method:'POST',body:JSON.stringify({action:'logout'})});location.reload()};

async function load(){try{state=await api('/api/admin');render();}catch(e){if(e.message==='Unauthorized'){$('#login').classList.remove('hidden');$('#console').classList.add('hidden');}else alert(e.message);}}
function render(){
 const r=state.requests||[],m=state.menu||[];
 $('#rCount').textContent=r.filter(x=>x.type==='reservation').length;
 $('#pCount').textContent=r.filter(x=>x.status==='Pending').length;
 $('#cCount').textContent=r.filter(x=>x.type==='contact').length;
 $('#gCount').textContent=r.filter(x=>x.type==='reservation').reduce((a,x)=>a+Number(x.guests||0),0);
 $('#requestRows').innerHTML=r.map(x=>`<tr><td><span class="status ${x.type==='reservation'?'confirmed':'pending'}">${x.type}</span></td><td><strong>${escapeHtml(x.name||'')}</strong><small>${escapeHtml(x.phone||x.email||'')}</small></td><td>${escapeHtml(x.date||new Date(x.created_at).toLocaleDateString())}</td><td><small>${x.type==='reservation'?`${escapeHtml(x.time||'')} · ${escapeHtml(String(x.guests||''))} guests<br>${escapeHtml(x.notes||'No special request')}`:escapeHtml(x.message||'')}</small></td><td><span class="status ${(x.status||'Pending').toLowerCase()}">${escapeHtml(x.status||'Pending')}</span></td><td><button class="action" onclick="statusReq('${encodeURIComponent(x.id)}','${x.status==='Pending'?'Confirmed':'Cancelled'}')">${x.status==='Pending'?'Confirm':'Cancel'}</button></td></tr>`).join('');
 $('#menuEditor').innerHTML=m.map((x,i)=>`<div class="edit-row" data-id="${x.id}"><input data-k="category" value="${escapeAttr(x.category)}"><input data-k="name" value="${escapeAttr(x.name)}"><input data-k="description" value="${escapeAttr(x.description)}"><input data-k="price" type="number" value="${Number(x.price)||0}"><button class="remove" onclick="removeItem('${x.id}')">×</button></div>`).join('');
}
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(v){return escapeHtml(v);}
window.statusReq=async(id,status)=>{try{await api('/api/admin',{method:'PUT',body:JSON.stringify({kind:'request',id:decodeURIComponent(id),status})});await load();}catch(e){alert(e.message)}};
window.removeItem=async(id)=>{if(!confirm('Remove this menu item?'))return;try{await api('/api/admin',{method:'DELETE',body:JSON.stringify({id})});await load();}catch(e){alert(e.message)}};
$('#addItem').onclick=async()=>{try{await api('/api/admin',{method:'POST',body:JSON.stringify({kind:'menu',category:'Mains',name:'New dish',description:'Description',price:0,sort_order:999})});await load();}catch(e){alert(e.message)}};
$('#saveMenu').onclick=async()=>{try{for(const row of document.querySelectorAll('.edit-row')){const get=k=>row.querySelector(`[data-k="${k}"]`).value;await api('/api/admin',{method:'PUT',body:JSON.stringify({kind:'menu',id:row.dataset.id,category:get('category'),name:get('name'),description:get('description'),price:get('price')})});}alert('Menu saved successfully. Changes are now live for every visitor.');await load();}catch(e){alert(e.message)}};
$('#clearBookings').onclick=async()=>{alert('For safety, bulk deletion is disabled in this version. You can change request status from the panel without accidentally deleting the restaurant history.');};
load();
