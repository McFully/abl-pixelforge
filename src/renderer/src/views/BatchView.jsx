import React, { useState } from 'react';
import { Layers, Play, Square, FolderDown, CheckCircle, AlertTriangle, RotateCw } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function BatchView({ initialFiles }) {
  const [fileList, setFileList] = useState(initialFiles || []);
  const [outputFolder, setOutputFolder] = useState('');
  const [format, setFormat] = useState('webp');
  const [mode, setMode] = useState('lossless');
  const [quality, setQuality] = useState(90);
  const [concurrency, setConcurrency] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [isCancelled, setIsCancelled] = useState(false);

  const handleAddFiles = async () => {
    if (window.api && window.api.selectFiles) {
      const files = await window.api.selectFiles();
      if (files) setFileList((prev) => Array.from(new Set([...prev, ...files])));
    }
  };

  const handleAddFolder = async () => {
    if (window.api && window.api.selectFolder) {
      const files = await window.api.selectFolder();
      if (files) setFileList((prev) => Array.from(new Set([...prev, ...files])));
    }
  };

  const handleSelectOutput = async () => {
    if (window.api && window.api.selectOutputFolder) {
      const folder = await window.api.selectOutputFolder();
      if (folder) setOutputFolder(folder);
    }
  };

  const handleProcessBatch = async () => {
    if (fileList.length === 0) return;
    setProcessing(true);
    setIsCancelled(false);
    setProgress({ current: 0, total: fileList.length });
    const batchResults = [];

    for (let i = 0; i < fileList.length; i++) {
      if (isCancelled) break;
      const file = fileList[i];
      try {
        const res = await window.api.compressImage({
          filePath: file,
          mode,
          quality: parseInt(quality) || 90,
          format
        });

        // Guardar automáticamente si hay carpeta seleccionada
        if (outputFolder && res.outputBufferBase64) {
          const savePath = `${outputFolder}\\${res.fileName.replace(/\.[^/.]+$/, '')}_pf.${res.format}`;
          await window.api.saveCompressedFile({
            bufferBase64: res.outputBufferBase64,
            outputPath: savePath
          });
        }

        batchResults.push(res);
      } catch (err) {
        batchResults.push({ fileName: file, error: err.message, failed: true });
      }
      setProgress({ current: i + 1, total: fileList.length });
      setResults([...batchResults]);
    }

    setProcessing(false);
  };

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Procesamiento por lotes</h2>
        <p className="text-xs text-gray-400 mt-1">
          Compresión masiva de cientos de imágenes con concurrencia controlada para optimizar RAM y CPU
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 bg-[#181920] border border-[#262833] rounded-xl p-5 space-y-4">
          <div className="flex space-x-2">
            <button 
              onClick={handleAddFiles}
              className="flex-1 py-2 bg-[#20222b] hover:bg-[#282a36] text-white border border-[#2f3240] rounded-lg text-xs font-medium"
            >
              + Archivos
            </button>
            <button 
              onClick={handleAddFolder}
              className="flex-1 py-2 bg-[#20222b] hover:bg-[#282a36] text-white border border-[#2f3240] rounded-lg text-xs font-medium"
            >
              + Carpeta
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 block">Carpeta de salida</label>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                readOnly 
                value={outputFolder || 'No definida (vista previa en memoria)'} 
                className="w-full bg-[#121316] border border-[#2f3240] rounded-lg px-3 py-2 text-xs text-gray-400 truncate"
              />
              <button 
                onClick={handleSelectOutput}
                className="px-3 py-2 bg-[#20222b] text-white border border-[#2f3240] rounded-lg text-xs font-medium"
              >
                Elegir
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 block">Formato destino</label>
            <div className="grid grid-cols-3 gap-2">
              {['webp', 'avif', 'png'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`py-1.5 rounded-lg text-xs font-semibold uppercase border ${
                    format === fmt ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-[#14151b] border-[#262833] text-gray-400'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 block">Modo</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('lossless')}
                className={`py-1.5 rounded-lg text-xs font-medium border ${
                  mode === 'lossless' ? 'bg-violet-600/20 border-violet-500 text-violet-300' : 'bg-[#14151b] border-[#262833] text-gray-400'
                }`}
              >
                Sin pérdida
              </button>
              <button
                onClick={() => setMode('quality')}
                className={`py-1.5 rounded-lg text-xs font-medium border ${
                  mode === 'quality' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-[#14151b] border-[#262833] text-gray-400'
                }`}
              >
                Calidad ({quality}%)
              </button>
            </div>
          </div>

          {mode === 'quality' && (
            <input 
              type="range" 
              min="60" 
              max="98" 
              value={quality} 
              onChange={e => setQuality(e.target.value)} 
              className="w-full accent-indigo-500"
            />
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex justify-between">
              <span>Nivel de concurrencia</span>
              <span className="text-indigo-400 font-bold">{concurrency} hilos</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="4" 
              value={concurrency} 
              onChange={e => setConcurrency(e.target.value)} 
              className="w-full accent-indigo-500"
            />
            <span className="text-[10px] text-gray-400 block">Ideal para PCs con 8 GB de RAM</span>
          </div>

          {processing ? (
            <button
              onClick={() => setIsCancelled(true)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2"
            >
              <Square size={14} />
              <span>Cancelar proceso</span>
            </button>
          ) : (
            <button
              onClick={handleProcessBatch}
              disabled={fileList.length === 0}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 ${
                fileList.length === 0 ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Play size={14} />
              <span>Iniciar lote ({fileList.length} archivos)</span>
            </button>
          )}
        </div>

        <div className="col-span-8 bg-[#181920] border border-[#262833] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#262833] pb-3 mb-4">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Cola de procesamiento ({fileList.length} imágenes)
              </h3>
              {processing && (
                <span className="text-xs text-indigo-400 font-semibold animate-pulse">
                  Procesando {progress.current} de {progress.total}...
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {processing && (
              <div className="w-full bg-[#121316] h-2 rounded-full overflow-hidden mb-4 border border-[#262833]">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-300" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            )}

            <div className="max-h-[460px] overflow-y-auto divide-y divide-[#262833] text-xs">
              {fileList.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                  Agrega archivos o carpetas completas para procesar por lote.
                </div>
              ) : (
                fileList.map((file, idx) => {
                  const res = results.find(r => r.filePath === file);
                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <span className="truncate max-w-[280px] text-gray-200">{file.split('\\').pop()}</span>
                      {res ? (
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-400">{formatBytes(res.originalSize)} → {formatBytes(res.finalSize)}</span>
                          <span className="text-emerald-400 font-semibold">-{res.reductionPercent}%</span>
                          <CheckCircle size={15} className="text-emerald-400" />
                        </div>
                      ) : (
                        <span className="text-gray-400">Pendiente</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
