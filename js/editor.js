// js/editor.js

const Editor = (() => {

  let container;
  let svg;
  let baseLayer;
  let drawLayer;

  let history = [];
  let historyIndex = -1;

  let currentTool = null;

  /* ================= INIT ================= */

  function init() {
    container = document.getElementById("editorContainer");

    // أزرار التوب
    document.getElementById("undoBtn").onclick = undo;
    document.getElementById("redoBtn").onclick = redo;
    document.getElementById("saveBtn").onclick = saveImage;
    document.getElementById("backHomeBtn").onclick = App.backToHome;
    document.getElementById("fullscreenBtn").onclick = toggleFullscreen;

    // أدوات
    document.querySelectorAll("[data-tool]").forEach(btn => {
      btn.onclick = () => setTool(btn.dataset.tool);
    });

    // حجم الفرشة
    document.getElementById("brushSize").oninput = e => {
      if (window.Brush) {
        Brush.setSize(+e.target.value);
      }
    };

    buildPalette();
  }

  /* ================= LOAD SVG ================= */

  function openSVG(svgText) {
    container.innerHTML = "";
    history = [];
    historyIndex = -1;

    container.insertAdjacentHTML("beforeend", svgText);
    svg = container.querySelector("svg");

    if (!svg) {
      alert("الملف غير صالح");
      return;
    }

    prepareSVG();
    saveState();
  }

  function openBlank() {
    const blankSVG = `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 1000 1000"
           width="100%" height="100%">
        <rect width="100%" height="100%" fill="#ffffff"/>
      </svg>
    `;
    openSVG(blankSVG);
  }

  /* ================= SVG SETUP ================= */

  function prepareSVG() {
    svg.setAttribute("id", "editorSVG");
    svg.style.touchAction = "none";

    // Base layer
    baseLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    baseLayer.setAttribute("id", "baseLayer");

    // Draw layer
    drawLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    drawLayer.setAttribute("id", "drawLayer");

    // نقل كل العناصر الحالية للـ base
    [...svg.children].forEach(el => baseLayer.appendChild(el));

    svg.appendChild(baseLayer);
    svg.appendChild(drawLayer);

    // قفل الطبقة الأساسية
    baseLayer.style.pointerEvents = "none";

    // تفعيل الأدوات
    Brush.attach(svg, drawLayer, saveState);
    Eraser.attach(svg, drawLayer, saveState);
    Bucket.attach(svg, baseLayer, saveState);
    Zoom.attach(svg);

    setTool("brush");
  }

  /* ================= TOOLS ================= */

  function setTool(tool) {
    currentTool = tool;

    Brush.disable();
    Eraser.disable();
    Bucket.disable();

    if (tool === "brush") Brush.enable();
    if (tool === "eraser") Eraser.enable();
    if (tool === "bucket") Bucket.enable();
  }

  /* ================= HISTORY ================= */

  function saveState() {
    const snapshot = drawLayer.innerHTML;
    history = history.slice(0, historyIndex + 1);
    history.push(snapshot);
    historyIndex++;
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    drawLayer.innerHTML = history[historyIndex];
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    historyIndex++;
    drawLayer.innerHTML = history[historyIndex];
  }

  /* ================= SAVE ================= */

  function saveImage() {
    const serializer = new XMLSerializer();
    const data = serializer.serializeToString(svg);

    Storage.saveArtwork(data);
    alert("تم الحفظ في الألبوم ✅");
  }

  /* ================= UI ================= */

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function buildPalette() {
    const colors = [
      "#000000","#ff0000","#00aa00","#0000ff",
      "#ffff00","#ff9900","#ff00ff","#00ffff",
      "#ffffff","#888888","#964b00","#8a2be2"
    ];

    const palette = document.getElementById("colorPalette");
    palette.innerHTML = "";

    colors.forEach(c => {
      const d = document.createElement("div");
      d.className = "color";
      d.style.background = c;
      d.onclick = () => {
        document.querySelectorAll(".color").forEach(x => x.classList.remove("active"));
        d.classList.add("active");
        Brush.setColor(c);
        Bucket.setColor(c);
      };
      palette.appendChild(d);
    });

    palette.firstChild.classList.add("active");
    Brush.setColor(colors[0]);
    Bucket.setColor(colors[0]);
  }

  /* ================= API ================= */

  return {
    init,
    openSVG,
    openBlank
  };

})();
