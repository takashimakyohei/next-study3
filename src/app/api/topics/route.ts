import { NextRequest, NextResponse } from 'next/server'
import { SearchParams } from "@/features/topics/types/topic";
import { TopicModel } from "@/features/topics/model/topicModel";

export async function GET(request: NextRequest) {
  const topicModel = new TopicModel()

  // クエリパラメータを取得
  const searchParams: SearchParams = {
    title: request.nextUrl.searchParams.get("title") || undefined,
    publishStartAt: request.nextUrl.searchParams.get("publishStartAt") || undefined,
    publishEndAt: request.nextUrl.searchParams.get("publishEndAt") || undefined
  }

  // モデルに渡してデータを取得
  const data = await topicModel.findWithFilter(searchParams)

  return NextResponse.json(data)
}