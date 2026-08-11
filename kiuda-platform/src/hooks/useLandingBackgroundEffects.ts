import { useEffect } from 'react'

/**
 * 원본 js/neo-anim.js의 스크롤 기반 배경 사진 연출 3종을 그대로 이식한 훅.
 * (수치/커브/이징까지 원본과 동일 — 랜딩 페이지 전용)
 *
 *  1) 첫 번째 배경 레이어(.page-neo .neo-bg-img) — hero에서 Core Services까지
 *     opacity 1 → 0.3 → 0 으로 소실
 *  2) 두 번째 배경 레이어(.neo-bg-img2) — Why Kiuda부터 Invitation까지
 *     opacity/blur를 보간하며 다시 선명해짐
 *  3) 전역 화이트 마스크(.page-neo .neo-bg-fade) — 스크롤 진행도에 따라
 *     점진적으로 밝아지는 단일 그라디언트 베일
 */
export function useLandingBackgroundEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = []

    // ---- 1) 전역 화이트 마스크 ----
    {
      const fade = document.querySelector<HTMLElement>('.page-neo .neo-bg-fade')
      if (fade) {
        const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

        const updateMask = () => {
          const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
          let p = Math.min(Math.max(window.scrollY / max, 0), 1)
          p = easeInOut(p)
          const b = 0
          fade.style.background =
            'linear-gradient(180deg,' +
            `rgba(255,255,255,${(b + p * 0.12).toFixed(3)}) 0%,` +
            `rgba(255,255,255,${(b + p * 0.22).toFixed(3)}) 25%,` +
            `rgba(255,255,255,${(b + p * 0.32).toFixed(3)}) 50%,` +
            `rgba(255,255,255,${(b + p * 0.4).toFixed(3)}) 75%,` +
            `rgba(255,255,255,${Math.min(b + p * 0.48, 0.88).toFixed(3)}) 100%)`
        }

        let ticking = false
        const onScroll = () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              updateMask()
              ticking = false
            })
            ticking = true
          }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', updateMask, { passive: true })
        updateMask()
        cleanups.push(() => {
          window.removeEventListener('scroll', onScroll)
          window.removeEventListener('resize', updateMask)
        })
      }
    }

    // ---- 2) 두 번째 배경 레이어 (WHY → Invitation 페이드인) ----
    {
      const img2 = document.querySelector<HTMLElement>('.neo-bg-img2')
      const pain = document.getElementById('pain')
      const values = document.getElementById('values')
      const services = document.getElementById('services')
      const why = document.getElementById('why')
      const invite = document.getElementById('invite')

      if (img2 && pain && values && services && why && invite) {
        const startOpacity = () => {
          const painBottomY = window.scrollY + pain.getBoundingClientRect().bottom
          const servicesTopY = window.scrollY + services.getBoundingClientRect().top
          const valuesTopY = window.scrollY + values.getBoundingClientRect().top
          const span = Math.max(servicesTopY - painBottomY, 1)
          const p = Math.min(Math.max((valuesTopY - painBottomY) / span, 0), 1)
          return 0.3 * (1 - p)
        }

        const update = () => {
          const y = window.scrollY
          const whyTop = y + why.getBoundingClientRect().top
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const inviteTop = Math.min(y + invite.getBoundingClientRect().top, maxScroll)
          const base = startOpacity()
          const fadeInStart = whyTop - window.innerHeight * 0.8
          let opacity: number
          let blur: number
          if (y < fadeInStart) {
            opacity = 0
            blur = 6
          } else if (y < whyTop) {
            const p0 = (y - fadeInStart) / Math.max(whyTop - fadeInStart, 1)
            opacity = base * p0
            blur = 6
          } else if (y < inviteTop) {
            const p = (y - whyTop) / Math.max(inviteTop - whyTop, 1)
            opacity = base + (1 - base) * p
            blur = 6 * (1 - p)
          } else {
            opacity = 1
            blur = 0
          }
          img2.style.opacity = opacity.toFixed(3)
          img2.style.filter = `blur(${blur.toFixed(2)}px)`
        }

        window.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        update()
        cleanups.push(() => {
          window.removeEventListener('scroll', update)
          window.removeEventListener('resize', update)
        })
      }
    }

    // ---- 3) 첫 번째 배경 레이어 (Pain Points ~ Core Services 소실) ----
    {
      const img = document.querySelector<HTMLElement>('.page-neo .neo-bg-img')
      const pain = document.getElementById('pain')
      const services = document.getElementById('services')

      if (img && pain && services) {
        const update = () => {
          const y = window.scrollY
          const painTop = y + pain.getBoundingClientRect().top
          const painBottom = y + pain.getBoundingClientRect().bottom
          const servicesTop = y + services.getBoundingClientRect().top
          let opacity: number
          if (y < painTop) {
            opacity = 1
          } else if (y < painBottom) {
            opacity = 0.3
          } else if (y < servicesTop) {
            const p = (y - painBottom) / Math.max(servicesTop - painBottom, 1)
            opacity = 0.3 * (1 - p)
          } else {
            opacity = 0
          }
          img.style.setProperty('opacity', opacity.toFixed(3), 'important')
        }

        window.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        update()
        cleanups.push(() => {
          window.removeEventListener('scroll', update)
          window.removeEventListener('resize', update)
        })
      }
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])
}
