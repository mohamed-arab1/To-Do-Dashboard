# Kanban To-Do Dashboard

A beautiful, modern Kanban-style task management dashboard built with **Next.js 16**, **Material UI**, **Zustand**, and **React Query**.

## 🚀 Features

- **Four Kanban Columns**: Backlog, In Progress, Review, and Done
- **Advanced Drag & Drop**: Smooth animations using @dnd-kit with visual feedback and drag overlay
- **Task Management**: Create, update, and delete tasks
- **Real-time Search**: Filter tasks by title or description instantly
- **Infinite Scroll**: Load more tasks as you scroll in each column
- **Task Details**: Title, description, priority, and timestamps
- **Beautiful UI**: Material UI with custom color-coded columns
- **Responsive Design**: Works seamlessly on desktop and mobile
- **React Query Caching**: Efficient data fetching and automatic cache invalidation
- **Type Safety**: Full TypeScript support
- **Smooth Animations**: Framer Motion for delightful interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Material UI (MUI)
- **Drag & Drop**: @dnd-kit (sortable, core, utilities)
- **Animations**: Framer Motion
- **Data Fetching**: React Query (TanStack Query)
- **Infinite Scroll**: react-intersection-observer
- **API**: json-server (mocked REST API)
- **Language**: TypeScript
- **Styling**: Emotion (CSS-in-JS via MUI)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task
```

2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Application

### Option 1: Run Both Server and Client Together (Recommended)

```bash
npm run dev:all
```

This starts both the json-server (port 4000) and Next.js dev server (port 3000) concurrently.

### Option 2: Run Separately

**Terminal 1** - Start the JSON server:
```bash
npm run server
```

**Terminal 2** - Start the Next.js dev server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Usage

### Search Tasks

Use the search bar at the top to filter tasks by title or description in real-time.

### Creating a Task

1. Click the "Add" button on any column
2. Fill in the task details (title, description, priority, status)
3. Click "Create"

### Moving Tasks with Drag & Drop

1. Click and hold the drag handle (⋮⋮) on a task card
2. Drag the task to another column
3. Release to drop - the task automatically updates its status
4. Watch the smooth animations as tasks transition between columns

### Infinite Scroll

1. Each column displays 5 tasks initially
2. Scroll down within a column to automatically load more tasks
3. A loading indicator appears when fetching more items

### Deleting a Task

1. Click the three-dot menu (⋮) on a task card
2. Select "Delete"

## 📁 Project Structure

```
task/
├── app/
│   ├── layout.tsx             # Root layout with QueryProvider
│   ├── page.tsx               # Main Kanban dashboard with DnD context
│   └── globals.css            # Global styles
├── components/
│   ├── KanbanColumnDnD.tsx    # Droppable column with infinite scroll
│   ├── TaskCardDnD.tsx        # Draggable task card with animations
│   ├── SearchBar.tsx          # Search input component
│   └── TaskModal.tsx          # Create/Edit task modal
├── hooks/
│   └── useTasks.ts            # React Query hooks for task operations
├── lib/
│   └── api.ts                 # API client functions
├── providers/
│   └── QueryProvider.tsx      # React Query provider
├── types/
│   └── index.ts               # TypeScript type definitions
├── db.json                    # Mock database (15 sample tasks)
└── package.json
```

## 🎨 Customization

### Changing Column Colors

Edit the `columnColors` object in `components/KanbanColumn.tsx`:

```typescript
const columnColors: Record<TaskStatus, { bg: string; border: string }> = {
  backlog: { bg: '#f5f5f5', border: '#e0e0e0' },
  'in-progress': { bg: '#e3f2fd', border: '#90caf9' },
  review: { bg: '#fff3e0', border: '#ffb74d' },
  done: { bg: '#e8f5e9', border: '#81c784' },
};
```

### Changing Priority Colors

Edit the `priorityColors` object in `components/TaskCard.tsx`:

```typescript
const priorityColors: Record<TaskPriority, 'success' | 'warning' | 'error'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};
```

## 🔧 Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run server` - Start json-server on port 3001
- `npm run dev:all` - Run both server and client together
- `npm run lint` - Run ESLint

## 📝 Mock Data

The application uses `db.json` as a mock database. You can edit this file directly to add or modify initial tasks, or use the UI.

## 🚀 Deployment

This application can be deployed to Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables if needed
4. Deploy

**API Endpoint**: http://localhost:4000/tasks

**Note**: For production, you'll need to replace json-server with a real backend API. Update the `API_URL` in `lib/api.ts` or set the `NEXT_PUBLIC_API_URL` environment variable to point to your production API endpoint.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

MIT License
