import { useEffect, type ReactNode } from 'react'
import { BackgroundLayers } from '@/components/layout/BackgroundLayers'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { LandingFooter } from '@/components/layout/LandingFooter'

/**
 * 푸터 링크 서브 페이지 공통 레이아웃
 * hideBackground: 게시판 등 단색 배경이 필요할 때 히어로 사진 레이어 숨김
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
