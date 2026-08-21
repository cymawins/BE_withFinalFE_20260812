import { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { useDmThreads } from '@/hooks/useDmThreads'
import {
  NEIGHBOR_MASTER,
  NEIGHBOR_POSTED_BY_MONTH,
  POSTED_BY_MONTH,
  TODAY,
  baseComments,
  calendarWeekdays,
  conversationMeta,
  myPostsByDay,
  storyData,
  visibilityMeta,
  type Visibility,
} from '@/data/share'
import { LandingFooter } from '@/components/layout/LandingFooter'

const GREEN = 'oklch(0.56 0.09 152)'
const INK = 'oklch(0.4 0.02 145)'

type ViewMode = 'feed' | 'neighbor' | 'calendarDay'

/** 원본 share.dc.html 고유 로직: localStorage `kiuda_followed_mutual`을 직접 읽되
 *  기본값은 connect.dc.html과 다르게 ['yj','sh','mk']다 (원본 두 화면 로직 차이를 그대로 보존) */
function loadFollowedKeys(): string[] {
  try {
    const raw = localStorage.getItem('kiuda_followed_mutual')
    return raw ? JSON.parse(raw) : ['yj', 'sh', 'mk']
  } catch {
    return ['yj', 'sh', 'mk']
  }
}

/** 나누다(기록 공유) 화면 (원본 screens/share.dc.html 1:1 대응) */
export default function Share() {
  const { threads, sendMessage } = useDmThreads()

  const [draftContent, setDraftContent] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC')
  const [likes, setLikes] = useState<Record<string, boolean>>({ s1: true, s2: false })
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({ s1: false, s2: true })
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({ s1: 24, s2: 11 })
  const [commentsOpen, setCommentsOpen] = useState<Record<string, boolean>>({ s1: false, s2: false, s3: false, s4: false, s5: false, s6: false })
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({ s1: '', s2: '', s3: '', s4: '', s5: '', s6: '' })
  const [extraComments, setExtraComments] = useState<Record<string, { author: string; text: string }[]>>({ s1: [], s2: [], s3: [], s4: [], s5: [], s6: [] })
  const [selectedConversationKey, setSelectedConversationKey] = useState<string | null>(null)
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string | null>(null)
  const [dmText, setDmText] = useState('')
  const [calendarYear, setCalendarYear] = useState(2026)
  const [calendarMonth, setCalendarMonth] = useState(8)
  const [showCameraCapture, setShowCameraCapture] = useState(false)
  const [isFileAttached, setIsFileAttached] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('feed')
  const [viewedNeighborKey, setViewedNeighborKey] = useState<string | null>(null)
  const [viewedCalendarDay, setViewedCalendarDay] = useState<string | null>(null)

  const stopPropagation: React.MouseEventHandler = (e) => e.stopPropagation()

  // ---- 파생 데이터 (원본 renderVals()와 동일한 계산) ----
  const followedKeys = loadFollowedKeys()
  const mutualNeighborData = NEIGHBOR_MASTER.filter((n) => n.isFollower && followedKeys.includes(n.key))
  const mutualNeighbors = mutualNeighborData

  const visibilityOptions = (Object.keys(visibilityMeta) as Visibility[]).map((key) => ({
    key,
    label: visibilityMeta[key],
    active: visibility === key,
  }))

  const stories = storyData.map((s) => {
    const liked = likes[s.id] || false
    const bookmarked = bookmarks[s.id] || false
    const comments = [...(baseComments[s.id] || []), ...(extraComments[s.id] || [])]
    return {
      ...s,
      bookmarked,
      visibilityLabel: visibilityMeta[s.visibility],
      likeCount: likeCounts[s.id] || 0,
      likeIcon: liked ? '❤️' : '🤍',
      likeColor: liked ? 'oklch(0.55 0.13 30)' : 'oklch(0.5 0.02 145)',
      bookmarkIcon: bookmarked ? '🔖' : '📑',
      bookmarkColor: bookmarked ? GREEN : 'oklch(0.55 0.02 145)',
      commentCount: s.commentCount + (extraComments[s.id]?.length || 0),
      commentsOpen: commentsOpen[s.id],
      comments,
      commentDraft: commentDrafts[s.id] || '',
    }
  })

  const toggleLike = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }))
    setLikeCounts((prev) => ({ ...prev, [id]: prev[id] + (likes[id] ? -1 : 1) }))
  }
  const toggleBookmark = (id: string) => setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }))
  const toggleComments = (id: string) => setCommentsOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  const onCommentChange = (id: string, value: string) => setCommentDrafts((prev) => ({ ...prev, [id]: value }))
  const submitComment = (id: string) => {
    const text = (commentDrafts[id] || '').trim()
    if (!text) return
    setExtraComments((prev) => ({ ...prev, [id]: [...prev[id], { author: '민준', text }] }))
    setCommentDrafts((prev) => ({ ...prev, [id]: '' }))
  }

  const relMeta = (key: string) => {
    const master = NEIGHBOR_MASTER.find((n) => n.key === key)
    const isFollowing = followedKeys.includes(key)
    const isFollower = !!master?.isFollower
    if (isFollowing) return { relLabel: '팔로잉', relBg: GREEN, relColor: 'oklch(0.99 0.006 120)' }
    if (isFollower) return { relLabel: '팔로워', relBg: 'oklch(0.94 0.03 140)', relColor: 'oklch(0.3 0.06 145)' }
    return { relLabel: '', relBg: 'transparent', relColor: 'transparent' }
  }
  const conversations = conversationMeta.map((c) => ({ ...c, ...relMeta(c.key) }))
  const selectedConversation = conversations.find((c) => c.key === selectedConversationKey) || null
  const selectedConversationMessages = selectedConversation
    ? (threads[selectedConversation.key] || []).map((m) => ({
        text: m.text,
        align: m.from === 'me' ? 'flex-end' : 'flex-start',
        bg: m.from === 'me' ? GREEN : 'oklch(0.96 0.015 130)',
        color: m.from === 'me' ? 'oklch(0.99 0.006 120)' : 'oklch(0.3 0.02 145)',
      }))
    : []

  // 캘린더
  const postedDays = POSTED_BY_MONTH[`${calendarYear}-${calendarMonth}`] || []
  const neighborPostedDays =
    viewMode === 'neighbor' && viewedNeighborKey ? (NEIGHBOR_POSTED_BY_MONTH[viewedNeighborKey] || {})[`${calendarYear}-${calendarMonth}`] || [] : []
  const leadingBlanks = new Date(calendarYear, calendarMonth - 1, 1).getDay()
  const daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate()

  interface CalendarCell {
    label: string
    bg: string
    color: string
    weight: number
    disabled: boolean
    cursor: string
    day: number | null
  }
  const calendarCells: CalendarCell[] = []
  for (let i = 0; i < leadingBlanks; i++) {
    calendarCells.push({ label: '', bg: 'transparent', color: 'transparent', weight: 400, disabled: true, cursor: 'default', day: null })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const posted = postedDays.includes(day)
    const neighborPosted = neighborPostedDays.includes(day)
    const isToday = calendarYear === TODAY.year && calendarMonth === TODAY.month && day === TODAY.day
    const clickable = posted
    calendarCells.push({
      label: String(day),
      bg: neighborPosted ? 'oklch(0.2 0.01 145)' : posted ? GREEN : isToday ? 'oklch(0.94 0.03 140)' : 'transparent',
      color: posted || neighborPosted ? 'oklch(0.99 0.006 120)' : 'oklch(0.3 0.02 145)',
      weight: posted || neighborPosted || isToday ? 800 : 500,
      disabled: !clickable,
      cursor: clickable ? 'pointer' : 'default',
      day: clickable ? day : null,
    })
  }
  const calendarLabel = `${calendarYear}년 ${calendarMonth}월`
  const shiftMonth = (delta: number) => {
    let m = calendarMonth + delta
    let y = calendarYear
    if (m > 12) {
      m = 1
      y += 1
    } else if (m < 1) {
      m = 12
      y -= 1
    }
    setCalendarMonth(m)
    setCalendarYear(y)
  }

  const viewedNeighbor = viewedNeighborKey ? mutualNeighborData.find((n) => n.key === viewedNeighborKey) : null
  const viewedNeighborStories = viewedNeighbor ? storyData.filter((s) => s.key === viewedNeighbor.key).sort((a, b) => b.sortKey - a.sortKey) : []

  const dayD = viewedCalendarDay ? Number(viewedCalendarDay.split('-')[2]) : null
  const dayM = viewedCalendarDay ? Number(viewedCalendarDay.split('-')[1]) : null
  const calendarDayLabel = viewedCalendarDay ? `${dayM}월 ${dayD}일` : ''
  const myPostsOnSelectedDay = viewedCalendarDay && dayD ? myPostsByDay[dayD] || [] : []

  const isComposerOpen = draftContent.trim().length > 0
  const draftTags = ['방울토마토']
  const publish = () => setDraftContent('')

  const bookmarkedStories = stories.filter((s) => s.bookmarked)
  const selectedBookmark = stories.find((s) => s.id === selectedBookmarkId) || null

  const sendDm = () => {
    if (!selectedConversationKey || !dmText.trim()) return
    sendMessage(selectedConversationKey, dmText)
    setDmText('')
  }

  const dayOptionStyle: React.CSSProperties = { display: 'flex', gap: 8 }

  return (
    <div className="app-screen" style={{ minHeight: '100vh', background: 'oklch(0.985 0.008 95)', color: 'oklch(0.24 0.02 145)' }}>
      <AppHeader active="share" />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,40px) 100px' }}>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'oklch(0.5 0.1 152)' }}>키움이 소식을 나누다</p>
          <h1 style={{ marginTop: 12, fontSize: 'clamp(26px,3.4vw,34px)', fontWeight: 900, letterSpacing: '-0.03em' }}>성장의 순간을 기록해요</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: 'oklch(0.5 0.02 145)' }}>팔로잉하는 이웃의 소식만 모아봐요.</p>
        </div>

        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 24, alignItems: 'start' }}>
          <div style={{ minWidth: 0 }}>
            {viewMode === 'feed' && (
              <>
                <div style={{ borderRadius: 24, background: 'oklch(1 0 0)', padding: '20px 22px', boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'oklch(0.94 0.03 140)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'oklch(0.45 0.09 150)', flexShrink: 0 }}>민</div>
                    <textarea
                      placeholder="오늘 키움이의 변화를 기록해 보세요"
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      style={{ flex: 1, minWidth: 0, height: 56, resize: 'none', border: 'none', outline: 'none', fontSize: 15, fontFamily: 'inherit', lineHeight: 1.6, color: 'oklch(0.24 0.02 145)', paddingTop: 8 }}
                    />
                  </div>

                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={publish} style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 13, fontWeight: 800, padding: '8px 16px', borderRadius: 999, cursor: 'pointer' }}>
                      업데이트
                    </button>
                    <button onClick={() => setShowCameraCapture((v) => !v)} aria-label="사진 촬영" title="사진 촬영" style={{ border: 'none', background: showCameraCapture ? 'oklch(0.94 0.03 140)' : 'oklch(0.96 0.015 130)', width: 34, height: 34, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}>
                      📷
                    </button>
                    <button onClick={() => setIsFileAttached((v) => !v)} aria-label="파일 첨부" title="파일 첨부" style={{ border: 'none', background: isFileAttached ? 'oklch(0.94 0.03 140)' : 'oklch(0.96 0.015 130)', width: 34, height: 34, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}>
                      📎
                    </button>
                  </div>

                  {isFileAttached && (
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, background: 'oklch(0.96 0.015 130)', padding: '8px 12px', width: 'fit-content' }}>
                      <span style={{ fontSize: 14 }}>📄</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: INK }}>생육기록.pdf 첨부됨</span>
                    </div>
                  )}

                  {showCameraCapture && (
                    <div style={{ marginTop: 12, height: 150, borderRadius: 16, overflow: 'hidden' }}>
                      <ImageSlot placeholder="키움이 사진 첨부" shape="rect" />
                    </div>
                  )}

                  {isComposerOpen && (
                    <>
                      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {draftTags.map((t) => (
                          <span key={t} style={{ borderRadius: 999, background: 'oklch(0.96 0.015 130)', padding: '6px 12px', fontSize: 13, fontWeight: 600, color: INK }}>
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {visibilityOptions.map((v) => (
                            <button
                              key={v.key}
                              onClick={() => setVisibility(v.key)}
                              style={{ border: `1.5px solid ${v.active ? GREEN : 'oklch(0.88 0.015 120)'}`, background: v.active ? GREEN : 'transparent', color: v.active ? 'oklch(0.99 0.006 120)' : INK, fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: 999, cursor: 'pointer' }}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>
                        <button onClick={publish} style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 14.5, fontWeight: 800, padding: '11px 24px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 10px 24px oklch(0.56 0.09 152 / 0.28)' }}>
                          공유하기
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ marginTop: 20, display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4 }}>
                  {mutualNeighbors.map((n) => (
                    <button key={n.key} onClick={() => { setViewMode('neighbor'); setViewedNeighborKey(n.key) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, width: 64 }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '2px solid oklch(0.88 0.03 140)' }}>
                        <ImageSlot placeholder="프로필" shape="circle" />
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 64 }}>{n.name}</p>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {stories.map((s) => (
                    <article key={s.id} style={{ borderRadius: 24, background: 'oklch(1 0 0)', overflow: 'hidden', boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)' }}>
                      <div style={{ padding: '20px 22px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                          <ImageSlot placeholder="프로필" shape="circle" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14.5, fontWeight: 800 }}>
                            {s.author} <span style={{ fontWeight: 500, color: 'oklch(0.55 0.02 145)' }}>· {s.plantNickname}</span>
                          </p>
                          <p style={{ fontSize: 12.5, color: 'oklch(0.55 0.02 145)' }}>
                            {s.createdAt} · {s.visibilityLabel}
                          </p>
                        </div>
                      </div>

                      <p style={{ margin: '16px 22px 0', fontSize: 15, lineHeight: 1.7, color: 'oklch(0.3 0.02 145)' }}>{s.content}</p>

                      <div style={{ marginTop: 14, height: 280 }}>
                        <ImageSlot placeholder={s.photoPlaceholder} shape="rect" />
                      </div>

                      <div style={{ padding: '14px 22px 0', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {s.tags.map((tag) => (
                          <span key={tag} style={{ borderRadius: 999, background: 'oklch(0.96 0.015 130)', padding: '6px 12px', fontSize: 12.5, fontWeight: 600, color: INK }}>
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div style={{ padding: '14px 22px 20px', display: 'flex', alignItems: 'center', gap: 18, borderTop: '1px solid oklch(0.94 0.01 130)', marginTop: 14 }}>
                        <button onClick={() => toggleLike(s.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: s.likeColor }}>
                          <span>{s.likeIcon}</span>
                          {s.likeCount}
                        </button>
                        <button onClick={() => toggleComments(s.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'oklch(0.5 0.02 145)' }}>
                          💬 {s.commentCount}
                        </button>
                        <button onClick={() => toggleBookmark(s.id)} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16, color: s.bookmarkColor }}>
                          {s.bookmarkIcon}
                        </button>
                      </div>

                      {s.commentsOpen && (
                        <div style={{ padding: '0 22px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {s.comments.map((c, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13.5, lineHeight: 1.6 }}>
                              <span style={{ fontWeight: 800, flexShrink: 0 }}>{c.author}</span>
                              <span style={{ color: 'oklch(0.35 0.02 145)' }}>{c.text}</span>
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                            <input
                              type="text"
                              placeholder="댓글을 입력하세요"
                              value={s.commentDraft}
                              onChange={(e) => onCommentChange(s.id, e.target.value)}
                              style={{ flex: 1, minWidth: 0, height: 38, border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 999, padding: '0 14px', fontSize: 13.5, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }}
                            />
                            <button onClick={() => submitComment(s.id)} style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 13, fontWeight: 700, padding: '0 16px', borderRadius: 999, cursor: 'pointer' }}>
                              등록
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}

            {viewMode === 'neighbor' && viewedNeighbor && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <button onClick={() => setViewMode('feed')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: 'oklch(0.5 0.02 145)', alignSelf: 'flex-start' }}>
                  ← 전체 소식으로
                </button>
                <div style={{ borderRadius: 24, background: 'oklch(1 0 0)', padding: 24, boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <ImageSlot placeholder="프로필" shape="circle" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 900 }}>{viewedNeighbor.name}</h2>
                    <p style={{ marginTop: 4, fontSize: 13.5, color: 'oklch(0.5 0.02 145)' }}>{viewedNeighbor.plantNickname}</p>
                  </div>
                </div>

                {viewedNeighborStories.map((s) => (
                  <article key={s.id} style={{ borderRadius: 24, background: 'oklch(1 0 0)', overflow: 'hidden', boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)' }}>
                    <div style={{ padding: '20px 22px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                        <ImageSlot placeholder="프로필" shape="circle" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14.5, fontWeight: 800 }}>
                          {s.author} <span style={{ fontWeight: 500, color: 'oklch(0.55 0.02 145)' }}>· {s.plantNickname}</span>
                        </p>
                        <p style={{ fontSize: 12.5, color: 'oklch(0.55 0.02 145)' }}>{s.createdAt}</p>
                      </div>
                    </div>
                    <p style={{ margin: '16px 22px 0', fontSize: 15, lineHeight: 1.7, color: 'oklch(0.3 0.02 145)' }}>{s.content}</p>
                    <div style={{ marginTop: 14, height: 280 }}>
                      <ImageSlot placeholder={s.photoPlaceholder} shape="rect" />
                    </div>
                    <div style={{ padding: '16px 22px 20px' }} />
                  </article>
                ))}
              </div>
            )}

            {viewMode === 'calendarDay' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <button onClick={() => setViewMode('feed')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: 'oklch(0.5 0.02 145)', alignSelf: 'flex-start' }}>
                  ← 전체 소식으로
                </button>
                <h2 style={{ fontSize: 18, fontWeight: 900 }}>{calendarDayLabel} 내가 작성한 글</h2>
                {myPostsOnSelectedDay.map((p, i) => (
                  <div key={i} style={{ borderRadius: 24, background: 'oklch(1 0 0)', padding: 22, boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)' }}>
                    <p style={{ fontSize: 12.5, color: 'oklch(0.55 0.02 145)' }}>{p.plantNickname}</p>
                    <p style={{ marginTop: 8, fontSize: 15, lineHeight: 1.7, color: 'oklch(0.3 0.02 145)' }}>{p.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside style={{ borderRadius: 22, background: 'oklch(1 0 0)', padding: 20, boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)', position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={() => shiftMonth(-1)} aria-label="이전 달" style={{ border: 'none', background: 'oklch(0.96 0.015 130)', width: 24, height: 24, borderRadius: '50%', fontSize: 12, cursor: 'pointer', color: INK }}>
                  ‹
                </button>
                <h2 style={{ fontSize: 14, fontWeight: 800 }}>{calendarLabel}</h2>
                <button onClick={() => shiftMonth(1)} aria-label="다음 달" style={{ border: 'none', background: 'oklch(0.96 0.015 130)', width: 24, height: 24, borderRadius: '50%', fontSize: 12, cursor: 'pointer', color: INK }}>
                  ›
                </button>
              </div>
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, textAlign: 'center' }}>
                {calendarWeekdays.map((w) => (
                  <span key={w} style={{ fontSize: 11, fontWeight: 700, color: 'oklch(0.55 0.02 145)', paddingBottom: 4 }}>
                    {w}
                  </span>
                ))}
                {calendarCells.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!d.day) return
                      setViewedCalendarDay(`${calendarYear}-${calendarMonth}-${d.day}`)
                      setViewMode('calendarDay')
                    }}
                    disabled={d.disabled}
                    style={{ border: 'none', fontSize: 12, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: d.bg, color: d.color, fontWeight: d.weight, cursor: d.cursor, padding: 0 }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p style={{ marginTop: 10, fontSize: 11.5, color: 'oklch(0.55 0.02 145)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: GREEN, display: 'inline-block' }} />내가 글을 작성한 날
              </p>
              {viewMode === 'neighbor' && viewedNeighbor && (
                <p style={{ marginTop: 6, fontSize: 11.5, color: 'oklch(0.55 0.02 145)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'oklch(0.2 0.01 145)', display: 'inline-block' }} />
                  {viewedNeighbor.name}님이 글을 작성한 날
                </p>
              )}
            </div>

            <div style={{ paddingTop: 20, borderTop: '1px solid oklch(0.94 0.01 130)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 800 }}>다이렉트 메시지</h2>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {conversations.map((c) => (
                  <button key={c.key} onClick={() => setSelectedConversationKey(c.key)} style={{ border: 'none', background: 'transparent', textAlign: 'left', borderRadius: 14, padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                      <ImageSlot placeholder="프로필" shape="circle" />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</p>
                        {c.relLabel && (
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: c.relBg, color: c.relColor }}>{c.relLabel}</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: 'oklch(0.55 0.02 145)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMessage}</p>
                    </div>
                    <span style={{ fontSize: 11, color: 'oklch(0.6 0.02 145)', flexShrink: 0 }}>{c.lastTime}</span>
                  </button>
                ))}
              </div>

              <div style={{ paddingTop: 20, borderTop: '1px solid oklch(0.94 0.01 130)', marginTop: 20 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800 }}>북마크한 피드</h2>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {bookmarkedStories.map((s) => (
                    <button key={s.id} onClick={() => setSelectedBookmarkId(s.id)} style={{ border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0, width: '100%' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                        <ImageSlot placeholder={s.photoPlaceholder} shape="rect" />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.author} · {s.plantNickname}
                        </p>
                        <p style={{ fontSize: 11.5, color: 'oklch(0.55 0.02 145)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.content}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 북마크 상세 모달 */}
      {selectedBookmark && (
        <div onClick={() => setSelectedBookmarkId(null)} style={{ position: 'fixed', inset: 0, background: 'oklch(0.15 0.01 145 / 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 20 }}>
          <div onClick={stopPropagation} style={{ background: 'oklch(1 0 0)', borderRadius: 24, overflow: 'hidden', maxWidth: 480, width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedBookmarkId(null)} aria-label="닫기" style={{ position: 'absolute', top: 14, right: 14, zIndex: 1, border: 'none', background: 'oklch(1 0 0 / 0.85)', width: 32, height: 32, borderRadius: '50%', fontSize: 14, cursor: 'pointer', color: INK }}>
              ✕
            </button>
            <div style={{ padding: '20px 22px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <ImageSlot placeholder="프로필" shape="circle" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14.5, fontWeight: 800 }}>
                  {selectedBookmark.author} <span style={{ fontWeight: 500, color: 'oklch(0.55 0.02 145)' }}>· {selectedBookmark.plantNickname}</span>
                </p>
                <p style={{ fontSize: 12.5, color: 'oklch(0.55 0.02 145)' }}>
                  {selectedBookmark.createdAt} · {selectedBookmark.visibilityLabel}
                </p>
              </div>
            </div>

            <p style={{ margin: '16px 22px 0', fontSize: 15, lineHeight: 1.7, color: 'oklch(0.3 0.02 145)' }}>{selectedBookmark.content}</p>

            <div style={{ marginTop: 14, height: 280 }}>
              <ImageSlot placeholder={selectedBookmark.photoPlaceholder} shape="rect" />
            </div>

            <div style={{ padding: '14px 22px 0', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedBookmark.tags.map((tag) => (
                <span key={tag} style={{ borderRadius: 999, background: 'oklch(0.96 0.015 130)', padding: '6px 12px', fontSize: 12.5, fontWeight: 600, color: INK }}>
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ padding: '14px 22px 20px', display: 'flex', alignItems: 'center', gap: 18, borderTop: '1px solid oklch(0.94 0.01 130)', marginTop: 14 }}>
              <button onClick={() => toggleLike(selectedBookmark.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: selectedBookmark.likeColor }}>
                <span>{selectedBookmark.likeIcon}</span>
                {selectedBookmark.likeCount}
              </button>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'oklch(0.5 0.02 145)' }}>💬 {selectedBookmark.commentCount}</span>
              <button onClick={() => toggleBookmark(selectedBookmark.id)} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16, color: selectedBookmark.bookmarkColor }}>
                {selectedBookmark.bookmarkIcon}
              </button>
            </div>

            <div style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedBookmark.comments.map((c, i) => (
                <div key={i} style={dayOptionStyle}>
                  <span style={{ fontWeight: 800, flexShrink: 0 }}>{c.author}</span>
                  <span style={{ color: 'oklch(0.35 0.02 145)' }}>{c.text}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input
                  type="text"
                  placeholder="댓글을 입력하세요"
                  value={selectedBookmark.commentDraft}
                  onChange={(e) => onCommentChange(selectedBookmark.id, e.target.value)}
                  style={{ flex: 1, minWidth: 0, height: 38, border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 999, padding: '0 14px', fontSize: 13.5, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }}
                />
                <button onClick={() => submitComment(selectedBookmark.id)} style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 13, fontWeight: 700, padding: '0 16px', borderRadius: 999, cursor: 'pointer' }}>
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DM 모달 */}
      {selectedConversation && (
        <div onClick={() => setSelectedConversationKey(null)} style={{ position: 'fixed', inset: 0, background: 'oklch(0.15 0.01 145 / 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 20 }}>
          <div onClick={stopPropagation} style={{ background: 'oklch(1 0 0)', borderRadius: 22, padding: 22, maxWidth: 420, width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 800 }}>{selectedConversation.name}</p>
                {selectedConversation.relLabel && (
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: selectedConversation.relBg, color: selectedConversation.relColor }}>{selectedConversation.relLabel}</span>
                )}
              </div>
              <button onClick={() => setSelectedConversationKey(null)} aria-label="닫기" style={{ border: 'none', background: 'oklch(0.96 0.015 130)', width: 32, height: 32, borderRadius: '50%', fontSize: 14, cursor: 'pointer', color: INK }}>
                ✕
              </button>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 }}>
              {selectedConversationMessages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.align, maxWidth: '85%', background: m.bg, color: m.color, borderRadius: 14, padding: '8px 12px', fontSize: 13, lineHeight: 1.5 }}>
                  {m.text}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="메시지 입력"
                value={dmText}
                onChange={(e) => setDmText(e.target.value)}
                style={{ flex: 1, minWidth: 0, height: 36, border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 999, padding: '0 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }}
              />
              <button onClick={sendDm} style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 13, fontWeight: 700, padding: '0 14px', borderRadius: 999, cursor: 'pointer' }}>
                전송
              </button>
            </div>
          </div>
        </div>
      )}
      <LandingFooter />
    </div>
  )
}
