"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ onClose, children }: ModalProps) => {
  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-700 p-6 rounded-lg relative">
          <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
  );
};

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

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

  const handleCreate = async () => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });

    if (res.ok) {
      setShowCreateModal(false); // モーダル閉じる
      setNewTitle(""); // 入力リセット
      await fetchTodos(); // 最新一覧を再取得
    } else {
      console.error("作成に失敗しました");
    }
  }

  return (
      <div className="min-h-screen bg-gray-800 py-8 px-4">
        <div className="max-w-md mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-100">Todos</h2>
            <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
            >
              新規作成
            </button>
          </div>
          <ol className="space-y-2">
            {todos.map((todo) => (
                <li key={todo.id} className="bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors">
                  <Link
                      href={`/todos/${todo.id}`}
                      className="block px-4 py-3 text-gray-300 hover:text-gray-100 transition-colors"
                  >
                    {todo.title}
                  </Link>
                </li>
            ))}
          </ol>
          <Link
              href="/"
              className="inline-flex items-center mt-2 px-4 py-2 bg-gray-600 text-gray-100 font-semibold rounded-lg hover:bg-gray-500 transition-colors"
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
            Homeへ戻る
          </Link>
        </div>
        {showCreateModal && (
            <Modal onClose={() => setShowCreateModal(false)}>
              <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="新しいTodoを入力"
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end mt-4 space-x-2">
                <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                  キャンセル
                </button>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  作成
                </button>
              </div>
            </Modal>
        )}
      </div>
  )
}