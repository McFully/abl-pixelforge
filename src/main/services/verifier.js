const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Normaliza y compara los píxeles de dos imágenes para verificar si son 100% idénticos.
 * Requisito estricto: Comprobación RGBA píxel a píxel.
 */
async function verifyLosslessIntegrity(originalPath, compressedBuffer, isTransparentRequired = false) {
  try {
    const origImage = sharp(originalPath);
    const compImage = sharp(compressedBuffer);

    const [origMeta, compMeta] = await Promise.all([
      origImage.metadata(),
      compImage.metadata()
    ]);

    if (origMeta.width !== compMeta.width || origMeta.height !== compMeta.height) {
      return {
        isLossless: false,
        reason: `Dimensiones dispares: ${origMeta.width}x${origMeta.height} vs ${compMeta.width}x${compMeta.height}`
      };
    }

    // Extraer buffers crudos en formato RGBA de 8 bits
    const [origRaw, compRaw] = await Promise.all([
      origImage.ensureAlpha().raw().toBuffer(),
      compImage.ensureAlpha().raw().toBuffer()
    ]);

    if (origRaw.length !== compRaw.length) {
      return {
        isLossless: false,
        reason: 'Longitud de búfer RGBA discordante'
      };
    }

    let diffCount = 0;
    const totalPixels = origMeta.width * origMeta.height;

    for (let i = 0; i < origRaw.length; i += 4) {
      const r1 = origRaw[i];
      const g1 = origRaw[i + 1];
      const b1 = origRaw[i + 2];
      const a1 = origRaw[i + 3];

      const r2 = compRaw[i];
      const g2 = compRaw[i + 1];
      const b2 = compRaw[i + 2];
      const a2 = compRaw[i + 3];

      // Si ambos píxeles son completamente transparentes y no se exige conservar RGB invisible
      if (!isTransparentRequired && a1 === 0 && a2 === 0) {
        continue;
      }

      if (r1 !== r2 || g1 !== g2 || b1 !== b2 || a1 !== a2) {
        diffCount++;
      }
    }

    if (diffCount === 0) {
      return {
        isLossless: true,
        diffPixels: 0,
        totalPixels,
        accuracy: '100% Sin Pérdida Matemático'
      };
    }

    return {
      isLossless: false,
      diffPixels: diffCount,
      totalPixels,
      percentIdentical: (((totalPixels - diffCount) / totalPixels) * 100).toFixed(3)
    };
  } catch (error) {
    return {
      isLossless: false,
      reason: `Error durante la verificación: ${error.message}`
    };
  }
}

module.exports = {
  verifyLosslessIntegrity
};
