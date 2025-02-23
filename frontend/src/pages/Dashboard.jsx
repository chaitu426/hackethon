import React, { useState } from 'react';
import  Sidebar  from '../components/sidebar.jsx';
import { Navbar } from '../components/navbar.jsx';
import { DashboardContent } from '../components/dash.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="mt-16 min-h-screen">
          <DashboardContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}

export default App;