"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoDetailPage({params}: { params: Promise<{ slug: string[] }> }) {

  const [todo, setTodo] = useState<Todo>({id: 0, title: '', completed: false});

  const {slug} = use(params);
  const id= slug[0];

  const fetchTodo = async () => {
    const res = await fetch(`/api/todos/${id}`);
    if (!res.ok) {
      console.error('Failed to fetch todos');
      return;
    }
    const data = await res.json();
    setTodo(data);
  }
  useEffect(() => {
    fetchTodo()
  }, []);

  return (
      <div className="min-h-screen bg-gray-800 py-8 px-4">
        <div className="max-w-md mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Todo Detail</h2>
          <div>
            <p className="text-gray-300">Title: {todo.title}</p>
            <p className="text-gray-300">Status: {todo.completed ? 'Completed' : 'Not Completed'}</p>
          </div>
          <Link
              href="/todos"
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
      </div>
  )
}