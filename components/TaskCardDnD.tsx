'use client';

import { useDraggable } from '@dnd-kit/core';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Task } from '@/types';
import { useDeleteTask } from '@/hooks/useTasks';
import { motion } from 'framer-motion';

interface TaskCardDnDProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export default function TaskCardDnD({ task, onEdit }: TaskCardDnDProps) {
  const deleteTask = useDeleteTask();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ 
    id: task.id,
    data: { task },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : { opacity: 1 };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteTask.mutateAsync(task.id);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      {...attributes}
      {...listeners}
    >
      <Card
        sx={{
          mb: 1.5,
          cursor: isDragging ? 'grabbing' : 'grab',
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
          '&:hover': {
            borderColor: '#D1D5DB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          },
          transition: 'all 0.2s ease',
          bgcolor: 'white',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
            <Box flex={1}>
              <Typography 
                variant="body1" 
                component="div" 
                fontWeight={600}
                sx={{ 
                  fontSize: '0.875rem',
                  color: '#111827',
                  mb: 0.5,
                }}
              >
                {task.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  lineHeight: 1.5,
                }}
              >
                {task.description}
              </Typography>
            </Box>

            <Box display="flex" gap={0.5}>
              <IconButton
                size="small"
                onClick={handleEdit}
                onPointerDown={(e) => e.stopPropagation()}
                sx={{ 
                  p: 0.5,
                  color: '#6B7280',
                  '&:hover': { color: '#111827', bgcolor: '#F3F4F6' },
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </IconButton>
              <IconButton
                size="small"
                onClick={handleDelete}
                onPointerDown={(e) => e.stopPropagation()}
                sx={{ 
                  p: 0.5,
                  color: '#6B7280',
                  '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' },
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

