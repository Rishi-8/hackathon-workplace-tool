import React, { useState } from 'react';
import { ViewType } from './types';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { TasksView } from './components/TasksView';
import { MeetingsView } from './components/MeetingsView';
import { SettingsView } from './components/SettingsView';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome />;
      case 'tasks':
        return <TasksView />;
      case 'meetings':
        return <MeetingsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 ml-64">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;