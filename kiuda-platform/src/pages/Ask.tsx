import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { askDefaultQuestion, diagnosisList, symptomChips } from '@/data/ask'

const GREEN = 'oklch(0.56 0.09 152)'
const SOFT_BG = 'oklch(0.94 0.03 140)'
const IDLE_BG = 'oklch(0.96 0.015 130)'

type AttachmentMode = 'photo' | 'voice' | null

/** 묻다(AI 온새미) 화면 (원본 screens/ask.dc.html 1:1 대응) */
export default function Ask() {
  const [question, setQuestion] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answeredQuestion, setAnsweredQuestion] = useState('')
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState('aphid')
  const [attachmentMode, setAttachmentMode] = useState<AttachmentMode>(null)

  const submitQuestion = () => {
    const q = question.trim() || askDefaultQuestion
    setIsThinking(true)
    setShowAnswer(false)
    window.setTimeout(() => {
      setIsThinking(false)
      setShowAnswer(true)
      setAnsweredQuestion(q)
    }, 900)
  }

  const toggleMode = (mode: Exclude<AttachmentMode, null>) => {
    setAttachmentMode((m) => (m === mode ? null : mode))
  }

  return (
    <div className="app-screen" style={{ minHeight: '100vh', background: 'oklch(0.985 0.008 95)', color: 'oklch(0.24 0.02 145)' }}>
      <AppHeader active="ask" />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,40px) 100px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 13.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'oklch(0.5 0.1 152)' }}>AI 온새미</p>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'oklch(0.55 0.02 145)' }}>생육에 관한 모든 정보가 담긴 지혜의 샘</span>
          </div>
          <h1 style={{ marginTop: 12, fontSize: 'clamp(26px,3.4vw,34px)', fontWeight: 900, letterSpacing: '-0.03em' }}>무엇이든 물어보세요</h1>
        </div>

        {isThinking && (
          <div
            style={{
              marginTop: 32,
              borderRadius: 24,
              padding: 1.5,
              background: 'linear-gradient(90deg, oklch(0.75 0.1 150 / 0.7), oklch(0.8 0.09 200 / 0.7), oklch(0.78 0.12 90 / 0.7), oklch(0.75 0.1 150 / 0.7))',
              backgroundSize: '300% 100%',
              animation: 'shimmer-border 3s linear infinite',
              boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)',
            }}
          >
            <div style={{ borderRadius: 22.5, background: 'oklch(1 0 0 / 0.65)', backdropFilter: 'blur(14px)', padding: 26.5, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: SOFT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, animation: 'onsaemi-pulse 1.2s ease-in-out infinite' }}>
                🌱
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'oklch(0.48 0.02 145)' }}>온새미가 사진과 증상을 분석하고 있어요…</p>
            </div>
          </div>
        )}

        {showAnswer && (
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ borderRadius: 24, background: SOFT_BG, padding: '22px 26px', alignSelf: 'flex-end', maxWidth: '80%' }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'oklch(0.3 0.04 145)' }}>{answeredQuestion}</p>
            </div>

            <div style={{ borderRadius: 28, background: 'oklch(1 0 0)', padding: 'clamp(24px,3vw,32px)', boxShadow: '0 2px 8px oklch(0.3 0.03 145 / 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: SOFT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🌱</span>
                <span style={{ fontSize: 15, fontWeight: 800 }}>온새미</span>
                <span style={{ fontSize: 12.5, color: 'oklch(0.55 0.02 145)' }}>근거 기반 가설 · 3초 전</span>
              </div>

              <p style={{ marginTop: 18, fontSize: 15.5, lineHeight: 1.75, color: 'oklch(0.32 0.02 145)' }}>
                첨부하신 사진과 증상을 종합하면, 아래 두 가지 원인이 유력해요. 확률이 가장 높은 후보부터 확인해 보시고, 맞는 진단을 선택해 주세요.
              </p>

              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {diagnosisList.map((d) => {
                  const isSelected = selectedDiagnosisId === d.id
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDiagnosisId(d.id)}
                      style={{
                        borderRadius: 20,
                        border: `1.5px solid ${isSelected ? GREEN : 'oklch(0.9 0.015 120)'}`,
                        background: isSelected ? 'oklch(0.97 0.02 140)' : 'oklch(0.985 0.008 95)',
                        padding: '20px 22px',
                        cursor: 'pointer',
                        transition: 'border-color .2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <h3 style={{ fontSize: 16.5, fontWeight: 800 }}>{d.name}</h3>
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'oklch(0.5 0.1 152)' }}>일치도 {d.confidence}</span>
                      </div>
                      <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.7, color: 'oklch(0.48 0.02 145)' }}>{d.reason}</p>
                      {isSelected && (
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid oklch(0.9 0.015 120)' }}>
                          <p style={{ fontSize: 13, fontWeight: 800, color: 'oklch(0.5 0.1 152)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>대처법</p>
                          <ul style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none' }}>
                            {d.steps.map((step) => (
                              <li key={step} style={{ display: 'flex', gap: 8, fontSize: 14, lineHeight: 1.6, color: 'oklch(0.35 0.02 145)' }}>
                                <span style={{ color: 'oklch(0.5 0.1 152)', fontWeight: 800 }}>·</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Link
                  to="/connect?openMyHelp=1"
                  style={{ border: '1.5px solid oklch(0.88 0.015 120)', background: 'transparent', color: 'oklch(0.4 0.02 145)', fontSize: 14, fontWeight: 700, padding: '11px 20px', borderRadius: 999, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                >
                  이웃에게 물어보기
                </Link>
                <button style={{ border: 'none', background: GREEN, color: 'oklch(0.99 0.006 120)', fontSize: 14, fontWeight: 800, padding: '11px 22px', borderRadius: 999, cursor: 'pointer' }}>이 진단이 맞아요</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 36, borderRadius: 28, background: 'oklch(1 0 0)', padding: '20px 22px', boxShadow: '0 12px 32px oklch(0.3 0.03 145 / 0.08)' }}>
          {attachmentMode && (
            <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
              {attachmentMode === 'photo' && (
                <div style={{ width: 96, height: 72, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                  <ImageSlot placeholder="사진 첨부" shape="rect" />
                </div>
              )}
              {attachmentMode === 'voice' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 999, background: 'oklch(0.94 0.05 30)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'oklch(0.6 0.14 30)', animation: 'onsaemi-pulse 1s ease-in-out infinite' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'oklch(0.5 0.13 30)' }}>음성으로 듣고 있어요…</span>
                </div>
              )}
              <button
                onClick={() => setAttachmentMode(null)}
                aria-label="첨부 제거"
                className="kiuda-round-btn"
                style={{ border: 'none', background: 'transparent', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'oklch(0.5 0.02 145)', flexShrink: 0 }}
              >
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'oklch(0.96 0.015 130)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✕</span>
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => toggleMode('photo')}
              aria-label="사진 첨부"
              title="사진 첨부"
              style={{ border: 'none', background: attachmentMode === 'photo' ? SOFT_BG : IDLE_BG, width: 44, height: 44, borderRadius: '50%', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}
            >
              📷
            </button>
            <button
              onClick={() => toggleMode('voice')}
              aria-label="음성 입력"
              title="음성 입력"
              style={{ border: 'none', background: attachmentMode === 'voice' ? 'oklch(0.94 0.05 30)' : IDLE_BG, width: 44, height: 44, borderRadius: '50%', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}
            >
              🎙️
            </button>
            <input
              type="text"
              placeholder="예: 방울토마토 잎 끝이 노랗게 마르고 있어요. 원인이 뭘까요?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ flex: 1, minWidth: 160, height: 48, border: '1.5px solid oklch(0.9 0.015 120)', borderRadius: 999, padding: '0 20px', fontSize: 15, fontFamily: 'inherit', outline: 'none', color: 'oklch(0.24 0.02 145)' }}
            />
            <button
              onClick={submitQuestion}
              aria-label="검색"
              className="kiuda-lift-btn"
              style={{
                border: 'none',
                background: GREEN,
                color: 'oklch(0.99 0.006 120)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 24px oklch(0.56 0.09 152 / 0.28)',
                flexShrink: 0,
                transition: 'transform .2s',
              }}
            >
              →
            </button>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: 'oklch(0.5 0.02 145)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>자주 묻는 증상</p>
          <div style={{ marginTop: 14, display: 'flex', gap: 10, overflowX: 'auto', padding: '2px 2px 10px' }}>
            {symptomChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => setQuestion(chip.label)}
                className="kiuda-chip"
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  border: '1.5px solid oklch(0.9 0.015 120)',
                  background: 'oklch(1 0 0)',
                  color: 'oklch(0.35 0.02 145)',
                  fontSize: 13.5,
                  fontWeight: 700,
                  padding: '10px 16px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'border-color .2s, transform .2s, background .2s',
                }}
              >
                <span style={{ fontSize: 15 }}>{chip.icon}</span>#{chip.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
