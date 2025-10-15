import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { todos } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { TodoModel } from "@/features/todo/model/todoModel";

const todoModel = new TodoModel();

// GET /api/todos -> 全件取得
export async function GET(request: NextRequest) {
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

    const inserted = todoModel.create(title);
    return NextResponse.json(inserted);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'unknown error' }, { status: 500 });
  }
}

