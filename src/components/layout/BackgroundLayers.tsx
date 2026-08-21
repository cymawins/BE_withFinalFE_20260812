import heroBg from '@/assets/hero-bg-source.jpg'

/**
 * 원본 index.html의 두 겹 고정 배경 사진 레이어.
 * (neo-bg-wrap / neo-bg-wrap2 — useLandingBackgroundEffects 훅이 스크롤에 따라
 * opacity/blur를 인라인 스타일로 갱신한다)
 */
export function BackgroundLayers() {
  return (
    <>
      <div className="neo-bg-wrap" aria-hidden="true">
        <img src={heroBg} alt="" className="neo-bg-img" />
        <div className="neo-bg-fade" />
      </div>
      <div className="neo-bg-wrap2" aria-hidden="true">
        <img src={heroBg} alt="" className="neo-bg-img2" />
      </div>
    </>
  )
}
