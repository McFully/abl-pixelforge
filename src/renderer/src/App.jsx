import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import UpdateBanner from './components/UpdateBanner';
import DashboardView from './views/DashboardView';
import CompressionView from './views/CompressionView';
import ConversionView from './views/ConversionView';
import BatchView from './views/BatchView';
import QualityCompareView from './views/QualityCompareView';
import HistoryView from './views/HistoryView';
import SettingsView from './views/SettingsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeFiles, setActiveFiles] = useState([]);
  const [compareTarget, setCompareTarget] = useState(null);

  const handleSelectFilesDirectly = (files) => {
    setActiveFiles(files);
    setCurrentTab('compression');
  };

  const handleOpenInCompare = (filePath, compressedResult) => {
    setCompareTarget({ filePath, compressedResult });
    setCurrentTab('compare');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#121316] text-gray-200 font-sans">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <main className="flex-1 h-screen overflow-y-auto bg-[#121316] flex flex-col">
        <UpdateBanner />
        
        <div className="flex-1 overflow-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView 
              onNavigateToSection={setCurrentTab} 
              onSelectFilesDirectly={handleSelectFilesDirectly}
            />
          )}
          {currentTab === 'compression' && (
            <CompressionView 
              initialFiles={activeFiles}
              onOpenInCompare={handleOpenInCompare}
            />
          )}
          {currentTab === 'conversion' && <ConversionView />}
          {currentTab === 'batch' && <BatchView initialFiles={activeFiles} />}
          {currentTab === 'compare' && (
            <QualityCompareView 
              originalFile={compareTarget?.filePath || (activeFiles.length > 0 ? activeFiles[0] : null)}
              compressedData={compareTarget?.compressedResult}
            />
          )}
          {currentTab === 'history' && <HistoryView />}
          {currentTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}
