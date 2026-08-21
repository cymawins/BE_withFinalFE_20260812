import { useEffect } from 'react'
import anime from 'animejs'

/**
 * 원본 js/neo-anim.js의 "Seedling-grow hero message" 애니메이션을 그대로 이식.
 * 히어로 타이틀(#grow-title)을 단어 단위 span으로 쪼개고, anime.js로
 * 새싹이 돋아나듯 순차 등장시킨다.
 */
export function useSeedlingGrow(titleId: string) {
  useEffect(() => {
    const title = document.getElementById(titleId)
    if (!title) return

    // 멱등성 가드: React.StrictMode(dev)는 effect를 mount→cleanup→mount로
    // 두 번 실행한다. 첫 실행에서 이미 title의 innerHTML을 <span class="word">
    // 마크업으로 바꿔놓았기 때문에, 두 번째 실행에서 "현재" innerHTML을 다시
    // 읽어 쪼개면 실제 마크업 문자열이 텍스트로 쪼개지는 버그가 생긴다.
    // 최초 1회의 원본 텍스트를 data attribute에 캐싱해 항상 그 원본에서만
    // 다시 빌드하도록 한다.
    let sourceHTML = title.dataset.growSource
    if (sourceHTML === undefined) {
      sourceHTML = title.innerHTML
      title.dataset.growSource = sourceHTML
    }

    // 줄바꿈(<br>)을 유지하며 단어 단위 span으로 분해
    const lineTexts = sourceHTML.split(/<br\s*\/?>/i)
    title.innerHTML = ''
    lineTexts.forEach((lineText, li) => {
      lineText
        .trim()
        .split(/\s+/)
        .forEach((w) => {
          if (!w) return
          const span = document.createElement('span')
          span.className = 'word'
          span.textContent = w
          title.appendChild(span)
          title.appendChild(document.createTextNode(' '))
        })
      if (li < lineTexts.length - 1) title.appendChild(document.createElement('br'))
    })

    const runGrow = () => {
      anime.remove(`#${titleId} .word`)

      anime({
        targets: `#${titleId} .word`,
        opacity: [0, 1],
        translateY: [36, 0],
        scale: [0.7, 1],
        rotateZ: [-4, 0],
        delay: anime.stagger(140, { start: 200 }),
        duration: 1100,
        easing: 'easeOutElastic(1, 0.65)',
      })
    }

    runGrow()
  }, [titleId])
}
