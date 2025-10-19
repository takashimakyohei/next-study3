export interface Topic {
  id: number;
  title: string;
  text: string;
  publishStartAt: string | null; // NULL許可
  publishEndAt: string | null;   // NULL許可
  createdAt: string;             // TEXT TIMESTAMP
  updatedAt: string;             // TEXT TIMESTAMP
  deletedAt: string | null;      // 論理削除日時
}

export interface SearchParams {
  title?: string;
  publishStartAt?: string; // これ以降の開始日時でフィルタ
  publishEndAt?: string;   // これ以前の終了日時でフィルタ
}