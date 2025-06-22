const fs = require("fs");
const path = require("path");

const sanitize = (name) => {
  try {
    const filePath = path.resolve(__dirname, `public/${name}`);
    const data = fs.readFileSync(filePath);

    const parsed = JSON.parse(data);

    /** Remove any layer that is not named below */
    let layers = parsed.layers
      .filter(({ name }) =>
        [
          "boundaries",
          "interactables",
          "spawnpoints",
          "doors",
          "characters",
          "placements",
          "texts",
        ].includes(name)
      )
      /** Only pick up the required elements */
      .map(({ width, height, id, name, opacity, x, y, objects }) => ({
        width,
        height,
        id,
        name,
        opacity,
        x,
        y,
        objects,
      }));

    const sanitized = { layers };

    fs.writeFileSync(filePath, JSON.stringify(sanitized));
  } catch (err) {
    console.error(
      "[Error]",
      `Sanitization failed in ${name} due to ${err.message}`
    );
  }
};

[
  "maps/apartment.json",
  "maps/balcony.json",
  "ui/info.json",
  "ui/settings.json",
].forEach((file) => {
  sanitize(file);
});
