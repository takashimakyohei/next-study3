import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { todos } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/todos/id -> 個別取得
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const data = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id));

  if (!data.length) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const idStr = await context.params;

  const id = Number(idStr.id);

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // リクエストボディから title を取得
  const body = await req.json();
  const { title } = body;

  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const current = await db.select().from(todos).where(eq(todos.id, id));

  if (!current.length) return NextResponse.json({ error: 'not found' }, { status: 404 });

  await db
      .update(todos)
      .set({
        title: title,
        updatedAt: new Date()
      })
      .where(eq(todos.id, id));

  return NextResponse.json({ id, title });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const idStr = await context.params;
  const id = Number(idStr.id);

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const current = await db.select().from(todos).where(eq(todos.id, id));

  if (!current.length) return NextResponse.json({ error: 'not found' }, { status: 404 });

  await db.delete(todos).where(eq(todos.id, id));

  return NextResponse.json({ success: true });
}

