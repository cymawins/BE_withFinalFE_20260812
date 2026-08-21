import { reviews } from '@/data/reviews'

/** 7. Reviews — 세로 인용구 3개 (원본 index.html #reviews) */
export function Reviews() {
  return (
    <section className="neo-section neo-section-anim neo-tint" id="reviews">
      <div className="neo-container">
        <h2 className="neo-h2 neo-reveal" style={{ color: '#4f7a3e' }}>
          키:우다 이웃들의 이야기
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 640, margin: '0 auto' }}>
          {reviews.map((review, i) => (
            <div key={review.name} className={`neo-review neo-reveal${i > 0 ? ` delay-${i}` : ''}`}>
              <div className="neo-stars">{'★'.repeat(review.stars)}</div>
              <p className="neo-review-text">{review.text}</p>
              <div className="neo-reviewer">
                <div className="neo-avatar">{review.avatarLetter}</div>
                <div>
                  <strong>{review.name}</strong>
                  <span>{review.meta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
