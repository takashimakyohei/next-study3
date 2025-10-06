import './envConfig';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/db/schema',
  out: './drizzle',
  dbCredentials: {
    // file:./xxx.db 形式で指定（.env で DB_FILE_NAME="file:./sqlite.db" など）
    url: process.env.DB_FILE_NAME ?? '',
  },
});