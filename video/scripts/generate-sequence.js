const path = require("path");
const { spawn, spawnSync } = require("child_process");
const fs = require("fs-extra");
const fg = require("fast-glob");
const sharp = require("sharp");

const rootDir = path.resolve(__dirname, "..");

// Cambia estas variables por ENV si quieres otro flujo:
// SEQUENCE_INPUT: carpeta/archivo de entrada, por defecto input/video.mp4
// SEQUENCE_FPS: FPS objetivo, por defecto 60
// WEBP_QUALITY: calidad WebP, recomendado 85-90
const inputVideo = path.resolve(rootDir, process.env.SEQUENCE_INPUT || "input/video.mp4");
const targetFps = Number(process.env.SEQUENCE_FPS || 60);
const webpQuality = Number(process.env.WEBP_QUALITY || 88);

// Carpetas de salida. Puedes cambiarlas aqui si tu app publica assets en otra ruta.
const pngDir = path.resolve(rootDir, "public/sequence/png");
const webpDir = path.resolve(rootDir, "public/sequence/webp");

function optionalRequire(packageName) {
  try {
    return require(packageName);
  } catch {
    return null;
  }
}

function resolveBinary(binaryName) {
  if (process.env[binaryName.toUpperCase() + "_PATH"]) {
    return process.env[binaryName.toUpperCase() + "_PATH"];
  }

  const found = spawnSync(binaryName, ["-version"], { encoding: "utf8" });
  if (!found.error && found.status === 0) {
    return binaryName;
  }

  const localPackage =
    binaryName === "ffmpeg"
      ? optionalRequire("@ffmpeg-installer/ffmpeg")
      : optionalRequire("@ffprobe-installer/ffprobe");

  if (localPackage && localPackage.path && fs.existsSync(localPackage.path)) {
    return localPackage.path;
  }

  return null;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      windowsHide: true,
      ...options,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      if (options.pipeStdout) process.stdout.write(chunk);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      if (options.onStderr) options.onStderr(text);
      else if (options.pipeStderr) process.stderr.write(chunk);
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(stderr || `${command} termino con codigo ${code}`));
    });
  });
}

function parseRate(rate) {
  if (!rate || rate === "0/0") return 0;
  const [num, den] = rate.split("/").map(Number);
  if (!den) return num || 0;
  return num / den;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(2)} ${units[index]}`;
}

function parseDurationSeconds(stderrChunk) {
  const match = stderrChunk.match(/Duration:\s(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
  if (!match) return null;
  const [, hours, minutes, seconds] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function parseProgressSeconds(stderrChunk) {
  const match = stderrChunk.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
  if (!match) return null;
  const [, hours, minutes, seconds] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

async function getVideoInfo(ffprobePath) {
  const args = [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=avg_frame_rate,r_frame_rate,duration",
    "-of",
    "json",
    inputVideo,
  ];

  const { stdout } = await run(ffprobePath, args);
  const data = JSON.parse(stdout);
  const stream = data.streams && data.streams[0];
  if (!stream) throw new Error("No se encontro un stream de video en input/video.mp4.");

  return {
    fps: parseRate(stream.avg_frame_rate) || parseRate(stream.r_frame_rate),
    duration: Number(stream.duration || 0),
  };
}

async function directorySize(dir) {
  const files = await fg("*.webp", { cwd: dir, absolute: true, onlyFiles: true });
  let total = 0;
  for (const file of files) {
    const stat = await fs.stat(file);
    total += stat.size;
  }
  return total;
}

async function convertPngToWebp() {
  const pngFiles = await fg("frame_*.png", {
    cwd: pngDir,
    absolute: true,
    onlyFiles: true,
  });

  if (!pngFiles.length) {
    throw new Error("FFmpeg no genero PNGs. Revisa el video de entrada y los mensajes anteriores.");
  }

  console.log(`Convirtiendo ${pngFiles.length} PNG a WebP calidad ${webpQuality}...`);

  let converted = 0;
  for (const pngFile of pngFiles.sort()) {
    const fileName = path.basename(pngFile, ".png") + ".webp";
    const outputFile = path.join(webpDir, fileName);

    await sharp(pngFile)
      .webp({
        quality: webpQuality,
        effort: 6,
        smartSubsample: true,
      })
      .toFile(outputFile);

    converted += 1;
    if (converted === pngFiles.length || converted % 25 === 0) {
      process.stdout.write(`\rWebP: ${converted}/${pngFiles.length}`);
    }
  }

  process.stdout.write("\n");
  return converted;
}

async function main() {
  const ffmpegPath = resolveBinary("ffmpeg");
  const ffprobePath = resolveBinary("ffprobe");

  if (!ffmpegPath || !ffprobePath) {
    console.error("Error: no se encontro FFmpeg/FFprobe.");
    console.error("Ejecuta npm install para usar los binarios gratuitos incluidos en el proyecto.");
    console.error("Tambien puedes instalar FFmpeg gratis y agregarlo al PATH de Windows.");
    console.error("Tambien puedes definir FFMPEG_PATH y FFPROBE_PATH apuntando a ejecutables locales.");
    process.exit(1);
  }

  if (!(await fs.pathExists(inputVideo))) {
    console.error("Error: no existe input/video.mp4.");
    console.error("Crea la carpeta input y coloca tu video como input/video.mp4.");
    console.error("Tambien puedes usar SEQUENCE_INPUT=ruta/al/video.mp4 npm run sequence:generate.");
    process.exit(1);
  }

  await fs.ensureDir(pngDir);
  await fs.ensureDir(webpDir);

  const existingFrames = await fg(["frame_*.png", "frame_*.webp"], {
    cwd: path.resolve(rootDir, "public/sequence"),
    onlyFiles: true,
    deep: 2,
  });

  if (existingFrames.length) {
    if (process.argv.includes("--clean")) {
      await fs.emptyDir(pngDir);
      await fs.emptyDir(webpDir);
      console.log("Frames anteriores limpiados.");
    } else {
      console.error("Ya existen frames anteriores en public/sequence.");
      console.error("Ejecuta npm run sequence:clean antes de generar, o usa: node scripts/generate-sequence.js --clean");
      process.exit(1);
    }
  }

  const info = await getVideoInfo(ffprobePath);
  const useInterpolation = info.fps > 0 && info.fps <= 30;
  const filter = useInterpolation
    ? `minterpolate=fps=${targetFps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir`
    : `fps=${targetFps}`;

  console.log(`Video: ${path.relative(rootDir, inputVideo)}`);
  console.log(`FPS detectado: ${info.fps ? info.fps.toFixed(3) : "desconocido"}`);
  console.log(`Filtro FFmpeg: ${filter}`);

  const outputPattern = path.join(pngDir, "frame_%05d.png");
  const args = ["-hide_banner", "-y", "-i", inputVideo, "-vf", filter, "-vsync", "0", outputPattern];

  let duration = info.duration || null;
  let lastPercent = -1;

  console.log("Extrayendo PNG...");
  await run(ffmpegPath, args, {
    onStderr(chunk) {
      duration = duration || parseDurationSeconds(chunk);
      const progress = parseProgressSeconds(chunk);
      if (!duration || progress == null) return;

      const percent = Math.min(100, Math.floor((progress / duration) * 100));
      if (percent !== lastPercent && percent % 5 === 0) {
        lastPercent = percent;
        process.stdout.write(`\rFFmpeg: ${percent}%`);
      }
    },
  });
  process.stdout.write("\n");

  const generated = await convertPngToWebp();
  const totalSize = await directorySize(webpDir);

  console.log(`Frames generados: ${generated}`);
  console.log(`Peso final WebP: ${formatBytes(totalSize)}`);
  console.log("Secuencia lista en public/sequence/webp");
}

main().catch((error) => {
  console.error("\nError al generar la secuencia:");
  console.error(error.message);
  process.exit(1);
});
