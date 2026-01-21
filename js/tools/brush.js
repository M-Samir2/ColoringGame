// js/tools/brush.js

const Brush = (() => {
  let svg, drawLayer, saveCallback;

  let color = "#000000";
  let size = 10;
  let drawing = false;
  let pathElement = null;
  let points = [];

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
    if (e.pointerType === "mouse" || e.pointerType === "touch" || e.pointerType === "pen") {
      drawing = true;
      points = [];
      pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathElement.setAttribute("stroke", color);
      pathElement.setAttribute("stroke-width", size);
      pathElement.setAttribute("fill", "none");
      pathElement.setAttribute("stroke-linecap", "round");
      pathElement.setAttribute("stroke-linejoin", "round");
      drawLayer.appendChild(pathElement);
      addPoint(e);
    }
  }

  function pointerMove(e) {
    if (!drawing) return;
    addPoint(e);
    updatePath();
  }

  function pointerUp(e) {
    if (!drawing) return;
    drawing = false;
    if (points.length < 2) {
      // نقطة واحدة ترسم دائرة صغيرة
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", points[0].x);
      circle.setAttribute("cy", points[0].y);
      circle.setAttribute("r", size / 2);
      circle.setAttribute("fill", color);
      drawLayer.removeChild(pathElement);
      drawLayer.appendChild(circle);
    }
    saveCallback();
  }

  function addPoint(e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    points.push({ x: svgP.x, y: svgP.y });
  }

  function updatePath() {
    if (points.length < 2) return;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    pathElement.setAttribute("d", d);
  }

  function setColor(c) {
    color = c;
  }

  function setSize(s) {
    size = s;
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
    setSize,
  };
})();
