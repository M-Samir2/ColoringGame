// js/tools/zoom.js

const Zoom = (() => {
  let svg, container, currentScale = 1, minScale = 1, maxScale = 4;
  let originX = 0, originY = 0;
  let lastTouches = [];

  function attach(svgElement, containerElement) {
    svg = svgElement;
    container = containerElement;

    container.style.touchAction = "none";

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
  }

  function detach() {
    container.removeEventListener("wheel", onWheel);
    container.removeEventListener("pointerdown", onPointerDown);
    container.removeEventListener("pointermove", onPointerMove);
    container.removeEventListener("pointerup", onPointerUp);
    container.removeEventListener("pointercancel", onPointerUp);
    container.removeEventListener("pointerleave", onPointerUp);
  }

  // تحديث ترانسفورم (zoom + pan)
  function updateTransform() {
    svg.style.transform = `translate(${originX}px, ${originY}px) scale(${currentScale})`;
  }

  // عجلة الفأرة للزوم (desktop)
  function onWheel(e) {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    zoomAt(e.clientX, e.clientY, delta);
  }

  // زوم عند نقطة محددة
  function zoomAt(clientX, clientY, deltaScale) {
    const prevScale = currentScale;
    currentScale = Math.min(maxScale, Math.max(minScale, currentScale + deltaScale));
    const scaleChange = currentScale / prevScale;

    // نحدث الإزاحة بحيث يبقى مركز الزوم ثابت
    originX = clientX - scaleChange * (clientX - originX);
    originY = clientY - scaleChange * (clientY - originY);

    updateTransform();
  }

  // متغيرات البانش واللمس المتعدد
  let isPanning = false;
  let panStart = { x: 0, y: 0 };

  // لأحداث البانش
  let pointers = new Map();

  function onPointerDown(e) {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      isPanning = true;
      panStart = { x: originX - e.clientX, y: originY - e.clientY };
    }
  }

  function onPointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1 && isPanning) {
      // بانش واحد: تحريك
      originX = e.clientX + panStart.x;
      originY = e.clientY + panStart.y;
      updateTransform();
    } else if (pointers.size === 2) {
      // لمستين: زوم + بانش
      const points = Array.from(pointers.values());
      const currentDist = getDistance(points[0], points[1]);
      const currentMid = getMidpoint(points[0], points[1]);

      if (!Zoom._initialDist) {
        Zoom._initialDist = currentDist;
        Zoom._initialScale = currentScale;
        Zoom._initialOrigin = { x: originX, y: originY };
      }

      // حساب نسبة التغيير في الزوم
      const scaleFactor = currentDist / Zoom._initialDist;
      currentScale = Math.min(maxScale, Math.max(minScale, Zoom._initialScale * scaleFactor));

      // تحديث الإزاحة لجعل نقطة الوسط ثابتة
      originX = currentMid.x - scaleFactor * (currentMid.x - Zoom._initialOrigin.x);
      originY = currentMid.y - scaleFactor * (currentMid.y - Zoom._initialOrigin.y);

      updateTransform();
    }
  }

  function onPointerUp(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) {
      Zoom._initialDist = null;
      Zoom._initialScale = null;
      Zoom._initialOrigin = null;
    }
    if (pointers.size === 0) {
      isPanning = false;
    }
  }

  function getDistance(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }

  function getMidpoint(p1, p2) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  }

  // دوال للتحكم يدوي بالزوم (زر + و -)
  function zoomIn() {
    zoomAt(window.innerWidth / 2, window.innerHeight / 2, 0.2);
  }

  function zoomOut() {
    zoomAt(window.innerWidth / 2, window.innerHeight / 2, -0.2);
  }

  return {
    attach,
    detach,
    zoomIn,
    zoomOut,
    get currentScale() { return currentScale; },
  };
})();
