'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { useTaskStore } from '@/store/taskStore';
import { useUpdateTask } from '@/hooks/useTasks';
import { Add as AddIcon } from '@mui/icons-material';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
}

const columnColors: Record<TaskStatus, { bg: string; border: string }> = {
  backlog: { bg: '#f5f5f5', border: '#e0e0e0' },
  'in-progress': { bg: '#e3f2fd', border: '#90caf9' },
  review: { bg: '#fff3e0', border: '#ffb74d' },
  done: { bg: '#e8f5e9', border: '#81c784' },
};

export default function KanbanColumn({
  status,
  title,
  tasks,
  onAddTask,
}: KanbanColumnProps) {
  const { draggedTask, setDraggedTask, setSelectedStatus } = useTaskStore();
  const selectedStatus = useTaskStore((state) => state.selectedStatus);
  const updateTask = useUpdateTask();

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTask) return;

    await updateTask.mutateAsync({
      id: draggedTask.id,
      task: { status },
    });

    setDraggedTask(null);
    setSelectedStatus(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      setSelectedStatus(status);
    }
  };

  const handleDragLeave = () => {
    setSelectedStatus(null);
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', md: '280px' },
        minHeight: '600px',
        bgcolor: columnColors[status].bg,
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${columnColors[status].border}`,
        transition: 'all 0.2s',
        opacity: selectedStatus && selectedStatus !== status ? 0.5 : 1,
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Chip
            label={tasks.length}
            size="small"
            sx={{
              bgcolor: columnColors[status].border,
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddTask}
          sx={{ minWidth: 'auto', p: 1 }}
        >
          Add
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <Card
            sx={{
              bgcolor: 'transparent',
              border: '2px dashed',
              borderColor: columnColors[status].border,
              opacity: 0.5,
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" align="center">
                No tasks
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

