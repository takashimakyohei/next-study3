"use client";

import { useState, useEffect } from "react";
import { Topic, SearchParams } from "@/features/topics/types/topic";

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filters, setFilters] = useState<SearchParams>({
    title: '',
    publishStartAt: '',
    publishEndAt: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTopics = async (params?: SearchParams) => {
    const searchParams = new URLSearchParams();
    if (params?.title) searchParams.append("title", params.title);
    if (params?.publishStartAt) searchParams.append("publishStartAt", params.publishStartAt);
    if (params?.publishEndAt) searchParams.append("publishEndAt", params.publishEndAt);

    const res = await fetch(`/api/topics${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);
    const data = await res.json();

    if (res.ok) setTopics(data);
  };

  const handleSearch = () => fetchTopics(filters);

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const text = formData.get("text") as string;

    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchTopics();
    }
  };

  return (
      <div className="min-h-screen text-white p-8">
        <h1 className="text-3xl font-bold mb-8">トピックス検索</h1>

        <div className="mb-4">
          <button
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={() => setIsModalOpen(true)}
          >
            新規作成
          </button>
        </div>

        {/* モーダル部分 */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-96">
                <h3 className="text-lg font-medium mb-4">新規トピック</h3>
                <form onSubmit={handleSubmit}>
                  <input
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 mb-3 text-white"
                      type="text"
                      name="title"
                      placeholder="タイトル"
                      required
                  />
                  <textarea
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 mb-3 text-white"
                      name="text"
                      placeholder="本文"
                      required
                  ></textarea>
                  <div className="flex justify-between">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      作成
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* 検索フォーム */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">タイトル</label>
              <input
                  type="text"
                  value={filters.title}
                  onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">開始日時</label>
              <input
                  type="datetime-local"
                  value={filters.publishStartAt}
                  onChange={(e) => setFilters({ ...filters, publishStartAt: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">終了日時</label>
              <input
                  type="datetime-local"
                  value={filters.publishEndAt}
                  onChange={(e) => setFilters({ ...filters, publishEndAt: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              検索
            </button>
            <button
                onClick={() => setFilters({ title: '', publishStartAt: '', publishEndAt: '' })}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              クリア
            </button>
          </div>
        </div>

        {/* 一覧 */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <table className="min-w-full">
            <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-400 uppercase">
                ID
              </th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-400 uppercase">
                タイトル
              </th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-400 uppercase">
                開始日時
              </th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-400 uppercase">
                終了日時
              </th>
            </tr>
            </thead>
            <tbody>
            {topics.map((topic) => (
                <tr key={topic.id}>
                  <td className="px-6 py-4 text-sm text-gray-300">{topic.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{topic.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{topic.publishStartAt}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{topic.publishEndAt}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
