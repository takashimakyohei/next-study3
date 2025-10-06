"use client";

import Link from "next/link";
import {useEffect, useState} from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);

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

  return (
      <div className="min-h-screen bg-gray-800 py-8 px-4">
        <div className="max-w-md mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Todos</h2>
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
      </div>
  )
}