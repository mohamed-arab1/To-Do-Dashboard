'use client';

import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { Task, TaskPriority } from '@/types';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useDeleteTask } from '@/hooks/useTasks';

interface TaskCardProps {
  task: Task;
}

const priorityColors: Record<TaskPriority, 'success' | 'warning' | 'error'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

export default function TaskCard({ task }: TaskCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setDraggedTask } = useTaskStore();
  const deleteTask = useDeleteTask();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    await deleteTask.mutateAsync(task.id);
    handleCloseMenu();
  };

  const handleDragStart = () => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'move',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div" fontWeight={600}>
            {task.title}
          </Typography>
          <IconButton
            size="small"
            onClick={handleOpenMenu}
            sx={{ mt: -1, mr: -1 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={task.priority}
            color={priorityColors[task.priority]}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(task.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}

