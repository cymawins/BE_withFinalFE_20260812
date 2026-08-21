/**
 * 조건부 className을 간단히 합치는 유틸리티.
 * (clsx/tailwind-merge 같은 별도 의존성 없이 최소 구현 — 새 컴포넌트 작성 시 자유롭게 사용)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
