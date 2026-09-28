module.exports = async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 const body=req.body||{};
 const email=process.env.NOTIFY_EMAIL||"mahibhange16@gmail.com";
 const from=process.env.FROM_EMAIL||"ÉLAN Website <onboarding@resend.dev>";
 let emailSent=false, whatsappSent=false;
 const subject=body.type==="reservation"?`New ÉLAN table request — ${body.name}`:`New ÉLAN contact message — ${body.name}`;
 const html=`<h2>${subject}</h2><p><b>Name:</b> ${body.name||""}</p><p><b>Phone:</b> ${body.phone||""}</p><p><b>Email:</b> ${body.email||""}</p>${body.date?`<p><b>Date:</b> ${body.date}<br><b>Time:</b> ${body.time||""}<br><b>Guests:</b> ${body.guests||""}</p>`:""}<p><b>Message / Request:</b><br>${body.message||body.notes||""}</p><p><b>Reference:</b> ${body.id||""}</p>`;
 try{if(process.env.RESEND_API_KEY){const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:[email],subject,html})});emailSent=r.ok;}}catch(e){}
 try{if(process.env.META_WA_TOKEN&&process.env.META_WA_PHONE_ID&&process.env.WA_RECIPIENT){const msg=`ÉLAN ${body.type==="reservation"?"reservation":"contact"}: ${body.name||""}, ${body.phone||""}${body.date?` | ${body.date} ${body.time||""} | ${body.guests||""} guests`:""} | ${body.message||body.notes||""}`;const r=await fetch(`https://graph.facebook.com/v20.0/${process.env.META_WA_PHONE_ID}/messages`,{method:"POST",headers:{Authorization:`Bearer ${process.env.META_WA_TOKEN}`,"Content-Type":"application/json"},body:JSON.stringify({messaging_product:"whatsapp",to:process.env.WA_RECIPIENT,type:"text",text:{body:msg}})});whatsappSent=r.ok;}}catch(e){}
 return res.status(200).json({emailSent,whatsappSent});
};
