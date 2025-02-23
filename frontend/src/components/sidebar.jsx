import React from 'react';
import { Home, BarChart2, Users, Settings, FileText, Mail } from 'lucide-react';

const navItems = [
  { icon: <Home size={20} />, label: 'Dashboard', id: 'dashboard' },
  { icon: <Users size={20} />, label: 'Add Crop', id: 'add info' },
  { icon: <BarChart2 size={20} />, label: 'Analytics', id: 'analytics' },
  { icon: <FileText size={20} />, label: 'Ask AI', id: 'Ask AI' },
  { icon: <Mail size={20} />, label: 'Watson', id: 'whatson' },
  
  
];

const Sidebar = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">AgroFarm</h1>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
