import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { todos } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/todos -> 全件取得
export async function GET() {
  const data = await db.select().from(todos).orderBy(todos.id);
  return NextResponse.json(data);
}

// POST /api/todos -> { title: string }
export async function POST(req: Request) {
  console.log('POST');
  try {
    const body = await req.json();
    const title = (body?.title ?? '').trim();
    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }
    const inserted = await db.insert(todos).values({ title }).returning();
    return NextResponse.json(inserted[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'unknown error' }, { status: 500 });
  }
}

// PATCH /api/todos?id=1 -> toggle completed
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const current = await db.select().from(todos).where(eq(todos.id, id));
  if (!current.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const nowCompleted = !current[0].completed;
  await db
    .update(todos)
    .set({ completed: nowCompleted})
    .where(eq(todos.id, id));
  return NextResponse.json({ id, completed: nowCompleted });
}

// DELETE /api/todos?id=1
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(todos).where(eq(todos.id, id));
  return NextResponse.json({ ok: true });
}

