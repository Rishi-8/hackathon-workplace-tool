export interface Task {
  id: string;
  title: string;
  sender: string;
  platform: 'Slack' | 'Email';
  priority: 'High' | 'Medium' | 'Low';
  urgency: 'Urgent' | 'Not Urgent';
  status: 'Pending' | 'In Progress' | 'Done';
  type: 'File Request' | 'Follow-up' | 'Action Item' | 'Review' | 'Meeting';
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  participants: Participant[];
  suggestedTimes: TimeSlot[];
  status: 'Pending' | 'Scheduled' | 'Completed';
  description?: string;
}

export interface Participant {
  name: string;
  email?: string;
  slackHandle?: string;
  avatar?: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  duration: string;
}

export type ViewType = 'dashboard' | 'tasks' | 'meetings' | 'settings';