"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);


  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    if (!res.ok) {
      console.error('Failed to fetch todos');
      return;
    }
    const data = await res.json();
    setTodos(data);
  }
  useEffect(() => {
    fetchTodos()
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (!newTitle) return;
    if (isCreating) return; // ← 二重送信防止
    setIsCreating(true);

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    if (res.ok) {
      setNewTitle("");
      await fetchTodos();
    }
    setIsCreating(false)
  }

  const handleEdit = async (id: number, title: string) => {
    setTodos(prev =>
        // 現在のtodog群をループし、idが一致していたら、入力値で上書き
        prev.map(t => (t.id === id ? { ...t, title: title } : t))
    );
    // 更新処理
    // サーバー反映（エンドポイントは例）
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT', // もしくは 'PATCH'
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      // 失敗したので元に戻す
      console.error('更新失敗');
      return;
    }
    await fetchTodos();
    setIsCreating(false)
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("削除しますか？")) return;

    if (deletingId !== null) return; // ← 二重送信防止
    setDeletingId(id);

    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      // 失敗したので元に戻す
      console.error('削除失敗');
      return;
    }
    await fetchTodos();
    setDeletingId(null);
  }


  return (
      <div className="min-h-screen bg-gray-800 py-8 px-4">
        <form onSubmit={handleCreate} className="max-w-md mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
          <input
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              type="submit">
            {isCreating ? "送信中..." : "作成"}
          </button>
        </form>
        <div className="mt-8">
          <ul className="max-w-md mx-auto space-y-4">
            {todos.map((todo) => (
                <li key={todo.id} className="bg-gray-600 rounded-lg p-4 text-white">
                  <input
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                      value={todo.title}
                      onChange={(e) => handleEdit(todo.id, e.target.value)}
                  />
                  <button
                      className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                      onClick={() => handleDelete(todo.id)}
                      disabled={deletingId === todo.id}
                  >
                    {deletingId === todo.id ? "削除中..." : "削除"}
                  </button>
                </li>
            ))}
          </ul>
        </div>
        <Link
            href="/"
            className="inline-flex items-center mt-4 px-4 py-2 bg-gray-600 text-gray-100 font-semibold rounded-lg hover:bg-gray-500 transition-colors"
        >
          <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          戻る
        </Link>
      </div>
  )
}