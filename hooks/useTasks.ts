import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/lib/api';
import { Task } from '@/types';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, task }: { id: number | string; task: Partial<Task> }) =>
      taskApi.update(id, task),
    onMutate: async ({ id, task }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      // Optimistically update to the new value
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], (old) =>
          old?.map((t) => (t.id === id ? { ...t, ...task, updatedAt: new Date().toISOString() } : t))
        );
      }
      
      // Return context with the snapshot
      return { previousTasks };
    },
    onSuccess: (updatedTask) => {
      // Update the cache with the server response
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((t) => (t.id === updatedTask.id ? updatedTask : t)) ?? []
      );
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      console.error('Failed to update task:', err);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number | string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

