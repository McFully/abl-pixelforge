import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, RotateCw, Save } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function ConversionView() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('webp');
  const [keepDimensions, setKeepDimensions] = useState(true);
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const formats = ['webp', 'avif', 'png', 'jpeg'];

  const handleSelectFile = async () => {
    if (window.api && window.api.selectFiles) {
      const files = await window.api.selectFiles();
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        setResult(null);
      }
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setResult(null);
    try {
      const res = await window.api.compressImage({
        filePath: selectedFile,
        mode: 'quality',
        quality: parseInt(quality) || 90,
        format: targetFormat
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    const savePath = selectedFile.replace(/\.[^/.]+$/, '') + `_converted.${result.format}`;
    const saveRes = await window.api.saveCompressedFile({
      bufferBase64: result.outputBufferBase64,
      outputPath: savePath
    });
    if (saveRes.success) {
      alert(`Archivo convertido y guardado en:\n${saveRes.path}`);
    } else {
      alert(`Error al guardar: ${saveRes.error}`);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Conversión de formatos</h2>
        <p className="text-xs text-gray-400 mt-1">
          Transformación directa entre PNG, JPEG, WebP, AVIF, BMP y TIFF manteniendo dimensiones y fidelidad
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5 bg-[#181920] border border-[#262833] rounded-xl p-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">Archivo a convertir</label>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                readOnly 
                value={selectedFile || 'Ningún archivo seleccionado'} 
                className="w-full bg-[#121316] border border-[#2f3240] rounded-lg px-3 py-2 text-xs text-gray-300 truncate"
              />
              <button 
                onClick={handleSelectFile}
                className="px-3 py-2 bg-[#20222b] hover:bg-[#282a36] text-white border border-[#2f3240] rounded-lg text-xs font-medium shrink-0"
              >
                Buscar
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 block">Formato destino</label>
            <div className="grid grid-cols-4 gap-2">
              {formats.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTargetFormat(fmt)}
                  className={`py-2 rounded-lg text-xs font-semibold uppercase border transition-all ${
                    targetFormat === fmt 
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                      : 'bg-[#14151b] border-[#262833] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 bg-[#14151b] p-3 rounded-lg border border-[#262833]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-medium">Calidad de codificación</span>
              <span className="text-indigo-400 font-bold">{quality}%</span>
            </div>
            <input 
              type="range" 
              min="60" 
              max="100" 
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <input 
              type="checkbox" 
              id="keepDim" 
              checked={keepDimensions} 
              onChange={(e) => setKeepDimensions(e.target.checked)}
              className="accent-indigo-500"
            />
            <label htmlFor="keepDim">Conservar dimensiones originales de la imagen</label>
          </div>

          <button
            onClick={handleConvert}
            disabled={!selectedFile || processing}
            className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wide uppercase transition-all flex items-center justify-center space-x-2 ${
              !selectedFile || processing
                ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            {processing ? (
              <>
                <RotateCw size={16} className="animate-spin" />
                <span>Convirtiendo formato...</span>
              </>
            ) : (
              <>
                <ArrowLeftRight size={16} />
                <span>Convertir formato</span>
              </>
            )}
          </button>
        </div>

        <div className="col-span-7 bg-[#181920] border border-[#262833] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-[#262833] pb-3 mb-4">
              Estado de la conversión
            </h3>

            {!result && !processing && (
              <div className="py-24 text-center text-gray-400 text-xs">
                Selecciona una imagen y el formato de destino deseado para realizar la conversión.
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#121316] border border-[#262833] p-3 rounded-lg text-xs">
                    <span className="text-gray-400 block text-[10px] uppercase">Formato final</span>
                    <span className="text-white font-bold text-lg uppercase">{result.format}</span>
                  </div>
                  <div className="bg-[#121316] border border-[#262833] p-3 rounded-lg text-xs">
                    <span className="text-gray-400 block text-[10px] uppercase">Peso resultante</span>
                    <span className="text-indigo-400 font-bold text-lg">{formatBytes(result.finalSize)}</span>
                  </div>
                </div>

                <div className="bg-[#121316] border border-[#262833] p-3 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Dimensiones:</span>
                    <span className="text-gray-200">{result.width} x {result.height} px</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tiempo de conversión:</span>
                    <span className="text-gray-200">{result.timeTaken} ms</span>
                  </div>
                </div>

                {result.previewDataUrl && (
                  <div className="border border-[#262833] rounded-lg overflow-hidden transparency-grid flex items-center justify-center p-2 max-h-52">
                    <img 
                      src={result.previewDataUrl} 
                      alt="Converted Preview" 
                      className="max-h-48 object-contain rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {result && (
            <div className="pt-4 border-t border-[#262833]">
              <button
                onClick={handleSave}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <Save size={15} />
                <span>Guardar archivo convertido</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
