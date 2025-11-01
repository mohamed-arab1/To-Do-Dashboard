import { NextRequest, NextResponse } from 'next/server';
import { taskStore } from '@/lib/taskStore';

// GET /api/tasks/[id] - Get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = taskStore.tasks.find((t) => t.id === id);
  
  if (!task) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(task);
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const taskIndex = taskStore.tasks.findIndex((t) => t.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    taskStore.tasks[taskIndex] = {
      ...taskStore.tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(taskStore.tasks[taskIndex]);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 400 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskIndex = taskStore.tasks.findIndex((t) => t.id === id);
  
  if (taskIndex === -1) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }
  
  taskStore.tasks.splice(taskIndex, 1);
  
  return NextResponse.json({ success: true });
}

