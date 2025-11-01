// Shared in-memory task storage
// This allows all API routes to access the same data
// In production, replace with a real database

export const taskStore = {
  tasks: [
    {
      id: '1',
      title: 'Design user interface',
      description: 'Create wireframes and design mockups for the dashboard',
      status: 'backlog',
      priority: 'high',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Set up project structure',
      description: 'Initialize Next.js project with necessary configurations',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-01-14T09:00:00Z',
      updatedAt: '2024-01-14T09:00:00Z',
    },
    {
      id: '3',
      title: 'Implement authentication',
      description: 'Add user login and registration functionality',
      status: 'review',
      priority: 'medium',
      createdAt: '2024-01-13T08:00:00Z',
      updatedAt: '2024-01-13T08:00:00Z',
    },
    {
      id: '4',
      title: 'Write documentation',
      description: 'Document all API endpoints and usage',
      status: 'done',
      priority: 'low',
      createdAt: '2024-01-12T07:00:00Z',
      updatedAt: '2024-01-12T07:00:00Z',
    },
    {
      id: '5',
      title: 'Code review',
      description: 'Review pull requests from team members',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-01-11T06:00:00Z',
      updatedAt: '2024-01-11T06:00:00Z',
    },
    {
      id: '6',
      title: 'Update dependencies',
      description: 'Upgrade project dependencies to latest versions',
      status: 'backlog',
      priority: 'medium',
      createdAt: '2024-01-10T05:00:00Z',
      updatedAt: '2024-01-10T05:00:00Z',
    },
  ],
};

