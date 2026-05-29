'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const languages = [
  { code: 'vi', label: '🇻🇳 Tiếng Việt' },
  { code: 'id', label: '🇮🇩 Bahasa Indonesia' },
  { code: 'zh', label: '🇨🇳 中文' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState('vi')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage('ログインに失敗しました：' + error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { language }
      }
    })
    if (error) {
      setMessage('登録に失敗しました：' + error.message)
    } else {
      setMessage('確認メールを送りました。メールを確認してください。')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">JLPT学習アプリ</h1>
        <p className="text-center text-gray-500 text-sm mb-6">日本語能力試験対策</p>

        {isSignUp && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2 font-medium">言語を選択してください</p>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-2 rounded border text-sm ${
                    language === lang.code
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <input
          type="email"
          placeholder="メールアドレス / Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4 text-gray-800 bg-white placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="パスワード / Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4 text-gray-800 bg-white placeholder-gray-400"
        />

        {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

        {!isSignUp ? (
          <>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-500 text-white rounded p-2 mb-2 hover:bg-blue-600"
            >
              ログイン
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className="w-full border border-gray-300 text-gray-600 rounded p-2 hover:bg-gray-50"
            >
              新規登録はこちら
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-green-500 text-white rounded p-2 mb-2 hover:bg-green-600"
            >
              新規登録
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className="w-full border border-gray-300 text-gray-600 rounded p-2 hover:bg-gray-50"
            >
              ログインに戻る
            </button>
          </>
        )}
      </div>
    </div>
  )
}