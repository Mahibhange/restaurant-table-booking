const fallbackMenu=[
{category:"Starters",name:"Tandoori Broccoli",description:"Charred broccoli, hung curd, sesame",price:320},
{category:"Starters",name:"Paneer Tikka ÉLAN",description:"Smoked paneer, pepper relish, mint",price:380},
{category:"Starters",name:"Dahi Kebab",description:"Crisp hung-curd kebabs, mint chutney",price:300},
{category:"Starters",name:"Cheese Corn Cigars",description:"Golden pastry, sweet corn, cheese, herb dip",price:280},
{category:"Starters",name:"Peri Peri Paneer Skewers",description:"Charred paneer, peppers, house peri peri",price:360},
{category:"Starters",name:"Crispy Lotus Stem",description:"Lightly fried lotus stem, sesame chilli glaze",price:320},
{category:"Soups & Salads",name:"Roasted Tomato Basil Soup",description:"Slow-roasted tomato, basil oil, cream",price:220},
{category:"Soups & Salads",name:"Creamy Mushroom Soup",description:"Wild mushrooms, herbs, black pepper",price:250},
{category:"Soups & Salads",name:"ÉLAN Garden Salad",description:"Seasonal greens, vegetables, seeds, citrus dressing",price:280},
{category:"Mains",name:"Truffle Mushroom Pasta",description:"Creamy mushroom sauce, parmesan, herbs",price:540},
{category:"Mains",name:"ÉLAN Paneer Steak",description:"Grilled paneer, pepper jus, roasted vegetables",price:590},
{category:"Mains",name:"Smoked Dal Makhani",description:"Slow-cooked black lentils, garlic naan",price:420},
{category:"Mains",name:"Vegetable Biryani",description:"Basmati rice, seasonal vegetables, raita",price:390},
{category:"Mains",name:"Paneer Lababdar",description:"Soft paneer, tomato gravy, cream, kasuri methi",price:440},
{category:"Mains",name:"Kadhai Paneer",description:"Paneer, peppers, onion and aromatic spices",price:430},
{category:"Mains",name:"Palak Paneer",description:"Cottage cheese in silky spinach gravy",price:410},
{category:"Mains",name:"Veg Lasagna",description:"Layered vegetables, tomato sauce, béchamel and cheese",price:520},
{category:"Mains",name:"Butter Garlic Naan",description:"Tandoor-baked naan finished with garlic butter",price:110},
{category:"Mains",name:"Jeera Rice",description:"Fragrant basmati rice with toasted cumin",price:190},
{category:"Desserts",name:"Saffron Tres Leches",description:"Milk cake, saffron, pistachio",price:290},
{category:"Desserts",name:"Dark Chocolate Tart",description:"Sea salt, vanilla cream",price:320},
{category:"Desserts",name:"Gulab Jamun Cheesecake",description:"Creamy cheesecake, warm gulab jamun, pistachio",price:340},
{category:"Desserts",name:"Kesar Pista Kulfi",description:"Traditional saffron kulfi with pistachio",price:220},
{category:"Beverages",name:"Classic Cold Coffee",description:"Chilled coffee, cream and cocoa",price:220},
{category:"Beverages",name:"Rose & Lychee Cooler",description:"Lychee, rose, citrus and sparkling water",price:240},
{category:"Beverages",name:"Fresh Lime Mint",description:"Fresh lime, mint and a light fizz",price:180},
{category:"Beverages",name:"Masala Chai",description:"Indian spiced tea, served hot",price:130}
];
async function getMenu(){try{const r=await fetch('/api/menu');if(!r.ok)throw 0;const m=await r.json();return m.length?m:fallbackMenu;}catch{return fallbackMenu;}}
async function renderMenu(){const m=await getMenu(),cats=["All",...new Set(m.map(x=>x.category))],tabs=document.querySelector('#tabs'),list=document.querySelector('#menuList');tabs.innerHTML=cats.map((c,i)=>`<button class="${i===0?'active':''}" data-cat="${c}">${c}</button>`).join('');const draw=c=>{list.innerHTML=m.filter(x=>c==='All'||x.category===c).map(x=>`<article><div><small>${x.category.toUpperCase()}</small><h2>${x.name}</h2><p>${x.description}</p></div><b>₹${x.price}</b></article>`).join('');};draw('All');tabs.onclick=e=>{if(e.target.tagName!=='BUTTON')return;tabs.querySelectorAll('button').forEach(x=>x.classList.remove('active'));e.target.classList.add('active');draw(e.target.dataset.cat);};}
renderMenu();
