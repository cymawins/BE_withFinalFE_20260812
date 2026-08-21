import { useEffect } from 'react'

/**
 * 원본 js/neo-anim.js의 "Scroll reveal" 로직을 그대로 이식.
 * `.neo-reveal` 요소가 뷰포트에 12% 이상 들어오면 `in` 클래스를 추가해 페이드인시킨다.
 * (threshold/rootMargin 값까지 원본과 동일하게 유지)
 */
export function useScrollReveal(deps: React.DependencyList = []) {
  useEffect(() => {
    const reveals = document.querySelectorAll('.neo-reveal')

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    )

    reveals.forEach((el) => io.observe(el))

    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
