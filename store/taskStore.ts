import { create } from 'zustand';
import { Task, TaskStatus } from '@/types';

interface TaskStore {
  draggedTask: Task | null;
  setDraggedTask: (task: Task | null) => void;
  selectedStatus: TaskStatus | null;
  setSelectedStatus: (status: TaskStatus | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  draggedTask: null,
  setDraggedTask: (task) => set({ draggedTask: task }),
  selectedStatus: null,
  setSelectedStatus: (status) => set({ selectedStatus: status }),
}));

