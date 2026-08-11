import { useCallback, useState } from 'react'

type FollowedMap = Record<string, boolean>

const STORAGE_KEY = 'kiuda_followed_mutual'
const MIGRATION_KEY = 'kiuda_followed_mutual_v2'
const KNOWN_KEYS = ['yj', 'sh', 'mk', 'jw']

function loadFollowed(): FollowedMap {
  const defaults: FollowedMap = { yj: true, sh: false, mk: false, jw: false }
  try {
    if (!localStorage.getItem(MIGRATION_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(['yj']))
      localStorage.setItem(MIGRATION_KEY, '1')
      return defaults
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const arr: string[] = JSON.parse(raw)
      const result: FollowedMap = {}
      KNOWN_KEYS.forEach((k) => {
        result[k] = arr.includes(k)
      })
      return result
    }
  } catch {
    // ignore
  }
  return defaults
}

/**
 * 원본 connect.dc.html / share.dc.html이 공유하는 맞팔로우 상태
 * (localStorage `kiuda_followed_mutual`)를 그대로 이식한 훅.
 */
export function useFollowedNeighbors() {
  const [followed, setFollowed] = useState<FollowedMap>(() => loadFollowed())

  const toggleFollowKey = useCallback((key: string) => {
    setFollowed((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.keys(next).filter((k) => next[k])))
      return next
    })
  }, [])

  return { followed, toggleFollowKey }
}
