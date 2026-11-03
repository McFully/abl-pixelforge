// Servicio de detección de actualizaciones para ABL PIXELFORGE
// © 2026 Aritz Bahamonde Larxé. Todos los derechos reservados.

export async function checkPixelForgeUpdate(currentVersion = '1.0.0') {
  try {
    const res = await fetch('https://api.github.com/repos/McFully/abl-pixelforge/releases/latest');
    if (!res.ok) return { available: false };

    const data = await res.json();
    const latestVersion = (data.tag_name || '').replace(/^v/, '');

    if (!latestVersion) return { available: false };

    // Comparar versiones semánticas simples
    const isNewer = compareVersions(latestVersion, currentVersion) > 0;
    const exeAsset = (data.assets || []).find(a => a.name.endsWith('.exe'));

    return {
      available: isNewer,
      version: latestVersion,
      downloadUrl: exeAsset ? exeAsset.browser_download_url : data.html_url
    };
  } catch (err) {
    return { available: false };
  }
}

function compareVersions(v1, v2) {
  const p1 = v1.split('.').map(Number);
  const p2 = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const n1 = p1[i] || 0;
    const n2 = p2[i] || 0;
    if (n1 > n2) return 1;
    if (n1 < n2) return -1;
  }
  return 0;
}
