import Link from "next/link";

export default function Dashboard() {
  return (
      <div className="min-h-screen  text-white p-8">
        <h1 className="text-3xl font-bold mb-8">管理ダッシュボード</h1>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard/topics" className="text-blue-400 hover:underline text-xl">トピックス管理</Link>
          </li>
        </ul>
      </div>
  );
}