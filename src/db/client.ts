import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const url = process.env.DB_FILE_NAME;
if (!url) {
  throw new Error('環境変数 DB_FILE_NAME が設定されていません (.env を確認)');
}

// libsql クライアント (ローカル file:./sqlite/dev.db)
export const client = createClient({ url });
export const db = drizzle(client, { schema });

export type { Todo, NewTodo, Topic, NewTopic } from './schema';