import { useRef, useState } from 'react'
import { footerColumns, footerCopyright } from '@/data/footer'

/**
 * 접이식 Footer (원본 index.html <footer id="neo-footer"> + #neo-footer-toggle 버튼).
 * max-height/opacity 트랜지션으로 열림/닫힘, 라벨은 "확대"/"축소"로 전환.
 */
export function LandingFooter() {
  const [open, setOpen] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  const toggle = () => {
    const footer = footerRef.current
    if (!footer) return
    if (!open) {
      footer.style.maxHeight = `${footer.scrollHeight}px`
    } else {
      footer.style.maxHeight = '0px'
    }
    setOpen(!open)
  }

  return (
    <>
      <footer
        ref={footerRef}
        id="neo-footer"
        className="neo-footer"
        style={{
          maxHeight: open ? undefined : 0,
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.6s ease, opacity 0.6s ease',
          margin: 0,
        }}
      >
        <div
          className="neo-container"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 96, textAlign: 'left', padding: '16px 0' }}
        >
          {footerColumns.map((col) => (
            <div key={col.title} style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, justifyContent: 'flex-start', whiteSpace: 'nowrap' }}>
              <strong>{col.title}</strong>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: 20, whiteSpace: 'nowrap' }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div style={{ flex: 1, textAlign: 'left', color: 'var(--neo-muted)', whiteSpace: 'nowrap' }}>{footerCopyright}</div>
        </div>
      </footer>
      <button
        id="neo-footer-toggle"
        onClick={toggle}
        style={{
          display: 'block',
          width: '100%',
          border: 'none',
          background: '#e6eee1',
          color: 'var(--neo-muted)',
          fontSize: '0.85rem',
          fontWeight: 700,
          padding: 10,
          margin: 0,
          cursor: 'pointer',
        }}
      >
        {open ? '축소' : '확대'}
      </button>
    </>
  )
}
