import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { todos } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { TodoModel } from "@/features/todo/model/todoModel";

// GET /api/todos -> 全件取得
export async function GET(request: NextRequest) {
  const todoModel = new TodoModel();
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const keyword = searchParams.get("keyword")?.trim() || "";
  const offset = (page - 1) * limit;

  const data = await todoModel.findAll({ offset, limit, keyword });
  const totalItems = await todoModel.count(keyword);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return NextResponse.json({ data, totalPages, currentPage: page, keyword });
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

