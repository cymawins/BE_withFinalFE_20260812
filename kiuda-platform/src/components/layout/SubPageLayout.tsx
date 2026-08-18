import { useEffect, type ReactNode } from 'react'
import { BackgroundLayers } from '@/components/layout/BackgroundLayers'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { LandingFooter } from '@/components/layout/LandingFooter'

/**
 * 푸터 링크 서브 페이지 공통 레이아웃
 * app-shell: min-height 100vh + flex column → 푸터를 화면 하단에 고정
 */
export function SubPageLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add('neo-page')
    return () => {
      document.body.classList.remove('neo-page')
    }
  }, [])

  return (
    <div className="app-shell">
      <BackgroundLayers />
      <LandingHeader />
      <main id="app-content" className="neo-main">
        {children}
      </main>
      <LandingFooter />
    </div>
  )
}
