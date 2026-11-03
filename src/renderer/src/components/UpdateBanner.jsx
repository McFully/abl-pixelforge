import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { checkPixelForgeUpdate } from '../utils/updater';

export default function UpdateBanner() {
  const [update, setUpdate] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkPixelForgeUpdate('1.0.0').then((info) => {
      if (info && info.available) {
        setUpdate(info);
      }
    });
  }, []);

  if (!update || !update.available || dismissed) return null;

  return (
    <div className="mx-6 mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-900/80 border border-indigo-400/40 shadow-lg shadow-indigo-950/40 flex items-center justify-between gap-3 animate-in fade-in duration-300">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-indigo-200 truncate">
            Nueva versión disponible (v{update.version})
          </span>
          <span className="text-[10px] text-gray-400">
            Mejoras de rendimiento y compresión listas para instalar
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {update.downloadUrl && (
          <a
            href={update.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
          >
            <Download size={13} />
            <span>Actualizar</span>
          </a>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          aria-label="Cerrar aviso de actualización"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
