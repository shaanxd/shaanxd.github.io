import kaplay from "kaplay";

export default kaplay({
  global: false,
  debug: !import.meta.env.PROD,
  debugKey: "`",
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  pixelDensity: devicePixelRatio,
  crisp: true,
});
