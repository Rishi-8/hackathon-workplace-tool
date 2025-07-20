import React from 'react';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'meetings', label: 'Meetings', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI TaskFlow</h1>
        <p className="text-sm text-gray-600">Intelligent Task Management</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isActive ? 'text-blue-600 transform rotate-90' : 'text-gray-400 group-hover:text-gray-600'
                }`} 
              />
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">Pro Tip</h3>
          <p className="text-xs text-blue-700">
            Use AI-powered suggestions to prioritize your most important tasks automatically.
          </p>
        </div>
      </div>
    </div>
  );
};