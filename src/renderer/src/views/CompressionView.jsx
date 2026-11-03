import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  FolderDown, 
  Save, 
  Layers, 
  Eye, 
  RotateCw,
  AlertCircle
} from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function CompressionView({ initialFiles, onOpenInCompare }) {
  const [selectedFile, setSelectedFile] = useState(initialFiles && initialFiles.length > 0 ? initialFiles[0] : null);
  const [mode, setMode] = useState('lossless'); // lossless, quality, auto
  const [format, setFormat] = useState('webp'); // webp, avif, png, jpeg
  const [quality, setQuality] = useState(90);
  const [maxWeightKB, setMaxWeightKB] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [outputFolder, setOutputFolder] = useState('');

  const handleSelectFiles = async () => {
    if (window.api && window.api.selectFiles) {
      const files = await window.api.selectFiles();
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        setResult(null);
      }
    }
  };

  const handleSelectOutputFolder = async () => {
    if (window.api && window.api.selectOutputFolder) {
      const folder = await window.api.selectOutputFolder();
      if (folder) setOutputFolder(folder);
    }
  };

  const handleRunCompression = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setResult(null);
    try {
      const res = await window.api.compressImage({
        filePath: selectedFile,
        mode,
        quality: parseInt(quality) || 90,
        format,
        maxWeightKB: maxWeightKB ? parseInt(maxWeightKB) : null
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveResult = async () => {
    if (!result || !result.outputBufferBase64) return;
    const defaultName = result.fileName.replace(/\.[^/.]+$/, '') + `_optimized.${result.format}`;
    let savePath = outputFolder ? `${outputFolder}\\${defaultName}` : selectedFile.replace(/\.[^/.]+$/, '') + `_optimized.${result.format}`;
    
    const saveRes = await window.api.saveCompressedFile({
      bufferBase64: result.outputBufferBase64,
      outputPath: savePath
    });

    if (saveRes.success) {
      alert(`Archivo guardado exitosamente en:\n${saveRes.path}`);
    } else {
      alert(`Error al guardar: ${saveRes.error}`);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      {/* View Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Compresión de imágenes</h2>
        <p className="text-xs text-gray-400 mt-1">
          Motores avanzados OxiPNG, libwebp y libavif con distinción matemática de pérdida
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Settings Column */}
        <div className="col-span-5 bg-[#181920] border border-[#262833] rounded-xl p-5 space-y-5">
          {/* File Picker */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">Imagen de origen</label>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                readOnly 
                value={selectedFile || 'Ningún archivo seleccionado'} 
                className="w-full bg-[#121316] border border-[#2f3240] rounded-lg px-3 py-2 text-xs text-gray-300 truncate"
              />
              <button 
                onClick={handleSelectFiles}
                className="px-3 py-2 bg-[#20222b] hover:bg-[#282a36] text-white border border-[#2f3240] rounded-lg text-xs font-medium shrink-0"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Mode Selector (3 Modos requeridos) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 block">Modo de compresión</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setMode('lossless')}
                className={`py-2 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                  mode === 'lossless' 
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300' 
                    : 'bg-[#14151b] border-[#262833] text-gray-400 hover:text-gray-200'
                }`}
              >
                Sin pérdida real
              </button>
              <button
                onClick={() => setMode('quality')}
                className={`py-2 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                  mode === 'quality' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                    : 'bg-[#14151b] border-[#262833] text-gray-400 hover:text-gray-200'
                }`}
              >
                Máxima calidad
              </button>
              <button
                onClick={() => setMode('auto')}
                className={`py-2 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                  mode === 'auto' 
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' 
                    : 'bg-[#14151b] border-[#262833] text-gray-400 hover:text-gray-200'
                }`}
              >
                Automático
              </button>
            </div>
          </div>

          {/* Output Format */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 block">Formato de salida</label>
            <div className="grid grid-cols-4 gap-2">
              {['webp', 'avif', 'png', 'jpeg'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`py-2 rounded-lg text-xs font-semibold uppercase border transition-all ${
                    format === fmt 
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                      : 'bg-[#14151b] border-[#262833] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Specific Controls */}
          {mode === 'quality' && (
            <div className="space-y-2 bg-[#14151b] p-3 rounded-lg border border-[#262833]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium">Nivel de calidad</span>
                <span className="text-indigo-400 font-bold">{quality}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="100" 
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>80% (Ligero)</span>
                <span>85%</span>
                <span>90%</span>
                <span>95% (Alta fidelidad)</span>
              </div>
            </div>
          )}

          {mode === 'auto' && (
            <div className="space-y-2 bg-[#14151b] p-3 rounded-lg border border-[#262833]">
              <label className="text-xs font-medium text-gray-300 block">Límite de peso máximo (opcional)</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  placeholder="Ej: 800" 
                  value={maxWeightKB}
                  onChange={(e) => setMaxWeightKB(e.target.value)}
                  className="w-full bg-[#121316] border border-[#2f3240] rounded px-3 py-1.5 text-xs text-gray-200"
                />
                <span className="text-xs text-gray-400 shrink-0">KB</span>
              </div>
            </div>
          )}

          {mode === 'lossless' && (
            <div className="bg-violet-950/20 border border-violet-800/30 p-3 rounded-lg flex items-start space-x-2.5">
              <ShieldCheck size={18} className="text-violet-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-violet-200 leading-relaxed">
                Modo estricto 100% sin pérdida: conservará exactamente todos los píxeles originales y verificará matemáticamente los búferes RGBA tras la compresión.
              </p>
            </div>
          )}

          {/* Destination Folder */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 block">Carpeta de destino</label>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                readOnly 
                value={outputFolder || 'Misma carpeta de origen'} 
                className="w-full bg-[#121316] border border-[#2f3240] rounded-lg px-3 py-2 text-xs text-gray-400 truncate"
              />
              <button 
                onClick={handleSelectOutputFolder}
                className="px-3 py-2 bg-[#20222b] hover:bg-[#282a36] text-white border border-[#2f3240] rounded-lg text-xs font-medium shrink-0"
              >
                Cambiar
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunCompression}
            disabled={!selectedFile || processing}
            className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wide uppercase transition-all flex items-center justify-center space-x-2 ${
              !selectedFile || processing
                ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/25'
            }`}
          >
            {processing ? (
              <>
                <RotateCw size={16} className="animate-spin" />
                <span>Optimizando imagen...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Optimizar ahora</span>
              </>
            )}
          </button>
        </div>

        {/* Results & Inspection Column */}
        <div className="col-span-7 bg-[#181920] border border-[#262833] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#262833] pb-3 mb-4">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Resultado del procesamiento</h3>
              {result && (
                <button
                  onClick={() => onOpenInCompare(selectedFile, result)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  <Eye size={13} />
                  <span>Ver en comparador</span>
                </button>
              )}
            </div>

            {!result && !processing && (
              <div className="py-24 text-center text-gray-400 space-y-2">
                <Sliders size={32} className="mx-auto text-gray-400" />
                <p className="text-xs">Configura los parámetros y pulsa en "Optimizar ahora" para ver las métricas reales.</p>
              </div>
            )}

            {processing && (
              <div className="py-24 text-center text-gray-400 space-y-3">
                <RotateCw size={32} className="mx-auto text-indigo-400 animate-spin" />
                <p className="text-xs text-gray-300 font-medium">Ejecutando motores de compresión y verificando píxeles...</p>
              </div>
            )}

            {result && (
              <div className="space-y-5">
                {/* Metrics Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#121316] border border-[#262833] rounded-lg p-3">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Tamaño original</span>
                    <p className="text-base font-bold text-gray-200 mt-1">{formatBytes(result.originalSize)}</p>
                  </div>
                  <div className="bg-[#121316] border border-[#262833] rounded-lg p-3">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Tamaño final</span>
                    <p className="text-base font-bold text-indigo-400 mt-1">{formatBytes(result.finalSize)}</p>
                  </div>
                  <div className="bg-[#121316] border border-[#262833] rounded-lg p-3">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Reducción lograda</span>
                    <p className="text-base font-bold text-emerald-400 mt-1">
                      {result.reductionPercent > 0 ? `-${result.reductionPercent}%` : `${result.reductionPercent}%`}
                    </p>
                  </div>
                </div>

                {/* Integrity Banner */}
                {result.integrity && result.integrity.isLossless ? (
                  <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-lg p-3 flex items-center space-x-3 text-emerald-300 text-xs">
                    <ShieldCheck size={20} className="shrink-0 text-emerald-400" />
                    <div>
                      <span className="font-bold">Verificación matemática superada:</span> Píxeles RGBA 100% idénticos al original.
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-3 flex items-center space-x-3 text-amber-300 text-xs">
                    <AlertCircle size={20} className="shrink-0 text-amber-400" />
                    <div>
                      <span className="font-bold">Compresión con pérdida:</span> Optimización perceptiva aplicada sin artefactos visibles.
                    </div>
                  </div>
                )}

                {/* Details Table */}
                <div className="bg-[#121316] border border-[#262833] rounded-lg p-3 text-xs space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Motor utilizado:</span>
                    <span className="text-gray-200 font-medium">{result.usedSettings?.engine || 'Nativo'}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Dimensiones:</span>
                    <span className="text-gray-200">{result.width} x {result.height} px</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tiempo de compresión:</span>
                    <span className="text-gray-200">{result.timeTaken} ms</span>
                  </div>
                </div>

                {/* Preview Box */}
                {result.previewDataUrl && (
                  <div className="border border-[#262833] rounded-lg overflow-hidden transparency-grid flex items-center justify-center p-2 max-h-52">
                    <img 
                      src={result.previewDataUrl} 
                      alt="Compressed Preview" 
                      className="max-h-48 object-contain rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Save Action */}
          {result && (
            <div className="pt-4 border-t border-[#262833]">
              <button
                onClick={handleSaveResult}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <Save size={15} />
                <span>Guardar archivo optimizado</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
