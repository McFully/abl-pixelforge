import React, { useState, useEffect } from 'react';
import { Activity, X, Copy, Download, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { telemetry } from '../utils/telemetry';

export default function TelemetryModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLogs(telemetry.getLogs());
    const unsub = telemetry.subscribe((updated) => setLogs(updated));
    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(telemetry.getFormattedReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `telemetria_360_pixelforge_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181a22] border border-[#2e3242] rounded-xl w-full max-w-3xl h-[520px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-[#262833] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Telemetría 360 y Diagnóstico</h2>
              <p className="text-[11px] text-gray-400">Búfer de auditoría en memoria ({logs.length} eventos)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#222530] hover:bg-[#2c303f] text-gray-300 text-xs font-medium transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copiado' : 'Copiar reporte'}</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
            >
              <Download size={14} />
              <span>Exportar JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#222530] transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Visor de logs */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-[11px] select-text">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 font-sans text-xs">
              Sin eventos registrados aún
            </div>
          ) : (
            logs.map((log, idx) => {
              const isError = log.level === 'error';
              const isWarn = log.level === 'warn';
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border ${
                    isError
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      : isWarn
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                      : 'bg-[#1e2029] border-[#2a2d3a] text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                    <span className="flex items-center space-x-1.5 font-bold uppercase">
                      {isError ? <AlertCircle size={12} className="text-rose-400" /> : isWarn ? <AlertTriangle size={12} className="text-amber-400" /> : <Info size={12} className="text-indigo-400" />}
                      <span>{log.tag}</span>
                    </span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="font-medium">{log.message}</div>
                  {log.details && (
                    <pre className="mt-1.5 p-1.5 bg-black/40 rounded text-[10px] text-gray-400 overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
