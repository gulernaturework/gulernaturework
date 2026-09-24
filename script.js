const CONFIG={phone:"05401001611",wa:"905401001611"};
const DEFAULT_CATS=[
 {id:"akvaryum",name:"Akvaryum",desc:"Kendi üretimimiz canlı balıklar",items:["Gurami","Beta","Lepistes","Zebra Danio"]},
 {id:"organizasyon",name:"Organizasyon",desc:"Etkinlik ve organizasyon ekipmanları",items:["Sandalye","Masa","Tüplü Büyük Boy Çaycı","Elektrikli Büyük Boy Çaycı","Projektör Işık"]},
 {id:"zeytin",name:"Zeytin",desc:"Antalya doğal zeytin ürünleri",items:["Antalya Doğal Soğuk Sıkım Zeytinyağı","Çizik Yeşil Zeytin"]},
 {id:"nakliye",name:"Nakliye",desc:"Kasası kapalı Levent Transit ile nakliye",items:["Kasalı Levent Transit"]},
 {id:"ilaclama",name:"İlaçlama",desc:"Haşere kontrol hizmetleri",items:["Hamamböceği","Karınca","Örümcek","Tahta Kurusu"]}
];
let state={cats:load("cats",DEFAULT_CATS),ads:load("ads",[])};
function load(k,d){try{return JSON.parse(localStorage.getItem("gnw_"+k))??d}catch{return d}}
function save(){localStorage.setItem("gnw_cats",JSON.stringify(state.cats));localStorage.setItem("gnw_ads",JSON.stringify(state.ads))}
function go(id){document.getElementById(id).scrollIntoView({behavior:"smooth"})}
document.getElementById("wa").href="https://wa.me/"+CONFIG.wa;
document.getElementById("tel").href="tel:"+CONFIG.phone;
function renderCats(){
 const el=document.getElementById("categories");
 el.innerHTML=state.cats.map(c=>`<article class="cat" onclick="showCat('${c.id}')"><img src="${c.cover||"assets/concept-hero.png"}"><div class="ct"><h3>${c.name}</h3><p>${c.desc||""}</p></div></article>`).join("");
}
function showCat(id){
 const c=state.cats.find(x=>x.id===id); if(!c)return;
 const ads=state.ads.filter(a=>a.cat===id);
 let items=ads.length?ads:((c.items||[]).map(name=>({name,desc:"Yeni ilanlarımızı ve detayları öğrenmek için bizimle iletişime geçebilirsiniz.",image:"assets/concept-hero.png",cat:id,temporary:true})));
 document.getElementById("categoryView").innerHTML=`<div class="category-title"><div><span class="eyebrow">${c.name.toUpperCase()}</span><h3>${c.name}</h3><p>${c.desc||""}</p></div></div><div class="cards">${items.map((a,i)=>`<article class="card"><img src="${a.image||"assets/concept-hero.png"}"><div class="pad"><span class="tag">${c.name}</span><h4>${esc(a.name)}</h4><p>${esc(a.desc||"")}</p><button onclick="contact()">Bilgi Al</button></div></article>`).join("")}</div>`;
 document.getElementById("categoryView").scrollIntoView({behavior:"smooth",block:"start"});
}
function render(){renderCats();if(state.cats[0])showCat(state.cats[0].id)}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function contact(){
 document.getElementById("modalContent").innerHTML=`<h2>Size nasıl ulaşırım?</h2><p>WhatsApp'tan mesaj gönderebilir veya doğrudan arayabilirsiniz.</p><p><b>Telefon:</b> ${CONFIG.phone}</p><div class="actions"><a class="btn wa" href="https://wa.me/${CONFIG.wa}">WhatsApp</a><a class="btn tel" href="tel:${CONFIG.phone}">Hemen Ara</a></div>`;
 document.getElementById("modal").classList.add("show")
}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function chatOpen(){document.getElementById("chat").classList.add("show")}
function chatClose(){document.getElementById("chat").classList.remove("show")}
function addMsg(t,u){const d=document.createElement("div");d.className="msg "+(u?"user":"bot");d.textContent=t;document.getElementById("msgs").appendChild(d);document.getElementById("msgs").scrollTop=99999}
function ask(t){chatOpen();document.getElementById("chatInput").value=t;send(new Event("submit"))}
function send(e){e.preventDefault();let i=document.getElementById("chatInput"),t=i.value.trim();if(!t)return;addMsg(t,true);i.value="";setTimeout(()=>addMsg(reply(t),false),180)}
function reply(t){let x=t.toLowerCase();if(x.includes("akvaryum"))return"Akvaryum bölümünde Gurami, Beta, Lepistes ve Zebra Danio ilanlarını bulabilirsiniz. 🐠";if(x.includes("zeytin"))return"Antalya doğal soğuk sıkım zeytinyağı ve çizik yeşil zeytin ilanlarımız var. 🫒";if(x.includes("organizasyon"))return"Masa, sandalye, büyük boy çaycı ve projektör ışık seçeneklerimiz bulunuyor. 🎉";if(x.includes("nakliye"))return"Kasası kapalı Levent Transit ile nakliye hizmetimiz bulunuyor. 🚚";if(x.includes("ilaç"))return"Hamamböceği, karınca, örümcek ve tahta kurusuna yönelik ilaçlama hizmetimiz var. 🦟";return"Size yardımcı olabilirim 😊 Akvaryum, zeytin, organizasyon, nakliye veya ilaçlama seçeneklerinden hangisiyle ilgileniyorsunuz?"}
function adminLogin(){
 document.getElementById("modalContent").innerHTML=`<h2>Yönetici Paneli</h2><p>İlan eklemek ve kategori açıklamalarını değiştirmek için giriş yapın.</p><div class="field"><label>Şifre</label><input id="adminPass" type="password" placeholder="Yönetici şifresi"></div><button class="primary" onclick="adminAuth()">Giriş Yap</button><p class="note">Not: Bu sürümde panel tarayıcı depolamasını kullanır. Gerçek çevrim içi yönetim için aşağıdaki yayın aşamasında Supabase gibi bir backend bağlayacağız.</p>`;
 document.getElementById("modal").classList.add("show");
}
function adminAuth(){if(document.getElementById("adminPass").value!=="GulerAdmin"){alert("Şifre hatalı.");return}adminPanel()}
function adminPanel(){
 document.getElementById("modalContent").innerHTML=`<h2>Yönetici Paneli</h2>
 <h3>İlan Ekle</h3><div class="formgrid">
 <div class="field"><label>İlan adı</label><input id="adName" placeholder="Örn. Mavi Gurami"></div>
 <div class="field"><label>Kategori</label><select id="adCat">${state.cats.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}</select></div>
 </div>
 <div class="field"><label>Açıklama</label><textarea id="adDesc" placeholder="İlan açıklaması"></textarea></div>
 <div class="field"><label>Görsel</label><input id="adImage" type="file" accept="image/*"></div>
 <button class="primary" onclick="addAd()">İlanı Yayınla</button>
 <hr><h3>Kategori Açıklamaları</h3><div id="catForms"></div>
 <hr><h3>Yayınlanan İlanlar</h3><div id="adminAds"></div>`;
 renderAdmin();
}
function renderAdmin(){
 document.getElementById("catForms").innerHTML=state.cats.map(c=>`<div class="field"><label>${c.name}</label><textarea id="desc_${c.id}">${esc(c.desc||"")}</textarea><button class="primary" onclick="saveCat('${c.id}')">Açıklamayı Kaydet</button></div>`).join("");
 document.getElementById("adminAds").innerHTML=state.ads.length?state.ads.map((a,i)=>`<div class="admin-item"><strong>${esc(a.name)}</strong><span>${a.cat}</span><div class="admin-actions"><button onclick="editAd(${i})">Düzenle</button><button class="danger" onclick="deleteAd(${i})">Sil</button></div></div>`).join(""):"Henüz eklenmiş ilan yok.";
}
async function addAd(){
 const name=document.getElementById("adName").value.trim(),cat=document.getElementById("adCat").value,desc=document.getElementById("adDesc").value.trim(),file=document.getElementById("adImage").files[0];
 if(!name)return alert("İlan adı gerekli.");
 let image="assets/concept-hero.png";
 if(file)image=await fileToData(file);
 state.ads.unshift({id:Date.now(),name,cat,desc,image});save();alert("İlan yayınlandı.");adminPanel();renderCats();
}
function fileToData(file){return new Promise((res,rej)=>{let r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function saveCat(id){let c=state.cats.find(x=>x.id===id);c.desc=document.getElementById("desc_"+id).value;save();renderCats();alert("Kategori açıklaması güncellendi.")}
function deleteAd(i){if(confirm("Bu ilan silinsin mi?")){state.ads.splice(i,1);save();adminPanel();}}
function editAd(i){let a=state.ads[i];document.getElementById("modalContent").innerHTML=`<h2>İlan Düzenle</h2><div class="field"><label>İlan adı</label><input id="editName" value="${esc(a.name)}"></div><div class="field"><label>Açıklama</label><textarea id="editDesc">${esc(a.desc||"")}</textarea></div><button class="primary" onclick="saveEdit(${i})">Kaydet</button>`}
function saveEdit(i){state.ads[i].name=document.getElementById("editName").value;state.ads[i].desc=document.getElementById("editDesc").value;save();adminPanel()}
render();
