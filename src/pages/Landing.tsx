import { useEffect } from 'react'
import { BackgroundLayers } from '@/components/layout/BackgroundLayers'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { LandingFooter } from '@/components/layout/LandingFooter'
import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'
import { WhatSection } from '@/components/sections/WhatSection'
import { CoreValues } from '@/components/sections/CoreValues'
import { CoreServices } from '@/components/sections/CoreServices'
import { WhyKiuda } from '@/components/sections/WhyKiuda'
import { Reviews } from '@/components/sections/Reviews'
import { Invitation } from '@/components/sections/Invitation'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useLandingBackgroundEffects } from '@/hooks/useLandingBackgroundEffects'

/** 랜딩페이지 — app-shell 로 푸터를 하단에 고정 */
export default function Landing() {
  useEffect(() => {
    document.body.classList.add('page-neo')
    return () => document.body.classList.remove('page-neo')
  }, [])

  useScrollReveal()
  useLandingBackgroundEffects()

  return (
    <div className="app-shell">
      <BackgroundLayers />
      <LandingHeader />
      <main className="neo-main">
        <Hero />
        <PainPoints />
        <WhatSection />
        <CoreValues />
        <CoreServices />
        <WhyKiuda />
        <Reviews />
        <Invitation />
      </main>
      <LandingFooter />
    </div>
  )
}
