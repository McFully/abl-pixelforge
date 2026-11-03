import React, { useEffect, useState } from 'react';
import { 
  Image as ImageIcon, 
  HardDriveDownload, 
  Percent, 
  Clock, 
  FileCheck2, 
  FolderUp, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function DashboardView({ onNavigateToSection, onSelectFilesDirectly }) {
  const [stats, setStats] = useState({
    totalImages: 0,
    totalSavedBytes: 0,
    avgReduction: 0,
    totalTimeSeconds: 0,
    mostUsedFormat: 'WebP',
    recentActivity: []
  });

  const loadStats = async () => {
    if (window.api && window.api.getAppStats) {
      const data = await window.api.getAppStats();
      setStats(data);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSelectFiles = async () => {
    if (window.api && window.api.selectFiles) {
      const files = await window.api.selectFiles();
      if (files && files.length > 0) {
        onSelectFilesDirectly(files);
      }
    }
  };

  const handleSelectFolder = async () => {
    if (window.api && window.api.selectFolder) {
      const files = await window.api.selectFolder();
      if (files && files.length > 0) {
        onSelectFilesDirectly(files);
      }
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Panel principal</h2>
        <p className="text-xs text-gray-400 mt-1">
          Métricas consolidadas de optimización y acceso directo al motor de compresión
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#181920] border border-[#262833] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Imágenes procesadas</span>
            <ImageIcon size={18} className="text-violet-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats.totalImages}</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">Archivos optimizados</span>
          </div>
        </div>

        <div className="bg-[#181920] border border-[#262833] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Espacio total ahorrado</span>
            <HardDriveDownload size={18} className="text-indigo-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-400">{formatBytes(stats.totalSavedBytes)}</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">Liberados en disco</span>
          </div>
        </div>

        <div className="bg-[#181920] border border-[#262833] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Reducción media</span>
            <Percent size={18} className="text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats.avgReduction}%</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">Eficiencia promedio</span>
          </div>
        </div>

        <div className="bg-[#181920] border border-[#262833] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Formato predilecto</span>
            <FileCheck2 size={18} className="text-sky-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats.mostUsedFormat}</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">{stats.totalTimeSeconds}s de cálculo</span>
          </div>
        </div>
      </div>

      {/* Main Drag & Drop Hero Box */}
      <div className="bg-gradient-to-b from-[#181922] to-[#15161c] border-2 border-dashed border-[#303342] hover:border-indigo-500/60 transition-all rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
          <Sparkles size={32} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Arrastra y suelta imágenes para comenzar</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            Soporta PNG, JPEG, WebP, AVIF, BMP y TIFF. Conversión y compresión ultra rápida con fidelidad verificada.
          </p>
        </div>
        <div className="flex items-center space-x-3 pt-2">
          <button 
            onClick={handleSelectFiles}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2"
          >
            <ImageIcon size={15} />
            <span>Seleccionar imágenes</span>
          </button>
          <button 
            onClick={handleSelectFolder}
            className="px-5 py-2.5 rounded-lg bg-[#20222b] hover:bg-[#282a36] text-gray-200 border border-[#2f3240] font-medium text-xs transition-all flex items-center space-x-2"
          >
            <FolderUp size={15} />
            <span>Seleccionar carpeta</span>
          </button>
        </div>
      </div>

      {/* Recent Conversions List */}
      <div className="bg-[#181920] border border-[#262833] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Actividad reciente</h3>
          <button 
            onClick={() => onNavigateToSection('history')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>Ver historial completo</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {stats.recentActivity.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">
            No hay conversiones registradas todavía. Comienza optimizando tus primeras imágenes.
          </div>
        ) : (
          <div className="divide-y divide-[#262833]">
            {stats.recentActivity.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-medium text-gray-200">{item.fileName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#20222b] text-gray-400 uppercase">
                    {item.format}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-gray-400">
                  <span>{formatBytes(item.originalSize)} → {formatBytes(item.finalSize)}</span>
                  <span className="text-emerald-400 font-semibold">-{item.reductionPercent}%</span>
                  <span>{item.timeTaken} ms</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
