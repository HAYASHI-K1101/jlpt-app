'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Word = {
  id: number
  word: string
  reading: string
  meaning_vi: string
  meaning_id: string
  meaning_zh: string
  level: string
  category: string
}

export default function FlashcardPage() {
  const [words, setWords] = useState<Word[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [language, setLanguage] = useState('vi')
  const [level, setLevel] = useState('N5')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const lang = user.user_metadata?.language || 'vi'
      setLanguage(lang)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchWords = async () => {
      const { data } = await supabase
        .from('words')
        .select('*')
        .eq('level', level)
      if (data) {
        setWords(data)
        setCurrent(0)
        setFlipped(false)
      }
    }
    fetchWords()
  }, [level])

  const getMeaning = (word: Word) => {
    if (language === 'vi') return word.meaning_vi
    if (language === 'id') return word.meaning_id
    if (language === 'zh') return word.meaning_zh
    return word.meaning_vi
  }

  const handleNext = () => {
    setFlipped(false)
    setTimeout(() => setCurrent((prev) => (prev + 1) % words.length), 100)
  }

  const handlePrev = () => {
    setFlipped(false)
    setTimeout(() => setCurrent((prev) => (prev - 1 + words.length) % words.length), 100)
  }

  if (words.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">単語を読み込み中...</p>
    </div>
  )

  const word = words[current]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => router.push('/dashboard')} className="text-blue-500">
            ← ダッシュボード
          </button>
          <h1 className="text-lg font-bold text-gray-800">単語フラッシュカード</h1>
          <span className="text-gray-500 text-sm">{current + 1} / {words.length}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 justify-center">
          {['N5', 'N4', 'N3', 'N2', 'N1'].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                level === l
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-600'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div
          onClick={() => setFlipped(!flipped)}
          className="bg-white rounded-2xl shadow-lg p-8 min-h-64 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
        >
          {!flipped ? (
            <div className="text-center">
              <p className="text-6xl font-bold text-gray-800 mb-4">{word.word}</p>
              <p className="text-2xl text-gray-500">{word.reading}</p>
              <p className="text-gray-400 text-sm mt-6">タップして意味を見る</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-4">{getMeaning(word)}</p>
              <p className="text-gray-500">{word.category}</p>
              <p className="text-gray-400 text-sm mt-6">タップして単語に戻る</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={handlePrev}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50"
          >
            ← 前へ
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            次へ →
          </button>
        </div>
      </div>
    </div>
  )
}