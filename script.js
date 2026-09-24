const SUPABASE_URL = "https://thiqoziaxotzxvlywcwg.supabase.co";
const SUPABASE_KEY = "sb_publishable_7kuQZcKSGEDnmUEHpzRmJg_qwcBrY0Z";

const supabaseHeaders = {
  "apikey": SUPABASE_KEY,
  "Authorization": "Bearer " + SUPABASE_KEY,
  "Content-Type": "application/json"
};

const CONFIG = {
  phone: "05401001611",
  wa: "905401001611"
};

let state = {
  cats: [],
  ads: []
};

/* =========================
   SUPABASE
========================= */

async function api(path, options = {}) {
  const response = await fetch(
    SUPABASE_URL + "/rest/v1/" + path,
    {
      ...options,
      headers: {
        ...supabaseHeaders,
        ...(options.headers || {})
      }
    }
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Supabase hatası:", text);
    throw new Error(text || "Supabase bağlantı hatası");
  }

  return text ? JSON.parse(text) : null;
}

async function loadData() {
  try {
    const categories = await api(
      "categories?select=*&active=eq.true&order=sort_order.asc"
    );

    const listings = await api(
      "listings?select=*&active=eq.true&order=created_at.desc"
    );

    state.cats = Array.isArray(categories) ? categories : [];
    state.ads = Array.isArray(listings) ? listings : [];

    render();

  } catch (error) {
    console.error(error);

    document.getElementById("categories").innerHTML =
      "<p>Veriler yüklenirken bir hata oluştu. Sayfayı yenileyin.</p>";
  }
}

/* =========================
   YARDIMCI
========================= */

function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m])
  );
}

function go(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth"
    });
  }
}

function getCategory(id) {
  return state.cats.find(c => c.id === id);
}

function getCategoryName(id) {
  const c = getCategory(id);
  return c ? c.name : "";
}

/* =========================
   İLETİŞİM
========================= */

document.getElementById("wa").href =
  "https://wa.me/" + CONFIG.wa;

document.getElementById("tel").href =
  "tel:" + CONFIG.phone;

/* =========================
   KATEGORİLER
========================= */

function renderCats() {

  const el = document.getElementById("categories");

  if (!state.cats.length) {
    el.innerHTML =
      "<p>Henüz kategori bulunmuyor.</p>";
    return;
  }

  el.innerHTML = state.cats.map(c => `
    <article
      class="cat"
      onclick="showCat('${c.id}')"
    >
      <img
        src="${esc(c.image_url || "assets/concept-hero.png")}"
        alt="${esc(c.name)}"
      >

      <div class="ct">
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.description || "")}</p>
      </div>
    </article>
  `).join("");
}

/* =========================
   KATEGORİ GÖSTER
========================= */

function showCat(id) {

  const c = getCategory(id);

  if (!c) return;

  const ads = state.ads.filter(
    a => a.category_id === id
  );

  const categoryView =
    document.getElementById("categoryView");

  let items = ads;

  if (!items.length) {

    const defaultItems = {
      akvaryum: [
        "Gurami",
        "Beta",
        "Lepistes",
        "Zebra Danio"
      ],
      organizasyon: [
        "Sandalye",
        "Masa",
        "Tüplü Büyük Boy Çaycı",
        "Elektrikli Büyük Boy Çaycı",
        "Projektör Işık"
      ],
      zeytin: [
        "Antalya Doğal Soğuk Sıkım Zeytinyağı",
        "Çizik Yeşil Zeytin"
      ],
      nakliye: [
        "Kasalı Levent Transit"
      ],
      ilaclama: [
        "Hamamböceği",
        "Karınca",
        "Örümcek",
        "Tahta Kurusu"
      ]
    };

    const slug = c.slug || "";

    items = (defaultItems[slug] || []).map(name => ({
      title: name,
      description:
        "Detaylı bilgi için bizimle iletişime geçebilirsiniz.",
      image_url: "assets/concept-hero.png"
    }));
  }

  categoryView.innerHTML = `
    <div class="category-title">
      <div>
        <span class="eyebrow">
          ${esc(c.name).toUpperCase()}
        </span>

        <h3>${esc(c.name)}</h3>

        <p>${esc(c.description || "")}</p>
      </div>
    </div>

    <div class="cards">

      ${items.map(a => `

        <article class="card">

          <img
            src="${esc(
              a.image_url ||
              "assets/concept-hero.png"
            )}"
            alt="${esc(a.title || "")}"
          >

          <div class="pad">

            <span class="tag">
              ${esc(c.name)}
            </span>

            <h4>
              ${esc(a.title || "")}
            </h4>

            <p>
              ${esc(a.description || "")}
            </p>

            <button onclick="contact()">
              Bilgi Al
            </button>

          </div>

        </article>

      `).join("")}

    </div>
  `;

  categoryView.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* =========================
   ANA RENDER
========================= */

function render() {

  renderCats();

  if (state.cats.length) {
    showCat(state.cats[0].id);
  }
}

/* =========================
   İLETİŞİM MODALI
========================= */

function contact() {

  document.getElementById("modalContent").innerHTML = `
    <h2>Size nasıl ulaşırım?</h2>

    <p>
      WhatsApp'tan mesaj gönderebilir
      veya doğrudan arayabilirsiniz.
    </p>

    <p>
      <b>Telefon:</b> ${CONFIG.phone}
    </p>

    <div class="actions">

      <a
        class="btn wa"
        href="https://wa.me/${CONFIG.wa}"
      >
        WhatsApp
      </a>

      <a
        class="btn tel"
        href="tel:${CONFIG.phone}"
      >
        Hemen Ara
      </a>

    </div>
  `;

  document
    .getElementById("modal")
    .classList.add("show");
}

function closeModal() {

  document
    .getElementById("modal")
    .classList.remove("show");
}

/* =========================
   SOHBET
========================= */

function chatOpen() {
  document
    .getElementById("chat")
    .classList.add("show");
}

function chatClose() {
  document
    .getElementById("chat")
    .classList.remove("show");
}

function addMsg(text, user) {

  const d = document.createElement("div");

  d.className =
    "msg " + (user ? "user" : "bot");

  d.textContent = text;

  document
    .getElementById("msgs")
    .appendChild(d);

  document
    .getElementById("msgs")
    .scrollTop = 99999;
}

function ask(text) {

  chatOpen();

  document.getElementById("chatInput").value = text;

  send(new Event("submit"));
}

function send(e) {

  e.preventDefault();

  const input =
    document.getElementById("chatInput");

  const text = input.value.trim();

  if (!text) return;

  addMsg(text, true);

  input.value = "";

  setTimeout(() => {
    addMsg(reply(text), false);
  }, 180);
}

function reply(text) {

  const x = text.toLowerCase();

  if (x.includes("akvaryum"))
    return "Akvaryum bölümünde Gurami, Beta, Lepistes ve Zebra Danio seçeneklerimizi bulabilirsiniz. 🐠";

  if (x.includes("zeytin"))
    return "Antalya doğal zeytin ürünlerimiz hakkında bilgi alabilirsiniz. 🫒";

  if (x.includes("organizasyon"))
    return "Masa, sandalye, çaycı ve projektör gibi organizasyon ekipmanlarımız bulunuyor. 🎉";

  if (x.includes("nakliye"))
    return "Kasası kapalı Levent Transit ile nakliye hizmetimiz bulunuyor. 🚚";

  if (
    x.includes("ilaç") ||
    x.includes("ilac")
  )
    return "Haşere kontrolü ve ilaçlama hizmetimiz hakkında bilgi alabilirsiniz. 🦟";

  return "Size yardımcı olabilirim 😊 Akvaryum, zeytin, organizasyon, nakliye veya ilaçlama seçeneklerinden hangisiyle ilgileniyorsunuz?";
}

/* =========================
   ADMİN GİRİŞ
========================= */

function adminLogin() {

  document.getElementById("modalContent").innerHTML = `
    <h2>Yönetici Paneli</h2>

    <p>
      İlan eklemek ve kategori açıklamalarını
      değiştirmek için giriş yapın.
    </p>

    <div class="field">

      <label>Şifre</label>

      <input
        id="adminPass"
        type="password"
        placeholder="Yönetici şifresi"
      >

    </div>

    <button
      class="primary"
      onclick="adminAuth()"
    >
      Giriş Yap
    </button>
  `;

  document
    .getElementById("modal")
    .classList.add("show");
}

function adminAuth() {

  if (
    document.getElementById("adminPass").value !==
    "GulerAdmin"
  ) {
    alert("Şifre hatalı.");
    return;
  }

  adminPanel();
}

/* =========================
   ADMİN PANELİ
========================= */
async function siteAyarlariKaydet() {

function adminPanel() {

  document.getElementById("modalContent").innerHTML = `
    <h2>Yönetici Paneli</h2>

    <h3>İlan Ekle</h3>

    <div class="formgrid">

      <div class="field">

        <label>İlan adı</label>

        <input
          id="adName"
          placeholder="Örn. Mavi Gurami"
        >

      </div>

      <div class="field">

        <label>Kategori</label>

        <select id="adCat">

          ${state.cats.map(c => `
            <option value="${c.id}">
              ${esc(c.name)}
            </option>
          `).join("")}

        </select>

      </div>

    </div>

    <div class="field">

      <label>Açıklama</label>

      <textarea
        id="adDesc"
        placeholder="İlan açıklaması"
      ></textarea>

    </div>

    <div class="field">

      <label>Görsel</label>

      <input
        id="adImage"
        type="file"
        accept="image/*"
      >

    </div>

    <button
      class="primary"
      onclick="addAd()"
    >
      İlanı Yayınla
    </button>

    <hr>
    <h3>Site Ayarları</h3>

<div class="formgrid">

  <div class="field">
    <label>Site Adı</label>
    <input id="siteNameAdmin" placeholder="Güler Nature & Work">
  </div>

  <div class="field">
    <label>Slogan</label>
    <input id="siteSloganAdmin" placeholder="Slogan">
  </div>

  <div class="field">
    <label>Logo Görseli</label>
    <input id="siteLogoAdmin" type="file" accept="image/*">
  </div>

  <div class="field">
    <label>Arka Plan Görseli</label>
    <input id="siteBgAdmin" type="file" accept="image/*">
  </div>

</div>

<button
  class="birincil"
  onclick="siteAyarlariKaydet()"
>
  Site Ayarlarını Kaydet
</button>

<hr>

    <h3>Kategori Açıklamaları</h3>

    <div id="catForms"></div>

    <hr>

    <h3>Yayınlanan İlanlar</h3>

    <div id="adminAds"></div>
  `;

  renderAdmin();
}

/* =========================
   ADMİN LİSTE
========================= */

function renderAdmin() {

  const catForms =
    document.getElementById("catForms");

  const adminAds =
    document.getElementById("adminAds");

  catForms.innerHTML = state.cats.map(c => `
    <div class="field">

      <label>${esc(c.name)}</label>

      <textarea id="desc_${c.id}">
${esc(c.description || "")}
      </textarea>

      <button
        class="primary"
        onclick="saveCat('${c.id}')"
      >
        Açıklamayı Kaydet
      </button>

    </div>
  `).join("");

  if (!state.ads.length) {

    adminAds.innerHTML =
      "Henüz eklenmiş ilan yok.";

    return;
  }

  adminAds.innerHTML =
    state.ads.map(a => `

      <div class="admin-item">

        <strong>
          ${esc(a.title)}
        </strong>

        <span>
          ${esc(getCategoryName(a.category_id))}
        </span>

        <div class="admin-actions">

          <button
            onclick="editAd('${a.id}')"
          >
            Düzenle
          </button>

          <button
            class="danger"
            onclick="deleteAd('${a.id}')"
          >
            Sil
          </button>

        </div>

      </div>

    `).join("");
}

/* =========================
   İLAN EKLE
========================= */

async function addAd() {

  const name =
    document.getElementById("adName")
      .value.trim();

  const category_id =
    document.getElementById("adCat")
      .value;

  const description =
    document.getElementById("adDesc")
      .value.trim();

  const file =
    document.getElementById("adImage")
      .files[0];

  if (!name) {
    alert("İlan adı gerekli.");
    return;
  }

  try {

    let image_url =
      "assets/concept-hero.png";

    if (file) {
      image_url =
        await fileToData(file);
    }

    await api("listings", {

      method: "POST",

      headers: {
        "Prefer": "return=representation"
      },

      body: JSON.stringify({
        category_id: category_id,
        title: name,
        description: description,
        image_url: image_url,
        whatsapp: CONFIG.wa,
        phone: CONFIG.phone,
        active: true
      })

    });

    alert("İlan yayınlandı.");

    await loadData();

    adminPanel();

  } catch (error) {

    console.error(error);

    alert(
      "İlan kaydedilemedi. Supabase hatasını kontrol et."
    );
  }
}

/* =========================
   DOSYA -> DATA URL
========================= */

function fileToData(file) {

  return new Promise((resolve, reject) => {

    const reader =
      new FileReader();

    reader.onload = () =>
      resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

/* =========================
   KATEGORİ AÇIKLAMASI
========================= */

async function saveCat(id) {

  const textarea =
    document.getElementById("desc_" + id);

  if (!textarea) return;

  const description =
    textarea.value;

  try {

    await api(
      "categories?id=eq." +
      encodeURIComponent(id),
      {
        method: "PATCH",

        headers: {
          "Prefer": "return=minimal"
        },

        body: JSON.stringify({
          description: description
        })
      }
    );

    alert(
      "Kategori açıklaması güncellendi."
    );

    await loadData();

    adminPanel();

  } catch (error) {

    console.error(error);

    alert(
      "Kategori güncellenemedi. Supabase izinlerini kontrol et."
    );
  }
}

/* =========================
   İLAN SİL
========================= */

async function deleteAd(id) {

  if (!confirm("Bu ilan silinsin mi?"))
    return;

  try {

    await api(
      "listings?id=eq." +
      encodeURIComponent(id),
      {
        method: "DELETE",
        headers: {
          "Prefer": "return=minimal"
        }
      }
    );

    await loadData();

    adminPanel();

  } catch (error) {

    console.error(error);

    alert("İlan silinemedi.");
  }
}

/* =========================
   İLAN DÜZENLE
========================= */

function editAd(id) {

  const ad =
    state.ads.find(a => a.id === id);

  if (!ad) return;

  document.getElementById("modalContent").innerHTML = `

    <h2>İlan Düzenle</h2>

    <div class="field">

      <label>İlan adı</label>

      <input
        id="editName"
        value="${esc(ad.title)}"
      >

    </div>

    <div class="field">

      <label>Açıklama</label>

      <textarea
        id="editDesc"
      >${esc(ad.description || "")}</textarea>

    </div>

    <button
      class="primary"
      onclick="saveEdit('${ad.id}')"
    >
      Kaydet
    </button>
  `;

  document
    .getElementById("modal")
    .classList.add("show");
}

/* =========================
   DÜZENLE KAYDET
========================= */

async function saveEdit(id) {

  const title =
    document.getElementById("editName")
      .value.trim();

  const description =
    document.getElementById("editDesc")
      .value.trim();

  if (!title) {
    alert("İlan adı boş olamaz.");
    return;
  }

  try {

    await api(
      "listings?id=eq." +
      encodeURIComponent(id),
      {
        method: "PATCH",

        headers: {
          "Prefer": "return=minimal"
        },

        body: JSON.stringify({
          title: title,
          description: description
        })
      }
    );

    await loadData();

    adminPanel();

  } catch (error) {

    console.error(error);

    alert("İlan güncellenemedi.");
  }
}

/* =========================
   BAŞLAT
========================= */

loadData();
