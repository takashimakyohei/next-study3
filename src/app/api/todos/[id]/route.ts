import {NextRequest, NextResponse} from 'next/server';
import {db} from '@/db/client';
import {todos} from '@/db/schema';
import {eq} from 'drizzle-orm';

// GET /api/todos/id -> 個別取得
export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({error: 'id required'}, {status: 400});
  }

  const data = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id));

  if (!data.length) {
    return NextResponse.json({error: 'not found'}, {status: 404});
  }

  return NextResponse.json(data[0]);
}