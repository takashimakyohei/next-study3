"use client";

import { useEffect, useState } from "react";
import { Topic, SearchParams } from "@/features/topics/types/topic";

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filters, setFilters] = useState<SearchParams>({
    title: '',
    publishStartAt: '',
    publishEndAt: '',
  });
  const fetchTopics = async (params?: SearchParams) => {

    const searchParams = new URLSearchParams();
    if (params?.title) {
      searchParams.append('title', params.title);
    }
    if (params?.publishStartAt) {
      searchParams.append('publishStartAt', params.publishStartAt);
    }
    if (params?.publishEndAt) {
      searchParams.append('publishEndAt', params.publishEndAt);
    }

    const queryString = searchParams.toString();
    const url = `/api/topics${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url);
    const data = await res.json();

    if (res.ok) {
      setTopics(data);
    }
  }
  const handleSearch = () => {
    fetchTopics(filters)
  }
  useEffect(() => {
    fetchTopics()
  }, []);
  return (
      <div>
        <div className="min-h-screen text-white p-8">
          <h1 className="text-3xl font-bold mb-8">トピックス検索</h1>
          <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">タイトル</label>
                <input type="text"
                       value={filters.title}
                       onChange={(e) => setFilters({...filters, title: e.target.value})}
                       className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">開始日時</label>
                <input type="datetime-local"
                       value={filters.publishStartAt}
                       onChange={(e) => setFilters({...filters, publishStartAt: e.target.value})}
                       className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">終了日時</label>
                <input type="datetime-local"
                       value={filters.publishEndAt}
                       onChange={(e) => setFilters({...filters, publishEndAt: e.target.value})}
                       className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"/>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button onClick={handleSearch}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                検索
              </button>
              <button onClick={() => setFilters({ title: '', publishStartAt: '', publishEndAt: '' })}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                クリア
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <table className="min-w-full">
                <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    タイトル
                  </th>
                  <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    開始日時
                  </th>
                  <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    終了日時
                  </th>
                </tr>
                </thead>
                <tbody>
                {topics.map((topic) => (
                    <tr key={topic.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {topic.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {topic.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {topic.publishStartAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {topic.publishEndAt}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}