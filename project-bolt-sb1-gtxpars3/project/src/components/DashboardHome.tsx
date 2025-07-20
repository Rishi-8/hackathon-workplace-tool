import React from 'react';
import { mockTasks, mockMeetings } from '../data/mockData';
import { 
  CheckSquare, 
  Calendar, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const pendingTasks = mockTasks.filter(task => task.status === 'Pending').length;
  const inProgressTasks = mockTasks.filter(task => task.status === 'In Progress').length;
  const completedTasks = mockTasks.filter(task => task.status === 'Done').length;
  const urgentTasks = mockTasks.filter(task => task.urgency === 'Urgent').length;
  
  const pendingMeetings = mockMeetings.filter(meeting => meeting.status === 'Pending').length;
  const scheduledMeetings = mockMeetings.filter(meeting => meeting.status === 'Scheduled').length;

  const stats = [
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Urgent Tasks',
      value: urgentTasks,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const recentTasks = mockTasks.slice(0, 3);
  const upcomingMeetings = mockMeetings.filter(meeting => meeting.status === 'Pending').slice(0, 2);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Your AI-powered productivity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 hover:shadow-md transition-shadow duration-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
            <CheckSquare className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  task.priority === 'High' ? 'bg-red-500' :
                  task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.sender} • {task.platform}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'Done' ? 'bg-green-100 text-green-800' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Meetings</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-150">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{meeting.title}</h4>
                <p className="text-xs text-gray-600 mb-3">{meeting.participants.length} participants</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {meeting.suggestedTimes.length} time slots suggested
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};