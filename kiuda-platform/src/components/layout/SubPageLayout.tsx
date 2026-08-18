import { useEffect, type ReactNode } from 'react'
import { BackgroundLayers } from '@/components/layout/BackgroundLayers'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { LandingFooter } from '@/components/layout/LandingFooter'

/** 푸터 링크 서브 페이지 공통 레이아웃 */
export function SubPageLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add('neo-page')
    return () => {
      document.body.classList.remove('neo-page')
    }
  }, [])

  return (
    <>
      <BackgroundLayers />
      <LandingHeader />
      <main id="app-content" className="neo-main" style={{ flex: '1 0 auto', width: '100%' }}>
        {children}
      </main>
      <LandingFooter />
    </>
  )
}
