import React, { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';

export default function SettingsView() {
  const [defaultFormat, setDefaultFormat] = useState('webp');
  const [defaultQuality, setDefaultQuality] = useState(90);
  const [concurrency, setConcurrency] = useState(2);
  const [keepMetadata, setKeepMetadata] = useState(false);
  const [keepTransparency, setKeepTransparency] = useState(true);
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Configuración global</h2>
        <p className="text-xs text-gray-400 mt-1">
          Ajustes del motor, gestión de metadatos, concurrencia y preferencias de compresión
        </p>
      </div>

      <div className="max-w-2xl bg-[#181920] border border-[#262833] rounded-xl p-6 space-y-6">
        <div className="space-y-4 divide-y divide-[#262833]">
          {/* Format */}
          <div className="pt-2 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-200 block">Formato de compresión predeterminado</span>
              <span className="text-[11px] text-gray-400">El formato seleccionado por defecto en nuevas tareas</span>
            </div>
            <select
              value={defaultFormat}
              onChange={(e) => setDefaultFormat(e.target.value)}
              className="bg-[#121316] border border-[#2f3240] rounded px-3 py-1.5 text-xs text-gray-200 uppercase"
            >
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>

          {/* Quality */}
          <div className="pt-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-200 block">Calidad con pérdida por defecto</span>
              <span className="text-[11px] text-gray-400">Nivel de fidelidad perceptual aplicado inicialmente</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="50"
                max="100"
                value={defaultQuality}
                onChange={(e) => setDefaultQuality(e.target.value)}
                className="w-16 bg-[#121316] border border-[#2f3240] rounded px-2 py-1 text-xs text-gray-200 text-center"
              />
              <span className="text-xs text-gray-400">%</span>
            </div>
          </div>

          {/* Concurrency */}
          <div className="pt-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-200 block">Hilos de concurrencia</span>
              <span className="text-[11px] text-gray-400">Límite de procesamiento paralelo para proteger la memoria RAM</span>
            </div>
            <select
              value={concurrency}
              onChange={(e) => setConcurrency(e.target.value)}
              className="bg-[#121316] border border-[#2f3240] rounded px-3 py-1.5 text-xs text-gray-200"
            >
              <option value="1">1 hilo (Mínimo consumo)</option>
              <option value="2">2 hilos (Recomendado 8 GB)</option>
              <option value="4">4 hilos (Alto rendimiento)</option>
            </select>
          </div>

          {/* Transparency */}
          <div className="pt-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-200 block">Conservación de transparencia</span>
              <span className="text-[11px] text-gray-400">Preservar canal Alpha de forma estricta</span>
            </div>
            <input
              type="checkbox"
              checked={keepTransparency}
              onChange={(e) => setKeepTransparency(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
            />
          </div>

          {/* Metadata */}
          <div className="pt-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-200 block">Conservar perfiles ICC y metadatos EXIF</span>
              <span className="text-[11px] text-gray-400">Incrementa ligeramente el tamaño final del archivo</span>
            </div>
            <input
              type="checkbox"
              checked={keepMetadata}
              onChange={(e) => setKeepMetadata(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-600/20"
        >
          {saved ? (
            <>
              <Check size={15} />
              <span>Preferencias guardadas</span>
            </>
          ) : (
            <>
              <Save size={15} />
              <span>Guardar configuración</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
