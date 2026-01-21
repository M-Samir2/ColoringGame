// js/tools/eraser.js

const Eraser = (() => {
  let svg, drawLayer, saveCallback;
  let eraserSize = 10;
  let isErasing = false;

  function attach(svgel, drawl, saveCb) {
    svg = svgel;
    drawLayer = drawl;
    saveCallback = saveCb;

    svg.addEventListener("pointerdown", pointerDown);
    svg.addEventListener("pointermove", pointerMove);
    svg.addEventListener("pointerup", pointerUp);
    svg.addEventListener("pointerleave", pointerUp);
  }

  function detach() {
    svg.removeEventListener("pointerdown", pointerDown);
    svg.removeEventListener("pointermove", pointerMove);
    svg.removeEventListener("pointerup", pointerUp);
    svg.removeEventListener("pointerleave", pointerUp);
  }

  function pointerDown(e) {
    if (e.pointerType === "touch" || e.pointerType === "mouse") {
      isErasing = true;
      eraseAt(e);
    }
  }

  function pointerMove(e) {
    if (isErasing) {
      eraseAt(e);
    }
  }

  function pointerUp(e) {
    if (isErasing) {
      isErasing = false;
      saveCallback();
    }
  }

  function eraseAt(e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    // نمسح الأشكال الملونة (في drawLayer) التي تحوي النقطة (بحجم الممحاة)
    const toRemove = [];
    const elements = drawLayer.children;
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") {
        const bbox = el.getBBox();
        const distX = Math.max(0, Math.max(bbox.x - svgP.x, svgP.x - (bbox.x + bbox.width)));
        const distY = Math.max(0, Math.max(bbox.y - svgP.y, svgP.y - (bbox.y + bbox.height)));
        if (distX * distX + distY * distY <= (eraserSize / 2) ** 2) {
          toRemove.push(el);
        }
      }
    }

    toRemove.forEach(el => {
      drawLayer.removeChild(el);
    });
  }

  function setSize(size) {
    eraserSize = size;
  }

  function enable() {
    attach(svg, drawLayer, saveCallback);
  }

  function disable() {
    detach();
  }

  return {
    attach,
    enable,
    disable,
    setSize,
  };
})();
