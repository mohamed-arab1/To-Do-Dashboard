'use client';

import { useState, useMemo } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
} from '@mui/material';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import KanbanColumnDnD from '@/components/KanbanColumnDnD';
import TaskModal from '@/components/TaskModal';
import SearchBar from '@/components/SearchBar';
import { useTasks, useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { Task, TaskStatus } from '@/types';
import TaskCardDnD from '@/components/TaskCardDnD';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5', // Indigo
    },
    background: {
      default: '#F3F4F6', // Light gray
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

const ITEMS_PER_COLUMN = 5;

export default function Home() {
  const { data: tasks, isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus>('backlog');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCounts, setVisibleCounts] = useState<Record<TaskStatus, number>>({
    backlog: ITEMS_PER_COLUMN,
    'in-progress': ITEMS_PER_COLUMN,
    review: ITEMS_PER_COLUMN,
    done: ITEMS_PER_COLUMN,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  // Group tasks by status
  const groupedTasks = useMemo(() => {
    return columns.reduce((acc, column) => {
      const columnTasks = filteredTasks?.filter((task) => task.status === column.id) || [];
      acc[column.id] = columnTasks.slice(0, visibleCounts[column.id]);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [filteredTasks, visibleCounts]);

  // Check if there are more items to load
  const hasMore = useMemo(() => {
    return columns.reduce((acc, column) => {
      const columnTasks = filteredTasks?.filter((task) => task.status === column.id) || [];
      acc[column.id] = visibleCounts[column.id] < columnTasks.length;
      return acc;
    }, {} as Record<TaskStatus, boolean>);
  }, [filteredTasks, visibleCounts]);

  const handleLoadMore = (status: TaskStatus) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [status]: prev[status] + ITEMS_PER_COLUMN,
    }));
  };

  const handleOpenModal = (status?: TaskStatus) => {
    if (status) setSelectedColumn(status);
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmitTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      await updateTask.mutateAsync({
        id: editingTask.id,
        task: taskData,
      });
    } else {
      // Create new task
      await createTask.mutateAsync({
        ...taskData,
        status: selectedColumn,
      } as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = filteredTasks?.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Just for visual feedback - don't update yet
    const { over } = event;
    if (!over) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      console.log('No drop target');
      return;
    }

    const activeTask = filteredTasks?.find((t) => t.id === active.id);
    if (!activeTask) {
      console.log('Task not found:', active.id);
      return;
    }

    const overId = over.id as TaskStatus;
    
    console.log('Drag end:', {
      taskId: activeTask.id,
      fromStatus: activeTask.status,
      toStatus: overId,
    });

    // Check if overId is a valid column status
    if (columns.some((col) => col.id === overId)) {
      // Only update if status actually changed
      if (activeTask.status !== overId) {
        console.log('Updating task status from', activeTask.status, 'to', overId);
        // Update the task status to the new column
        updateTask.mutate({
          id: activeTask.id,
          task: { status: overId },
        });
      } else {
        console.log('Status unchanged, no update needed');
      }
    } else {
      console.log('Invalid column target:', overId);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header with Search and Add Task */}
          <Box mb={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={3}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <Button
                variant="contained"
                onClick={() => handleOpenModal()}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '120px',
                  '&:hover': {
                    bgcolor: '#4338CA',
                  },
                }}
              >
                Add Task
              </Button>
            </Box>
          </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load tasks. Please make sure json-server is running on
            port 4000.
          </Alert>
        )}

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Box
              display="flex"
              gap={3}
              sx={{
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'flex-start' },
              }}
            >
              {columns.map((column) => (
                <KanbanColumnDnD
                  key={column.id}
                  status={column.id}
                  title={column.title}
                  tasks={groupedTasks[column.id]}
                  onEditTask={handleEditTask}
                  hasMore={hasMore[column.id]}
                  onLoadMore={() => handleLoadMore(column.id)}
                  isLoading={false}
                />
              ))}
            </Box>

            <DragOverlay>
              {activeTask ? <TaskCardDnD task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        )}

          <TaskModal
            open={modalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitTask}
            initialTask={editingTask || undefined}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
