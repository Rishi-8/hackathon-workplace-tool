import React, { useState } from 'react';
import { Task } from '../types';
import { mockTasks } from '../data/mockData';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Circle,
  Play
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'File Request': return 'bg-blue-100 text-blue-800';
      case 'Follow-up': return 'bg-purple-100 text-purple-800';
      case 'Action Item': return 'bg-orange-100 text-orange-800';
      case 'Review': return 'bg-indigo-100 text-indigo-800';
      case 'Meeting': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'Done': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'In Progress': return <Play className="h-4 w-4 text-blue-600" />;
      case 'Pending': return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h2>
        <p className="text-gray-600">AI-extracted tasks from your communications</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-2">
                    {task.platform === 'Email' ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                    <span>{task.sender}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {task.urgency === 'Urgent' && (
                <div className="flex items-center space-x-1 bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Urgent</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(task.type)}`}>
                  {task.type}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};