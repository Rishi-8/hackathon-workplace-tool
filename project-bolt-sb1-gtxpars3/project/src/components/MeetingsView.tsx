import React, { useState } from 'react';
import { Meeting } from '../types';
import { mockMeetings } from '../data/mockData';
import { 
  Users, 
  Clock, 
  Mail, 
  MessageSquare,
  Check,
  Calendar,
  User
} from 'lucide-react';

export const MeetingsView: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);

  const confirmTimeSlot = (meetingId: string, timeSlotId: string) => {
    setMeetings(meetings.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, status: 'Scheduled' as const }
        : meeting
    ));
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'Scheduled': return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Meetings</h2>
        <p className="text-gray-600">AI-suggested meetings and scheduling</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{meeting.title}</h3>
                {meeting.description && (
                  <p className="text-gray-600 text-sm mb-3">{meeting.description}</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Participants</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {meeting.participants.map((participant, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{participant.name}</span>
                      {participant.email && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs">{participant.email}</span>
                        </div>
                      )}
                      {participant.slackHandle && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <MessageSquare className="h-3 w-3" />
                          <span className="text-xs">{participant.slackHandle}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Suggested Time Slots</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {meeting.suggestedTimes.map((timeSlot) => (
                  <div key={timeSlot.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{timeSlot.date}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {timeSlot.time} ({timeSlot.duration})
                    </div>
                    {meeting.status === 'Pending' && (
                      <button
                        onClick={() => confirmTimeSlot(meeting.id, timeSlot.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <Check className="h-4 w-4" />
                        <span>Confirm</span>
                      </button>
                    )}
                    {meeting.status === 'Scheduled' && (
                      <div className="w-full bg-green-50 text-green-700 text-sm font-medium py-2 px-3 rounded-lg text-center border border-green-200">
                        Scheduled
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};