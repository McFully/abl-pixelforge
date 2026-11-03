const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { verifyLosslessIntegrity } = require('./verifier');

let oxipngModule = null;
async function getOxipng() {
  if (!oxipngModule) {
    try {
      oxipngModule = await import('@jsquash/oxipng');
    } catch (e) {
      console.warn('OxiPNG WASM fallback not available, sharp will be used for PNG optimization:', e.message);
    }
  }
  return oxipngModule;
}

/**
 * Procesa compresión según modo y formato
 */
async function processImageCompression({ filePath, mode, quality = 90, format = 'webp', maxWeightKB = null, keepMetadata = false }) {
  const startTime = Date.now();
  const fileStats = fs.statSync(filePath);
  const originalSize = fileStats.size;
  const originalExt = path.extname(filePath).replace('.', '').toLowerCase();

  const originalImage = sharp(filePath);
  const metadata = await originalImage.metadata();

  let targetFormat = format.toLowerCase();
  let outputBuffer = null;
  let usedSettings = {};
  let isLosslessMode = (mode === 'lossless');

  if (mode === 'lossless') {
    // MODO 1: SIN PÉRDIDA REAL
    if (targetFormat === 'webp') {
      outputBuffer = await sharp(filePath)
        .webp({ lossless: true, effort: 6 })
        .toBuffer();
      usedSettings = { engine: 'libwebp', lossless: true, effort: 6 };
    } else if (targetFormat === 'avif') {
      outputBuffer = await sharp(filePath)
        .avif({ lossless: true, effort: 7 })
        .toBuffer();
      usedSettings = { engine: 'libavif', lossless: true, effort: 7 };
    } else {
      // PNG Lossless: Primero Sharp compresión máxima y OxiPNG si es PNG
      const sharpPng = await sharp(filePath)
        .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
        .toBuffer();

      const oxipng = await getOxipng();
      if (oxipng && oxipng.optimise) {
        try {
          const optBuffer = await oxipng.optimise(sharpPng, { level: 3 });
          outputBuffer = Buffer.from(optBuffer);
          usedSettings = { engine: 'OxiPNG + libpng', level: 3 };
        } catch (e) {
          outputBuffer = sharpPng;
          usedSettings = { engine: 'Sharp libpng', compressionLevel: 9 };
        }
      } else {
        outputBuffer = sharpPng;
        usedSettings = { engine: 'Sharp libpng', compressionLevel: 9 };
      }
    }
  } else if (mode === 'quality') {
    // MODO 2: MÁXIMA CALIDAD VISUAL
    const q = Math.min(Math.max(parseInt(quality) || 85, 1), 100);
    if (targetFormat === 'webp') {
      outputBuffer = await sharp(filePath)
        .webp({ quality: q, effort: 6, alphaQuality: 100 })
        .toBuffer();
      usedSettings = { engine: 'libwebp', quality: q, effort: 6 };
    } else if (targetFormat === 'avif') {
      outputBuffer = await sharp(filePath)
        .avif({ quality: q, effort: 6, chromaSubsampling: '4:4:4' })
        .toBuffer();
      usedSettings = { engine: 'libavif', quality: q, effort: 6 };
    } else if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
      outputBuffer = await sharp(filePath)
        .jpeg({ quality: q, mozjpeg: true })
        .toBuffer();
      usedSettings = { engine: 'mozjpeg', quality: q };
    } else {
      // PNG con reducción de esfuerzo
      outputBuffer = await sharp(filePath)
        .png({ compressionLevel: 8 })
        .toBuffer();
      usedSettings = { engine: 'libpng', compressionLevel: 8 };
    }
  } else {
    // MODO 3: INTELIGENTE AUTOMÁTICO
    // Analiza transparencia y contenido
    const hasAlpha = metadata.hasAlpha;
    let chosenQuality = 85;

    if (maxWeightKB && maxWeightKB > 0) {
      const maxBytes = maxWeightKB * 1024;
      // Probar calidades iterativas
      for (const testQ of [92, 85, 78, 65, 50]) {
        let testBuf;
        if (targetFormat === 'avif') {
          testBuf = await sharp(filePath).avif({ quality: testQ, effort: 5 }).toBuffer();
        } else {
          testBuf = await sharp(filePath).webp({ quality: testQ, effort: 5 }).toBuffer();
        }
        if (testBuf.length <= maxBytes || testQ === 50) {
          outputBuffer = testBuf;
          chosenQuality = testQ;
          break;
        }
      }
      usedSettings = { engine: targetFormat === 'avif' ? 'libavif' : 'libwebp', quality: chosenQuality, targetMaxKB: maxWeightKB };
    } else {
      // Automático equilibrado
      if (targetFormat === 'avif') {
        outputBuffer = await sharp(filePath).avif({ quality: 85, effort: 6 }).toBuffer();
        usedSettings = { engine: 'libavif', quality: 85, smart: true };
      } else {
        outputBuffer = await sharp(filePath).webp({ quality: 88, effort: 6 }).toBuffer();
        usedSettings = { engine: 'libwebp', quality: 88, smart: true };
      }
    }
  }

  const finalSize = outputBuffer.length;
  const savedBytes = originalSize - finalSize;
  const reductionPercent = ((savedBytes / originalSize) * 100).toFixed(2);
  const timeTaken = Date.now() - startTime;

  // Verificación matemática de integridad si es Lossless
  let integrity = null;
  if (isLosslessMode) {
    integrity = await verifyLosslessIntegrity(filePath, outputBuffer);
  } else {
    integrity = {
      isLossless: false,
      reason: 'Compresión con pérdida intencional (modo calidad/inteligente)'
    };
  }

  // Generar data URL para previsualización inmediata si es menor de 15MB
  let previewDataUrl = null;
  if (finalSize < 15 * 1024 * 1024) {
    const mime = targetFormat === 'avif' ? 'image/avif' : (targetFormat === 'webp' ? 'image/webp' : 'image/png');
    previewDataUrl = `data:${mime};base64,${outputBuffer.toString('base64')}`;
  }

  return {
    filePath,
    fileName: path.basename(filePath),
    originalSize,
    finalSize,
    savedBytes,
    reductionPercent: parseFloat(reductionPercent),
    timeTaken,
    format: targetFormat,
    mode,
    usedSettings,
    integrity,
    outputBufferBase64: outputBuffer.toString('base64'),
    previewDataUrl,
    width: metadata.width,
    height: metadata.height,
    hasAlpha: metadata.hasAlpha
  };
}

module.exports = {
  processImageCompression
};
