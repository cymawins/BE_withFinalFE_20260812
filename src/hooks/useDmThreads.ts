import { useCallback, useState } from 'react'
import { defaultDmThreads, type DmMessage } from '@/data/connect'

const STORAGE_KEY = 'kiuda_dm_threads'

function loadDmThreads(): Record<string, DmMessage[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultDmThreads
  } catch {
    return defaultDmThreads
  }
}

/**
 * 원본 connect.dc.html / share.dc.html이 공유하는 1:1 다이렉트 메시지 스레드
 * (localStorage `kiuda_dm_threads`)를 그대로 이식한 훅.
 */
export function useDmThreads() {
  const [threads, setThreads] = useState<Record<string, DmMessage[]>>(() => loadDmThreads())

  const sendMessage = useCallback((key: string, text: string) => {
    if (!key || !text.trim()) return
    setThreads((prev) => {
      const next = { ...prev, [key]: [...(prev[key] || []), { from: 'me' as const, text: text.trim() }] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { threads, sendMessage }
}
