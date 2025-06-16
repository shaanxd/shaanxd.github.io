import kaplay from "kaplay";

export default kaplay({
  width: window.innerWidth,
  height: window.innerHeight,
  global: false,
  debug: !import.meta.env.PROD,
  debugKey: "`",
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  pixelDensity: devicePixelRatio,
});
