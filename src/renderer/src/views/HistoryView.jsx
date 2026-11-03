import React, { useState, useEffect } from 'react';
import { History, Trash2, FolderOpen, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function HistoryView() {
  const [records, setRecords] = useState([]);

  const loadHistory = async () => {
    if (window.api && window.api.getHistory) {
      const data = await window.api.getHistory();
      setRecords(data || []);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = async () => {
    if (window.confirm('¿Seguro que deseas vaciar todo el historial local?')) {
      await window.api.clearHistory();
      setRecords([]);
    }
  };

  const handleDeleteItem = async (id) => {
    await window.api.deleteHistoryItem(id);
    setRecords(records.filter(r => r.id !== id));
  };

  const handleOpenFile = async (path) => {
    if (path && window.api.openFileInExplorer) {
      await window.api.openFileInExplorer(path);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Historial de optimizaciones</h2>
          <p className="text-xs text-gray-400 mt-1">
            Registro local detallado de todas las imágenes procesadas y ahorros conseguidos
          </p>
        </div>
        {records.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 rounded-lg text-xs font-medium flex items-center space-x-1.5"
          >
            <Trash2 size={13} />
            <span>Vaciar historial</span>
          </button>
        )}
      </div>

      <div className="bg-[#181920] border border-[#262833] rounded-xl p-5">
        {records.length === 0 ? (
          <div className="py-24 text-center text-gray-400 text-xs">
            No hay registros guardados en el historial local.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#262833] text-gray-400">
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Archivo</th>
                  <th className="py-2.5 px-3">Formato</th>
                  <th className="py-2.5 px-3">Peso Original</th>
                  <th className="py-2.5 px-3">Peso Final</th>
                  <th className="py-2.5 px-3">Ahorro</th>
                  <th className="py-2.5 px-3">Integridad</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262833]">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-[#1f212b]">
                    <td className="py-2.5 px-3 text-gray-400">{new Date(r.timestamp).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-200 truncate max-w-[200px]">{r.fileName}</td>
                    <td className="py-2.5 px-3 uppercase text-gray-300 font-semibold">{r.format}</td>
                    <td className="py-2.5 px-3 text-gray-400">{formatBytes(r.originalSize)}</td>
                    <td className="py-2.5 px-3 font-semibold text-indigo-400">{formatBytes(r.finalSize)}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">-{r.reductionPercent}%</td>
                    <td className="py-2.5 px-3">
                      {r.isLossless ? (
                        <span className="text-emerald-400 flex items-center space-x-1 text-[11px]">
                          <ShieldCheck size={13} />
                          <span>Sin pérdida</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center space-x-1 text-[11px]">
                          <AlertCircle size={13} />
                          <span>Con pérdida</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      {r.outputPath && (
                        <button
                          onClick={() => handleOpenFile(r.outputPath)}
                          title="Abrir en explorador"
                          className="p-1 hover:text-indigo-400 text-gray-400"
                        >
                          <FolderOpen size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteItem(r.id)}
                        title="Eliminar registro"
                        className="p-1 hover:text-rose-400 text-gray-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
