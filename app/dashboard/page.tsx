'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setEmail(user.email || '')
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">JLPT学習アプリ</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">学習メニュー</h2>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => router.push('/flashcard')}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md"
          >
            <h3 className="text-lg font-bold mb-2 text-gray-800">📖 単語学習</h3>
            <p className="text-gray-600 text-sm">フラッシュカードで単語を覚えよう</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md">
            <h3 className="text-lg font-bold mb-2 text-gray-800">✏️ 文法問題</h3>
            <p className="text-gray-600 text-sm">文法の問題を解いて練習しよう</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md">
            <h3 className="text-lg font-bold mb-2 text-gray-800">📚 読解練習</h3>
            <p className="text-gray-600 text-sm">文章を読んで問題を解こう</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md">
            <h3 className="text-lg font-bold mb-2 text-gray-800">🎧 リスニング</h3>
            <p className="text-gray-600 text-sm">音声を聞いて問題を解こう</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md">
            <h3 className="text-lg font-bold mb-2 text-gray-800">📝 模擬試験</h3>
            <p className="text-gray-600 text-sm">本番形式で腕試しをしよう</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md">
            <h3 className="text-lg font-bold mb-2 text-gray-800">📊 進捗確認</h3>
            <p className="text-gray-600 text-sm">学習の進み具合を確認しよう</p>
          </div>
        </div>
      </div>
    </div>
  )
}