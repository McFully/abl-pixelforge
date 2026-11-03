import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  ArrowLeftRight, 
  Layers, 
  SlidersHorizontal, 
  History as HistoryIcon, 
  Settings as SettingsIcon 
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Panel principal', icon: LayoutDashboard },
    { id: 'compression', label: 'Compresión de imágenes', icon: Sparkles },
    { id: 'conversion', label: 'Conversión de formatos', icon: ArrowLeftRight },
    { id: 'batch', label: 'Procesamiento por lotes', icon: Layers },
    { id: 'compare', label: 'Comparador de calidad', icon: SlidersHorizontal },
    { id: 'history', label: 'Historial', icon: HistoryIcon },
    { id: 'settings', label: 'Configuración', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-[#16171d] border-r border-[#262833] flex flex-col justify-between shrink-0 h-screen select-none">
      <div>
        {/* Logo / Header */}
        <div className="p-5 border-b border-[#262833] flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black text-white text-lg">
            PF
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white uppercase">ABL PIXELFORGE</h1>
            <p className="text-[11px] text-gray-400">Windows 11 Image Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  active 
                    ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-indigo-300 border border-indigo-500/30 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f212a]'
                }`}
              >
                <Icon size={16} className={active ? 'text-indigo-400' : 'text-gray-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-[#262833] text-[10px] text-gray-400 flex flex-col space-y-1">
        <span className="font-semibold text-gray-300">PIXELFORGE v1.0.0</span>
        <span>© 2026 Aritz Bahamonde Larxé.</span>
        <span>Todos los derechos reservados.</span>
      </div>
    </aside>
  );
}
