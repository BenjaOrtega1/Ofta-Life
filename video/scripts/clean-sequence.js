const path = require("path");
const fs = require("fs-extra");

const rootDir = path.resolve(__dirname, "..");

// Carpetas generadas por el flujo. Este script no borra otros archivos del proyecto.
const pngDir = path.resolve(rootDir, "public/sequence/png");
const webpDir = path.resolve(rootDir, "public/sequence/webp");

async function main() {
  await fs.ensureDir(pngDir);
  await fs.ensureDir(webpDir);

  await fs.emptyDir(pngDir);
  await fs.emptyDir(webpDir);

  console.log("Carpetas limpiadas:");
  console.log("public/sequence/png");
  console.log("public/sequence/webp");
}

main().catch((error) => {
  console.error("Error al limpiar la secuencia:");
  console.error(error.message);
  process.exit(1);
});
