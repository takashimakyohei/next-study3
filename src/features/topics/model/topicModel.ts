import { db } from "@/db/client";
import { topics } from "@/db/schema";
import { and, sql } from "drizzle-orm";
import { Topic, SearchParams } from "@/features/topics/types/topic";

export class TopicModel {
  // フィルタ付き取得 + ページネーション
  async findWithFilter(params: SearchParams): Promise<Topic[]> {
    const { title, publishStartAt, publishEndAt } = params;

    const conditions: any[] = [];

    // 論理削除除外
    conditions.push(sql`${topics.deletedAt}
    IS NULL`);

    if (title && title.trim()) {
      const pattern = `%${title.trim()}%`;
      conditions.push(sql`${topics.title}
      LIKE
      ${pattern}`);
    }
    if (publishStartAt) {
      conditions.push(sql`${topics.publishStartAt}
      >=
      ${publishStartAt}`);
    }
    if (publishEndAt) {
      conditions.push(sql`${topics.publishEndAt}
      <=
      ${publishEndAt}`);
    }

    let query = db.select().from(topics).orderBy(topics.id);
    if (conditions.length) {
      query = query.where(and(...conditions));
    }

    return query;
  }

}