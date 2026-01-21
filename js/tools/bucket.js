// js/tools/bucket.js

const Bucket = (() => {
  let svg, drawLayer, saveCallback;
  let fillColor = "#000000";

  // أداة ملء المنطقة داخل الخطوط (مبسطة)
  // تستخدم تقنية Flood Fill على عنصر SVG path أو polygon

  function attach(svgel, drawl, saveCb) {
    svg = svgel;
    drawLayer = drawl;
    saveCallback = saveCb;
    svg.addEventListener("click", onClick);
  }

  function detach() {
    svg.removeEventListener("click", onClick);
  }

  function onClick(e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    // نحاول نملأ الشكل الموجود تحت النقطة
    const target = getTargetPath(svgP);

    if (target) {
      // إذا العنصر موجود، نغير لونه ب fillColor
      target.setAttribute("fill", fillColor);
      saveCallback();
    }
  }

  function getTargetPath(point) {
    // البحث عن العنصر الذي يحتوي النقطة
    // نفحص جميع عناصر الرسم في الطبقة ونستخدم containsPoint تقريبياً عبر isPointInFill

    // نستخدم hit-testing مبسط
    const elements = drawLayer.children;
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (typeof el.isPointInFill === "function") {
        const svgPoint = svg.createSVGPoint();
        svgPoint.x = point.x;
        svgPoint.y = point.y;
        try {
          if (el.isPointInFill(svgPoint)) {
            return el;
          }
        } catch {
          // بعض المتصفحات لا تدعم isPointInFill لعنصر SVG
        }
      }
      // كبديل، نتحقق من النقطة داخل حدود عنصر (bounding box)
      const bbox = el.getBBox();
      if (point.x >= bbox.x && point.x <= bbox.x + bbox.width &&
          point.y >= bbox.y && point.y <= bbox.y + bbox.height) {
        return el;
      }
    }
    return null;
  }

  function setColor(c) {
    fillColor = c;
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
    setColor,
  };
})();
