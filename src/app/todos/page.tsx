import Link from "next/link";

export default function Todos() {
  return (
      <div className="min-h-screen bg-gray-800 py-8 px-4">
        <div className="max-w-md mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Todos</h2>
          <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-gray-100 font-semibold rounded-lg hover:bg-gray-500 transition-colors"
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