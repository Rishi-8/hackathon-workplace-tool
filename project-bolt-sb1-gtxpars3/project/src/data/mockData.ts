import { Task, Meeting } from '../types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q4 budget proposal and provide feedback',
    sender: 'Sarah Johnson',
    platform: 'Email',
    priority: 'High',
    urgency: 'Urgent',
    status: 'Pending',
    type: 'Review',
    createdAt: '2024-01-15T09:30:00Z'
  },
  {
    id: '2',
    title: 'Send updated project timeline to stakeholders',
    sender: 'Mike Chen',
    platform: 'Slack',
    priority: 'Medium',
    urgency: 'Not Urgent',
    status: 'In Progress',
    type: 'Follow-up',
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '3',
    title: 'Upload design files to shared drive',
    sender: 'Emma Wilson',
    platform: 'Slack',
    priority: 'Low',
    urgency: 'Not Urgent',
    status: 'Done',
    type: 'File Request',
    createdAt: '2024-01-14T16:45:00Z'
  },
  {
    id: '4',
    title: 'Schedule team retrospective meeting',
    sender: 'David Rodriguez',
    platform: 'Email',
    priority: 'Medium',
    urgency: 'Urgent',
    status: 'Pending',
    type: 'Meeting',
    createdAt: '2024-01-15T11:15:00Z'
  },
  {
    id: '5',
    title: 'Review and approve marketing campaign assets',
    sender: 'Lisa Thompson',
    platform: 'Slack',
    priority: 'High',
    urgency: 'Not Urgent',
    status: 'In Progress',
    type: 'Review',
    createdAt: '2024-01-15T08:00:00Z'
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Weekly Product Sync',
    participants: [
      { name: 'Sarah Johnson', email: 'sarah.j@company.com' },
      { name: 'Mike Chen', slackHandle: '@mchen' },
      { name: 'Emma Wilson', email: 'emma.w@company.com' }
    ],
    suggestedTimes: [
      { id: '1a', date: 'January 18, 2024', time: '2:00 PM', duration: '1 hour' },
      { id: '1b', date: 'January 18, 2024', time: '3:30 PM', duration: '1 hour' },
      { id: '1c', date: 'January 19, 2024', time: '10:00 AM', duration: '1 hour' }
    ],
    status: 'Pending',
    description: 'Weekly alignment on product roadmap and sprint planning'
  },
  {
    id: '2',
    title: 'Q4 Budget Review',
    participants: [
      { name: 'David Rodriguez', email: 'david.r@company.com' },
      { name: 'Lisa Thompson', email: 'lisa.t@company.com' }
    ],
    suggestedTimes: [
      { id: '2a', date: 'January 17, 2024', time: '9:00 AM', duration: '2 hours' },
      { id: '2b', date: 'January 17, 2024', time: '1:00 PM', duration: '2 hours' }
    ],
    status: 'Scheduled',
    description: 'Comprehensive review of Q4 budget allocations and variances'
  },
  {
    id: '3',
    title: 'Design System Workshop',
    participants: [
      { name: 'Emma Wilson', email: 'emma.w@company.com' },
      { name: 'Sarah Johnson', email: 'sarah.j@company.com' },
      { name: 'Alex Kumar', slackHandle: '@akumar' }
    ],
    suggestedTimes: [
      { id: '3a', date: 'January 22, 2024', time: '11:00 AM', duration: '3 hours' },
      { id: '3b', date: 'January 23, 2024', time: '9:00 AM', duration: '3 hours' }
    ],
    status: 'Pending',
    description: 'Workshop to establish new design system components and guidelines'
  }
];