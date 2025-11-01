import { NextRequest, NextResponse } from 'next/server';
import { taskStore } from '@/lib/taskStore';

// GET /api/tasks - Get all tasks
export async function GET() {
  return NextResponse.json(taskStore.tasks);
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTask = {
      id: String(Date.now()),
      title: body.title,
      description: body.description,
      status: body.status || 'backlog',
      priority: body.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    taskStore.tasks.push(newTask);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 400 }
    );
  }
}

