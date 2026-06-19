import React, { useState } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MapViewPage from './pages/MapViewPage';
import DeploymentHub from './pages/DeploymentHub'; 

function App() {
  const [incidents, setIncidents] = useState([]); 
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#030712] text-white font-mono">
        <Sidebar />
  
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <div className="p-8 flex-1 overflow-y-auto">
            <Header />
            
            <main className="mt-6">
              <Routes>
                <Route path="/" element={<HomePage setIncidents={setIncidents} />} />
                <Route path="/map" element={<MapViewPage incidents={incidents} setIncidents={setIncidents} />} />
                
                <Route path="/deployment" element={<DeploymentHub />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;