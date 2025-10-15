// models/todo_model.ts
import { db } from "@/db/client";
import { todos } from "@/db/schema";
import { sql } from "drizzle-orm";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoModel {
  /*
    * 全件取得（ページネーション、キーワード検索対応）
    *
   */
  async findAll(params: { offset: number; limit: number; keyword?: string }): Promise<Todo[]> {
    let query = db.select().from(todos);

    if (params.keyword) {
      const pattern = `%${params.keyword}%`;
      query = query.where(sql`${todos.title}
      LIKE
      ${pattern}`);
    }

    return query.limit(params.limit).offset(params.offset);
  }

  async count(keyword?: string): Promise<number> {
    let query = db.select({ count: sql<number>`count(*)` }).from(todos);
    if (keyword) {
      const pattern = `%${keyword}%`;
      query = query.where(sql`${todos.title}
      LIKE
      ${pattern}`);
    }
    const [{ count }] = await query;
    return Number(count);
  }

  async create(title: string): Promise<Todo> {
    const inserted = await db.insert(todos).values({ title }).returning();
    return inserted[0];
  }
}