/* =====================================================
   GALLERY.JS
   - عرض الصور الأساسية
   - فتح SVG للتلوين
   - لوحة فاضية
===================================================== */

const Gallery = (() => {

  const imagesPath = "images/";
  const imagesList = [
    "1.svg",
    "2.svg",
    "3.svg",
    "4.svg"
  ];

  /* ================= INIT ================= */

  function init() {
    renderImages();
  }

  /* ================= RENDER ================= */

  function renderImages() {
    const container = document.getElementById("gallery");
    container.innerHTML = "";

    imagesList.forEach(img => {
      const thumb = document.createElement("div");
      thumb.className = "gallery-item";
      thumb.textContent = img;

      thumb.onclick = () => openImage(imagesPath + img);

      container.appendChild(thumb);
    });

    // لوحة فاضية
    const blank = document.createElement("div");
    blank.className = "gallery-item blank";
    blank.textContent = "لوحة فاضية";
    blank.onclick = openBlankCanvas;

    container.appendChild(blank);
  }

  /* ================= OPEN IMAGE ================= */

  async function openImage(path) {
    const profile = getActiveProfile();
    if (!profile) {
      alert("اختار بروفايل الأول");
      return;
    }

    const res = await fetch(path);
    const svgText = await res.text();

    openEditor(svgText);
  }

  function openBlankCanvas() {
    const profile = getActiveProfile();
    if (!profile) {
      alert("اختار بروفايل الأول");
      return;
    }

    const blankSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <rect width="100%" height="100%" fill="white"/>
    </svg>`;

    openEditor(blankSVG);
  }

  /* ================= EDITOR ================= */

  function openEditor(svgText) {
    document.getElementById("home").style.display = "none";
    document.getElementById("editor").style.display = "block";

    const container = document.getElementById("svgContainer");
    container.innerHTML = svgText;

    // بعد كده:
    // Paint.init()
  }

  return {
    init
  };

})();

/* ================= AUTO INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  Gallery.init();
});
