'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Task, TaskStatus } from '@/types';
import TaskCardDnD from './TaskCardDnD';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface KanbanColumnDnDProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
}

const columnColors: Record<TaskStatus, { bg: string; border: string; text: string }> = {
  backlog: { bg: '#F9FAFB', border: '#E5E7EB', text: '#111827' },
  'in-progress': { bg: '#F9FAFB', border: '#E5E7EB', text: '#111827' },
  review: { bg: '#F9FAFB', border: '#E5E7EB', text: '#111827' },
  done: { bg: '#F9FAFB', border: '#E5E7EB', text: '#111827' },
};

export default function KanbanColumnDnD({
  status,
  title,
  tasks,
  onEditTask,
  hasMore,
  onLoadMore,
  isLoading,
}: KanbanColumnDnDProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: { xs: '100%', md: '280px' },
        minHeight: { xs: '400px', md: '500px' },
        maxHeight: { xs: 'calc(100vh - 200px)', md: 'calc(100vh - 180px)' },
        bgcolor: isOver ? '#EEF2FF' : columnColors[status].bg,
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        border: isOver 
          ? `2px solid #4F46E5` 
          : `1px solid ${columnColors[status].border}`,
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography 
          variant="subtitle1" 
          fontWeight={600}
          sx={{
            color: columnColors[status].text,
            fontSize: '0.875rem',
            textTransform: 'capitalize',
          }}
        >
          {title}
        </Typography>
      </Box>
      
      {isOver && (
        <Box
          sx={{
            bgcolor: columnColors[status].border,
            color: 'white',
            py: 1,
            px: 2,
            mb: 2,
            borderRadius: 1,
            textAlign: 'center',
            fontWeight: 600,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.7 },
            },
          }}
        >
          Drop here to move to {title}
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: '200px',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: columnColors[status].border,
            borderRadius: '4px',
          },
        }}
      >
        {tasks.map((task) => (
          <TaskCardDnD key={task.id} task={task} onEdit={onEditTask} />
        ))}

        {tasks.length === 0 && !isLoading && (
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

        {hasMore && (
          <Box ref={loadMoreRef} py={2} textAlign="center">
            {isLoading && <CircularProgress size={24} />}
          </Box>
        )}
      </Box>
    </Box>
  );
}

