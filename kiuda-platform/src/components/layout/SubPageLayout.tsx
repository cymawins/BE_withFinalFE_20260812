import { useEffect, type ReactNode } from 'react'
import { BackgroundLayers } from '@/components/layout/BackgroundLayers'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { LandingFooter } from '@/components/layout/LandingFooter'

/**
 * 푸터 링크 서브 페이지 공통 레이아웃
 * app-shell: min-height 100vh + flex column → 푸터를 화면 하단에 고정
 *
 * [2026-09-02] hideBackground 추가
 *   배경 레이어(BackgroundLayers)를 렌더하지 않는다. 게시판 계열(1:1 문의)처럼
 *   흰 패널 위주라 사진 배경이 방해되는 화면에서 사용한다.
 *   기본값 false 이므로 기존 페이지들의 동작은 그대로다.
 */
export function SubPageLayout({
  children,
  hideBackground = false,
}: {
  children: ReactNode
  hideBackground?: boolean
}) {
  useEffect(() => {
    document.body.classList.add('neo-page')
    return () => {
      document.body.classList.remove('neo-page')
    }
  }, [])

  return (
    <div className="app-shell">
      {!hideBackground && <BackgroundLayers />}
      <LandingHeader />
      <main id="app-content" className="neo-main">
        {children}
      </main>
      <LandingFooter />
    </div>
  )
}
