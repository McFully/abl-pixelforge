import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ZoomIn, ZoomOut, Check, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function QualityCompareView({ originalFile, compressedData }) {
  const [file, setFile] = useState(originalFile || null);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  const handleSelectFile = async () => {
    if (window.api && window.api.selectFiles) {
      const files = await window.api.selectFiles();
      if (files && files.length > 0) {
        setFile(files[0]);
      }
    }
  };

  useEffect(() => {
    if (file) {
      runComparePresets(file);
    }
  }, [file]);

  const runComparePresets = async (filePath) => {
    setLoading(true);
    try {
      const res = await window.api.comparePresets(filePath);
      setPresets(res);
      setSelectedPresetIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentPreset = presets[selectedPresetIndex];

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Comparador de calidad</h2>
          <p className="text-xs text-gray-400 mt-1">
            Visualizador interactivo antes y después con cortina deslizante, zoom y tabla de mediciones reales
          </p>
        </div>
        <button
          onClick={handleSelectFile}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
        >
          {file ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </button>
      </div>

      {!file && (
        <div className="bg-[#181920] border border-[#262833] rounded-xl p-24 text-center text-gray-400 text-xs">
          Selecciona una imagen para generar y comparar automáticamente las versiones WebP, AVIF y PNG.
        </div>
      )}

      {file && (
        <div className="space-y-6">
          {/* Main Interactive Visualizer */}
          <div className="bg-[#181920] border border-[#262833] rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">Visualizador interactivo:</span>
                <span className="text-gray-400">Desliza para contrastar píxel a píxel</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setZoomLevel(1)} 
                  className={`px-2 py-1 rounded text-[11px] ${zoomLevel === 1 ? 'bg-indigo-600 text-white' : 'bg-[#20222b] text-gray-400'}`}
                >
                  1x
                </button>
                <button 
                  onClick={() => setZoomLevel(2)} 
                  className={`px-2 py-1 rounded text-[11px] ${zoomLevel === 2 ? 'bg-indigo-600 text-white' : 'bg-[#20222b] text-gray-400'}`}
                >
                  2x Zoom
                </button>
                <button 
                  onClick={() => setZoomLevel(3)} 
                  className={`px-2 py-1 rounded text-[11px] ${zoomLevel === 3 ? 'bg-indigo-600 text-white' : 'bg-[#20222b] text-gray-400'}`}
                >
                  3x Zoom
                </button>
              </div>
            </div>

            {/* Canvas Slider Box */}
            <div className="relative h-80 rounded-lg overflow-hidden transparency-grid flex items-center justify-center select-none border border-[#262833]">
              {currentPreset && currentPreset.bufferBase64 ? (
                <div 
                  className="relative w-full h-full overflow-hidden flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                >
                  {/* Imagen Comprimida (Fondo completo) */}
                  <img
                    src={`data:image/${currentPreset.format};base64,${currentPreset.bufferBase64}`}
                    alt="Compressed"
                    className="max-h-full object-contain pointer-events-none"
                  />

                  {/* Imagen Original (Recortada por slider) */}
                  <div 
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={`file://${file}`}
                      alt="Original"
                      className="max-h-full object-contain pointer-events-none"
                    />
                  </div>

                  {/* Línea divisoria */}
                  <div 
                    className="absolute inset-y-0 w-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  />
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  {loading ? 'Calculando compresión en múltiples formatos...' : 'Selecciona un preset de la tabla'}
                </div>
              )}

              {/* Slider Control Handle */}
              <input 
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(e.target.value)}
                className="absolute inset-x-4 bottom-3 accent-indigo-500 opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>

            <div className="flex justify-between text-[11px] text-gray-400 px-1">
              <span>← Izquierda: Original</span>
              <span>Derecha: Optimizado ({currentPreset?.label || ''}) →</span>
            </div>
          </div>

          {/* Presets Table (Requisito 8 de las instrucciones) */}
          <div className="bg-[#181920] border border-[#262833] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Tabla de comparación de motores y calidades reales
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#262833] text-gray-400">
                    <th className="py-2.5 px-3">Formato / Preset</th>
                    <th className="py-2.5 px-3">Modo</th>
                    <th className="py-2.5 px-3">Nivel Calidad</th>
                    <th className="py-2.5 px-3">Peso Final</th>
                    <th className="py-2.5 px-3">Reducción</th>
                    <th className="py-2.5 px-3">Tiempo</th>
                    <th className="py-2.5 px-3">Estado Integridad</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262833]">
                  {presets.map((p, idx) => (
                    <tr 
                      key={idx}
                      className={`hover:bg-[#1f212b] transition-colors ${selectedPresetIndex === idx ? 'bg-indigo-600/10' : ''}`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-white uppercase">{p.label}</td>
                      <td className="py-2.5 px-3 text-gray-300 capitalize">{p.mode}</td>
                      <td className="py-2.5 px-3 text-gray-300">{p.quality}%</td>
                      <td className="py-2.5 px-3 font-medium text-indigo-400">{formatBytes(p.finalSize)}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-400">-{p.reductionPercent}%</td>
                      <td className="py-2.5 px-3 text-gray-400">{p.timeTaken} ms</td>
                      <td className="py-2.5 px-3">
                        {p.integrity && p.integrity.isLossless ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 text-[11px]">
                            <ShieldCheck size={13} />
                            <span>Sin pérdida real</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-amber-400 text-[11px]">
                            <AlertCircle size={13} />
                            <span>Con pérdida</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setSelectedPresetIndex(idx)}
                          className="px-2.5 py-1 bg-[#20222b] hover:bg-indigo-600 hover:text-white rounded text-[11px] text-gray-300 font-medium"
                        >
                          Visualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
