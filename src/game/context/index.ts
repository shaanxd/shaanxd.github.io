import kaplay from "kaplay";

export default kaplay({
  width: window.innerWidth,
  height: window.innerHeight,
  global: false,
  debug: true,
  debugKey: "=",
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  pixelDensity: devicePixelRatio,
});
