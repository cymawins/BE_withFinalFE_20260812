import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { LandingFooter } from '@/components/layout/LandingFooter'
import { useFollowedNeighbors } from '@/hooks/useFollowedNeighbors'
import { useDmThreads } from '@/hooks/useDmThreads'
import {
  eventDataAll,
  helpPostData,
  initialMyPosts,
  neighborData,
  neighborStories,
  statusMeta,
  typeMeta,
  type HelpType,
  type MyHelpPost,
} from '@/data/connect'

const GREEN = 'oklch(0.56 0.09 152)'
const INK = 'oklch(0.4 0.02 145)'

type MapFilter = 'ALL' | 'FOLLOWER' | 'HELP'
type NearbyFilter = 'ALL' | 'FOLLOWING' | 'FOLLOWER'
type MarketFilter = 'ALL' | HelpType
type EventRegion = 'ALL' | '서울 마포구' | '경기 파주시'

/** 잇다(이웃 연결) 화면 (원본 screens/connect.dc.html 1:1 대응) */
export default function Connect() {
  const [searchParams] = useSearchParams()
  const { followed, toggleFollowKey } = useFollowedNeighbors()
  const { threads, sendMessage } = useDmThreads()

  const [nearbyFilter, setNearbyFilter] = useState<NearbyFilter>('ALL')
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('ALL')
  const [mapFilter, setMapFilter] = useState<MapFilter>('ALL')
  const [dmText, setDmText] = useState('')
  const [openNeighborKey, setOpenNeighborKey] = useState<string | null>(null)
  const [openHelpIndex, setOpenHelpIndex] = useState<number | null>(null)
  const [openEventIndex, setOpenEventIndex] = useState<number | null>(null)
  const [isMyHelpModalOpen, setIsMyHelpModalOpen] = useState(false)
  const [eventRegion, setEventRegion] = useState<EventRegion>('ALL')
  const [myHelpType, setMyHelpType] = useState<HelpType>('OFFER')
  const [myHelpTitle, setMyHelpTitle] = useState('')
  const [myHelpContent, setMyHelpContent] = useState('')
  const [myHelpShowPhoto, setMyHelpShowPhoto] = useState(false)
  const [myHelpShowFile, setMyHelpShowFile] = useState(false)
  const [myPosts, setMyPosts] = useState<MyHelpPost[]>(initialMyPosts)

  useEffect(() => {
    if (searchParams.get('openMyHelp') === '1') {
      setIsMyHelpModalOpen(true)
      setMyHelpType('REQUEST')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stopClick: React.MouseEventHandler = (e) => e.stopPropagation()

  // ---- 파생 데이터 (원본 renderVals()와 동일한 계산) ----
  const neighbors = neighborData.map((n) => {
    const isFollowing = followed[n.key]
    return {
      ...n,
      isFollowing,
      showFollowerBadge: !isFollowing && n.isFollower,
      followLabel: isFollowing ? '팔로잉' : '팔로우',
      followBg: isFollowing ? GREEN : 'transparent',
      followColor: isFollowing ? 'oklch(0.99 0.006 120)' : INK,
      followBorder: isFollowing ? GREEN : 'oklch(0.88 0.015 120)',
    }
  })

  const allHelpPosts = helpPostData.map((h, i) => ({
    ...h,
    id: i,
    typeLabel: typeMeta[h.type].label,
    typeBg: typeMeta[h.type].bg,
    typeColor: typeMeta[h.type].color,
    statusLabel: statusMeta[h.status].label,
    statusColor: statusMeta[h.status].color,
  }))
  const helpPosts = marketFilter === 'ALL' ? allHelpPosts : allHelpPosts.filter((h) => h.type === marketFilter)

  const marketFilterDefs: { key: MarketFilter; label: string }[] = [
    { key: 'ALL', label: '전체' },
    { key: 'OFFER', label: '나눔' },
    { key: 'REQUEST', label: '요청' },
  ]

  const eventDataFiltered = eventRegion === 'ALL' ? eventDataAll : eventDataAll.filter((e) => e.region === eventRegion)
  const eventRegionDefs: { key: EventRegion; label: string }[] = [
    { key: 'ALL', label: '전체' },
    { key: '서울 마포구', label: '서울 마포구' },
    { key: '경기 파주시', label: '경기 파주시' },
  ]

  const mapFilterDefs: { key: MapFilter; label: string }[] = [
    { key: 'ALL', label: '전체' },
    { key: 'FOLLOWER', label: '팔로잉 이웃' },
    { key: 'HELP', label: '품앗이 요청 이웃' },
  ]

  let visibleNeighborsForMap = neighbors
  if (mapFilter === 'FOLLOWER') visibleNeighborsForMap = neighbors.filter((n) => n.isFollower)
  else if (mapFilter === 'HELP') visibleNeighborsForMap = []

  const nearbyFilterDefs: { key: NearbyFilter; label: string }[] = [
    { key: 'ALL', label: '전체' },
    { key: 'FOLLOWING', label: '팔로잉' },
    { key: 'FOLLOWER', label: '팔로워' },
  ]
  let visibleNearbyNeighbors = neighbors
  if (nearbyFilter === 'FOLLOWING') visibleNearbyNeighbors = neighbors.filter((n) => n.isFollowing)
  else if (nearbyFilter === 'FOLLOWER') visibleNearbyNeighbors = neighbors.filter((n) => n.isFollower)

  const neighborPins = visibleNeighborsForMap.map((n, i) => ({
    label: n.name,
    color: GREEN,
    top: ['30%', '55%', '20%', '72%'][i] || '50%',
    left: ['28%', '68%', '75%', '35%'][i] || '50%',
  }))
  const marketPins =
    mapFilter === 'ALL' || mapFilter === 'HELP'
      ? allHelpPosts.map((h, i) => ({
          label: h.title.length > 10 ? h.title.slice(0, 10) + '…' : h.title,
          color: 'oklch(0.55 0.13 30)',
          top: ['65%', '25%', '45%', '78%'][i] || '50%',
          left: ['55%', '18%', '82%', '60%'][i] || '50%',
        }))
      : []
  const mapPins = [...neighborPins, ...marketPins]

  const selectedNeighbor = openNeighborKey ? neighbors.find((n) => n.key === openNeighborKey) : null
  const selectedNeighborCanMessage = !!(selectedNeighbor && followed[selectedNeighbor.key])
  const selectedNeighborIsFollowing = !!(selectedNeighbor && followed[selectedNeighbor.key])
  const selectedNeighborStories = selectedNeighbor ? [...(neighborStories[selectedNeighbor.key] || [])].sort((a, b) => a.sortKey - b.sortKey) : []
  const selectedNeighborMessages = selectedNeighbor
    ? (threads[selectedNeighbor.key] || []).map((m) => ({
        text: m.text,
        align: m.from === 'me' ? 'flex-end' : 'flex-start',
        bg: m.from === 'me' ? GREEN : 'oklch(0.96 0.015 130)',
        color: m.from === 'me' ? 'oklch(0.99 0.006 120)' : 'oklch(0.3 0.02 145)',
      }))
    : []

  const selectedHelp = openHelpIndex !== null ? allHelpPosts[openHelpIndex] : null
  const selectedHelpIsOpen = !!(selectedHelp && selectedHelp.status === 'OPEN')
  const selectedEvent = openEventIndex !== null ? eventDataFiltered[openEventIndex] : null

  const myHelpTypeOptions: { key: HelpType; label: string }[] = [
    { key: 'OFFER', label: '나눔' },
    { key: 'REQUEST', label: '요청' },
  ]

  const myPostsDecorated = myPosts.map((p) => ({
    ...p,
    typeLabel: typeMeta[p.type].label,
    typeBg: typeMeta[p.type].bg,
    typeColor: typeMeta[p.type].color,
  }))
  const myOngoingPosts = myPostsDecorated.filter((p) => p.status === 'OPEN')
  const myCompletedPosts = myPostsDecorated.filter((p) => p.status === 'COMPLETED')

  const submitMyHelp = () => {
    if (!myHelpTitle.trim()) return
    setMyPosts((prev) => [...prev, { id: `m${Date.now()}`, type: myHelpType, title: myHelpTitle.trim(), status: 'OPEN' }])
    setMyHelpTitle('')
    setMyHelpContent('')
    setMyHelpShowPhoto(false)
    setMyHelpShowFile(false)
  }

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    border: '1.5px solid oklch(0.88 0.015 120)',
    background: active ? GREEN : 'transparent',
    color: active ? 'oklch(0.99 0.006 120)' : INK,
    fontSize: 13.5,
    fontWeight: 700,
    padding: '9px 16px',
    borderRadius: 999,
    cursor: 'pointer',
  })

  return (
    <div className="app-screen" style={{ minHeight: '100vh', background: 'oklch(0.985 0.008 95)', color: 'oklch(0.24 0.02 145)' }}>
      <AppHeader active="connect" />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,40px) 100px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'oklch(0.5 0.1 152)' }}>가까운 이웃과 잇다</p>
            <h1 style={{ marginTop: 12, fontSize: 'clamp(28px,3.6vw,38px)', fontWeight: 900, letterSpacing: '-0.03em' }}>우리 동네 키움이들</h1>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: GREEN, display: 'inline-block' }} />
              <p style={{ fontSize: 14.5, color: 'oklch(0.48 0.02 145)' }}>현재 위치 · 서울 마포구 (GPS 기반, 반경 3km)</p>
            </div>
          </div>
        </div>

        {/* 지도 */}
        <section style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {mapFilterDefs.map((f) => (
              <button key={f.key} onClick={() => setMapFilter(f.key)} style={filterBtnStyle(mapFilter === f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ borderRadius: 28, background: 'oklch(0.94 0.03 140 / 0.5)', border: '1.5px solid oklch(0.88 0.05 145)', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', height: 'clamp(320px,40vw,420px)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-10%', left: '-8%', width: '45%', height: '45%', borderRadius: '50%', background: 'oklch(0.9 0.04 140 / 0.5)' }} />
              <div style={{ position: 'absolute', bottom: '-12%', right: '-6%', width: '50%', height: '50%', borderRadius: '50%', background: 'oklch(0.9 0.04 140 / 0.45)' }} />
              <div style={{ position: 'absolute', top: '20%', right: '10%', width: '30%', height: '30%', borderRadius: '50%', background: 'oklch(0.92 0.035 140 / 0.4)' }} />

              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 2 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: GREEN, border: '3px solid oklch(1 0 0)', boxShadow: `0 0 0 6px ${GREEN.replace(')', ' / 0.2)')}` }} />
                <span style={{ fontSize: 12, fontWeight: 800, background: 'oklch(1 0 0)', padding: '3px 10px', borderRadius: 999, boxShadow: '0 2px 6px oklch(0.3 0.03 145 / 0.15)' }}>나</span>
              </div>

              {mapPins.map((pin, i) => (
                <div key={i} style={{ position: 'absolute', top: pin.top, left: pin.left, transform: 'translate(-50%,-100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, background: 'oklch(1 0 0)', padding: '3px 9px', borderRadius: 999, boxShadow: '0 2px 6px oklch(0.3 0.03 145 / 0.12)', whiteSpace: 'nowrap', marginBottom: 2 }}>{pin.label}</span>
                  <span style={{ width: 14, height: 14, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: pin.color, border: '2px solid oklch(1 0 0)' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 20px', background: 'oklch(1 0 0)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'oklch(0.45 0.02 145)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'oklch(0.5 0.1 152)', display: 'inline-block' }} />팔로잉 이웃
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'oklch(0.45 0.02 145)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'oklch(0.55 0.13 30)', display: 'inline-block' }} />품앗이 요청 이웃
              </span>
            </div>
          </div>
        </section>

        {/* 가까운 이웃 */}
        <section style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>가까운 이웃</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {nearbyFilterDefs.map((f) => (
                <button key={f.key} onClick={() => setNearbyFilter(f.key)} style={filterBtnStyle(nearbyFilter === f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
            {visibleNearbyNeighbors.map((n) => (
              <div key={n.key} onClick={() => setOpenNeighborKey(n.key)} className="kiuda-connect-card" style={{ borderRadius: 22, background: 'oklch(1 0 0)', padding: 20, boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)', display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer', transition: 'transform .3s cubic-bezier(0.16,1,0.3,1), box-shadow .3s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <ImageSlot placeholder="프로필" shape="circle" />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800 }}>{n.name}</p>
                    <p style={{ fontSize: 12.5, color: 'oklch(0.5 0.02 145)' }}>
                      {n.distance} · {n.region}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: 'oklch(0.45 0.02 145)', lineHeight: 1.5 }}>{n.bio}</p>
                {n.isFollowing && (
                  <div style={{ textAlign: 'center', border: `1.5px solid ${n.followBorder}`, background: n.followBg, color: n.followColor, fontSize: 13.5, fontWeight: 700, padding: 9, borderRadius: 999 }}>
                    {n.followLabel}
                  </div>
                )}
                {n.showFollowerBadge && (
                  <div style={{ textAlign: 'center', background: 'oklch(0.94 0.03 140)', color: 'oklch(0.3 0.06 145)', fontSize: 13.5, fontWeight: 700, padding: 9, borderRadius: 999 }}>팔로워</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 품앗이 */}
        <section style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>품앗이</h2>
              <button onClick={() => setIsMyHelpModalOpen(true)} style={{ border: '1.5px solid oklch(0.88 0.015 120)', background: 'transparent', color: INK, fontSize: 13.5, fontWeight: 700, padding: '9px 16px', borderRadius: 999, cursor: 'pointer' }}>
                나의 품앗이 참여 현황
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {marketFilterDefs.map((f) => (
                <button key={f.key} onClick={() => setMarketFilter(f.key)} style={filterBtnStyle(marketFilter === f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 16 }}>
            {helpPosts.map((h) => (
              <article key={h.id} onClick={() => setOpenHelpIndex(h.id)} className="kiuda-connect-card" style={{ borderRadius: 22, background: 'oklch(1 0 0)', padding: 22, boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)', cursor: 'pointer', transition: 'transform .3s cubic-bezier(0.16,1,0.3,1), box-shadow .3s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 800, background: h.typeBg, color: h.typeColor }}>{h.typeLabel}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: h.statusColor }}>{h.statusLabel}</span>
                </div>
                <h3 style={{ marginTop: 14, fontSize: 16.5, fontWeight: 800 }}>{h.title}</h3>
                <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: 'oklch(0.48 0.02 145)' }}>{h.content}</p>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, color: 'oklch(0.55 0.02 145)' }}>
                  <span>{h.author}</span>
                  <span>{h.distance}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 지역 행사 일정 */}
        <section style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>지역 행사 일정</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {eventRegionDefs.map((f) => (
                <button key={f.key} onClick={() => setEventRegion(f.key)} style={filterBtnStyle(eventRegion === f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {eventDataFiltered.map((e, i) => (
              <div key={e.title} onClick={() => setOpenEventIndex(i)} className="kiuda-connect-card" style={{ borderRadius: 20, background: 'oklch(1 0 0)', padding: '20px 22px', boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', cursor: 'pointer', transition: 'transform .3s cubic-bezier(0.16,1,0.3,1), box-shadow .3s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ width: 64, flexShrink: 0, textAlign: 'center' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'oklch(0.5 0.1 152)' }}>{e.month}</p>
                  <p style={{ fontSize: 24, fontWeight: 900 }}>{e.day}</p>
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <h3 style={{ fontSize: 15.5, fontWeight: 800 }}>{e.title}</h3>
                  <p style={{ marginTop: 4, fontSize: 13, color: 'oklch(0.5 0.02 145)' }}>
                    {e.location} · {e.time}
                  </p>
                </div>
                <span style={{ borderRadius: 999, padding: '6px 14px', fontSize: 12.5, fontWeight: 700, background: 'oklch(0.94 0.03 140)', color: 'oklch(0.4 0.09 150)' }}>{e.tag}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 이웃 프로필 모달 */}
      {selectedNeighbor && (
        <div onClick={() => setOpenNeighborKey(null)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'oklch(0.2 0.02 145 / 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={stopClick} style={{ width: '100%', maxWidth: 560, maxHeight: '86vh', overflowY: 'auto', borderRadius: 32, background: 'oklch(1 0 0)', boxShadow: '0 40px 90px oklch(0.2 0.03 145 / 0.3)', padding: 'clamp(24px,4vw,36px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <ImageSlot placeholder="프로필" shape="circle" />
                </div>
                <div>
                  <h2 style={{ fontSize: 19, fontWeight: 900 }}>{selectedNeighbor.name}</h2>
                  <p style={{ marginTop: 2, fontSize: 13, color: 'oklch(0.5 0.02 145)' }}>
                    {selectedNeighbor.distance} · {selectedNeighbor.region}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => toggleFollowKey(selectedNeighbor.key)}
                  style={{
                    border: `1.5px solid ${selectedNeighborIsFollowing ? 'transparent' : 'oklch(0.88 0.015 120)'}`,
                    background: selectedNeighborIsFollowing ? GREEN : 'transparent',
                    color: selectedNeighborIsFollowing ? 'oklch(0.99 0.006 120)' : INK,
                    fontSize: 13.5,
                    fontWeight: 700,
                    padding: '9px 16px',
                    borderRadius: 999,
                    cursor: 'pointer',
                  }}
                >
                  {selectedNeighborIsFollowing ? '팔로잉 취소' : '팔로잉'}
                </button>
                <button onClick={() => setOpenNeighborKey(null)} aria-label="닫기" style={{ border: 'none', background: 'oklch(0.96 0.015 130)', width: 36, height: 36, borderRadius: '50%', fontSize: 16, cursor: 'pointer', color: INK }}>
                  ✕
                </button>
              </div>
            </div>

            <p style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: 'oklch(0.5 0.1 152)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>소개 피드</p>

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {selectedNeighborStories.map((s, i) => (
                <div key={i} style={{ borderRadius: 18, background: 'oklch(0.985 0.008 95)', padding: '16px 18px' }}>
                  <p style={{ fontSize: 12.5, color: 'oklch(0.55 0.02 145)' }}>
                    {s.createdAt} · {s.plantNickname}
                  </p>
                  <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.65, color: 'oklch(0.3 0.02 145)' }}>{s.content}</p>
                </div>
              ))}
            </div>

            {selectedNeighborCanMessage && (
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid oklch(0.94 0.01 130)' }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: 'oklch(0.35 0.02 145)' }}>1:1 다이렉트 메시지</p>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
                  {selectedNeighborMessages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.align, maxWidth: '85%', background: m.bg, color: m.color, borderRadius: 14, padding: '8px 12px', fontSize: 13, lineHeight: 1.5 }}>
                      {m.text}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="메시지를 입력하세요"
                    value={dmText}
                    onChange={(e) => setDmText(e.target.value)}
                    style={{ flex: 1, height: 44, border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 999, padding: '0 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }}
                  />
                  <button
                    onClick={() => {
                      sendMessage(selectedNeighbor.key, dmText)
                      setDmText('')
                    }}
                    style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 14, fontWeight: 700, padding: '0 20px', borderRadius: 999, cursor: 'pointer' }}
                  >
                    보내기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 품앗이 상세 모달 */}
      {selectedHelp && (
        <div onClick={() => setOpenHelpIndex(null)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'oklch(0.2 0.02 145 / 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={stopClick} style={{ width: '100%', maxWidth: 500, maxHeight: '86vh', overflowY: 'auto', borderRadius: 32, background: 'oklch(1 0 0)', boxShadow: '0 40px 90px oklch(0.2 0.03 145 / 0.3)', padding: 'clamp(24px,4vw,36px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <span style={{ borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 800, background: selectedHelp.typeBg, color: selectedHelp.typeColor }}>{selectedHelp.typeLabel}</span>
              <button onClick={() => setOpenHelpIndex(null)} aria-label="닫기" style={{ border: 'none', background: 'oklch(0.96 0.015 130)', width: 36, height: 36, borderRadius: '50%', fontSize: 16, cursor: 'pointer', color: INK, flexShrink: 0 }}>
                ✕
              </button>
            </div>
            <h2 style={{ marginTop: 16, fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>{selectedHelp.title}</h2>
            <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.7, color: INK }}>{selectedHelp.content}</p>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'oklch(0.55 0.02 145)' }}>
              <span>
                {selectedHelp.author} · {selectedHelp.distance}
              </span>
              <span style={{ fontWeight: 700, color: selectedHelp.statusColor }}>{selectedHelp.statusLabel}</span>
            </div>

            {selectedHelpIsOpen && (
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid oklch(0.94 0.01 130)' }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: 'oklch(0.35 0.02 145)' }}>1:1 다이렉트 메시지</p>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="메시지를 입력하세요"
                    value={dmText}
                    onChange={(e) => setDmText(e.target.value)}
                    style={{ flex: 1, height: 44, border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 999, padding: '0 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }}
                  />
                  <button onClick={() => setDmText('')} style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 14, fontWeight: 700, padding: '0 20px', borderRadius: 999, cursor: 'pointer' }}>
                    보내기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 나의 품앗이 참여 현황 모달 */}
      {isMyHelpModalOpen && (
        <div onClick={() => setIsMyHelpModalOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'oklch(0.2 0.02 145 / 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={stopClick} style={{ width: '100%', maxWidth: 600, maxHeight: '88vh', overflowY: 'auto', borderRadius: 32, background: 'oklch(1 0 0)', boxShadow: '0 40px 90px oklch(0.2 0.03 145 / 0.3)', padding: 'clamp(24px,4vw,36px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>나의 품앗이 참여 현황</h2>
              <button onClick={() => setIsMyHelpModalOpen(false)} aria-label="닫기" style={{ border: 'none', background: 'oklch(0.96 0.015 130)', width: 36, height: 36, borderRadius: '50%', fontSize: 16, cursor: 'pointer', color: INK, flexShrink: 0 }}>
                ✕
              </button>
            </div>

            <div style={{ marginTop: 24, borderRadius: 20, background: 'oklch(0.985 0.008 95)', padding: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 800 }}>새 품앗이 등록</p>
              <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                {myHelpTypeOptions.map((t) => {
                  const active = myHelpType === t.key
                  return (
                    <button
                      key={t.key}
                      onClick={() => setMyHelpType(t.key)}
                      style={{ border: `1.5px solid ${active ? GREEN : 'oklch(0.88 0.015 120)'}`, background: active ? GREEN : 'transparent', color: active ? 'oklch(0.99 0.006 120)' : INK, fontSize: 13.5, fontWeight: 700, padding: '9px 16px', borderRadius: 999, cursor: 'pointer' }}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={myHelpTitle}
                onChange={(e) => setMyHelpTitle(e.target.value)}
                style={{ marginTop: 12, width: '100%', border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 14, padding: '12px 16px', fontSize: 14.5, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }}
              />
              <textarea
                placeholder="내용을 입력하세요"
                value={myHelpContent}
                onChange={(e) => setMyHelpContent(e.target.value)}
                style={{ marginTop: 10, width: '100%', height: 80, resize: 'none', border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 14, padding: '12px 16px', fontSize: 14.5, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }}
              />

              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setMyHelpShowPhoto((v) => !v)} aria-label="사진 첨부" title="사진 첨부" style={{ border: 'none', background: myHelpShowPhoto ? 'oklch(0.94 0.03 140)' : 'oklch(0.96 0.015 130)', width: 36, height: 36, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}>
                  📷
                </button>
                <button onClick={() => setMyHelpShowFile((v) => !v)} aria-label="파일 첨부" title="파일 첨부" style={{ border: 'none', background: myHelpShowFile ? 'oklch(0.94 0.03 140)' : 'oklch(0.96 0.015 130)', width: 36, height: 36, borderRadius: '50%', fontSize: 15, cursor: 'pointer' }}>
                  📎
                </button>
                <button onClick={submitMyHelp} style={{ marginLeft: 'auto', border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 13.5, fontWeight: 800, padding: '10px 20px', borderRadius: 999, cursor: 'pointer' }}>
                  등록하기
                </button>
              </div>

              {myHelpShowPhoto && (
                <div style={{ marginTop: 12, height: 120, borderRadius: 14, overflow: 'hidden' }}>
                  <ImageSlot placeholder="품앗이 사진 첨부" shape="rect" />
                </div>
              )}
              {myHelpShowFile && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, background: 'oklch(0.96 0.015 130)', padding: '8px 12px', width: 'fit-content' }}>
                  <span style={{ fontSize: 14 }}>📄</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: INK }}>첨부파일.pdf 첨부됨</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 26 }}>
              <p style={{ fontSize: 14, fontWeight: 800 }}>진행중</p>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {myOngoingPosts.map((p) => (
                  <div key={p.id} style={{ borderRadius: 16, background: 'oklch(0.985 0.008 95)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <span style={{ borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 800, background: p.typeBg, color: p.typeColor }}>{p.typeLabel}</span>
                      <p style={{ marginTop: 6, fontSize: 14, fontWeight: 700 }}>{p.title}</p>
                    </div>
                    <button
                      onClick={() => setMyPosts((prev) => prev.map((mp) => (mp.id === p.id ? { ...mp, status: 'COMPLETED' } : mp)))}
                      style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 12.5, fontWeight: 700, padding: '8px 14px', borderRadius: 999, cursor: 'pointer', flexShrink: 0 }}
                    >
                      완료 처리
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <p style={{ fontSize: 14, fontWeight: 800 }}>완료</p>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {myCompletedPosts.map((p) => (
                  <div key={p.id} style={{ borderRadius: 16, background: 'oklch(0.985 0.008 95)', padding: '14px 16px', opacity: 0.7 }}>
                    <span style={{ borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 800, background: p.typeBg, color: p.typeColor }}>{p.typeLabel}</span>
                    <p style={{ marginTop: 6, fontSize: 14, fontWeight: 700 }}>{p.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 행사 상세 모달 */}
      {selectedEvent && (
        <div onClick={() => setOpenEventIndex(null)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'oklch(0.2 0.02 145 / 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={stopClick} style={{ width: '100%', maxWidth: 480, maxHeight: '86vh', overflowY: 'auto', borderRadius: 32, background: 'oklch(1 0 0)', boxShadow: '0 40px 90px oklch(0.2 0.03 145 / 0.3)', padding: 'clamp(24px,4vw,36px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 56, textAlign: 'center' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'oklch(0.5 0.1 152)' }}>{selectedEvent.month}</p>
                  <p style={{ fontSize: 26, fontWeight: 900 }}>{selectedEvent.day}</p>
                </div>
                <h2 style={{ fontSize: 19, fontWeight: 900, letterSpacing: '-0.02em' }}>{selectedEvent.title}</h2>
              </div>
              <button onClick={() => setOpenEventIndex(null)} aria-label="닫기" style={{ border: 'none', background: 'oklch(0.96 0.015 130)', width: 36, height: 36, borderRadius: '50%', fontSize: 16, cursor: 'pointer', color: INK, flexShrink: 0 }}>
                ✕
              </button>
            </div>
            <p style={{ marginTop: 16, fontSize: 14, color: 'oklch(0.5 0.02 145)' }}>
              {selectedEvent.location} · {selectedEvent.time}
            </p>
            <p style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.7, color: INK }}>{selectedEvent.description}</p>
            <a
              href={selectedEvent.sourceUrl}
              target="_blank"
              rel="noopener"
              style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 999 }}
            >
              해당 사이트에서 자세히 보기 →
            </a>
          </div>
        </div>
      )}
      <LandingFooter />
    </div>
  )
}
