import { useEffect, type ReactNode } from 'react'
import { BackgroundLayers } from '@/components/layout/BackgroundLayers'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { LandingFooter } from '@/components/layout/LandingFooter'

/**
 * 푸터 링크 서브 페이지 공통 레이아웃
<<<<<<< Updated upstream
 * hideBackground: 게시판 등 단색 배경이 필요할 때 히어로 사진 레이어 숨김
=======
 * app-shell: min-height 100vh + flex column → 푸터를 화면 하단에 고정
 *
 * hideBackground: 배경 레이어(BackgroundLayers)를 렌더하지 않는다.
 *   게시판 계열(공지/FAQ/1:1문의)처럼 흰 패널 위주라 배경이 오히려 방해되는
 *   화면에서 사용한다. (board.css의 `.neo-page .neo-bg-wrap { display:none }` 과
 *   동일한 의도이며, 이쪽은 DOM 자체를 만들지 않아 불필요한 렌더를 줄인다.)
>>>>>>> Stashed changes
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
