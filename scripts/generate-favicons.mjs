import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Resolve paths robustly across Windows/macOS/Linux
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const srcLogo = path.join(projectRoot, 'src', 'assets', 'logo.png');
const publicDir = path.join(projectRoot, 'public');

const outputs = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 256, name: 'favicon-256x256.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
];

async function main() {
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(srcLogo)) {
    console.error(`Source logo not found at: ${srcLogo}`);
    process.exit(1);
  }

  // Start with the source logo and PRESERVE transparency (no flatten) to avoid unwanted backgrounds
  const input = sharp(srcLogo);
  const metadata = await input.metadata();

  // If the logo has a lot of transparent padding, try to trim it
  // Note: trim may not work on all images; fallback to plain resize
  let base = input.clone();
  try {
    // Try to trim excess transparent/solid padding to maximize visible area
    base = input.clone().trim();
    await base.metadata();
  } catch {
    base = input.clone();
  }

  await Promise.all(
    outputs.map(async ({ size, name }) => {
      const outPath = path.join(publicDir, name);
      await base
        .clone()
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // keep transparent padding if any
          withoutEnlargement: true,
        })
        .png({ compressionLevel: 9 })
        .toFile(outPath);
      console.log('Generated', name);
    })
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
