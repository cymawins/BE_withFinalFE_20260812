import type { CSSProperties } from 'react'

interface ImageSlotProps {
  placeholder: string
  shape?: 'rect' | 'circle'
  style?: CSSProperties
}

/**
 * 원본 screens/image-slot.js(디자인 툴 전용 드래그앤드롭 이미지 플레이스홀더)를
 * 대체하는 컴포넌트. 실제 업로드 UI가 연결되기 전까지 라벨이 있는 플레이스홀더
 * 박스를 보여준다 (README 안내: "프로덕션에서는 실제 업로드 UI로 대체").
 */
export function ImageSlot({ placeholder, shape = 'rect', style }: ImageSlotProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, oklch(0.94 0.03 140), oklch(0.9 0.04 140))',
        color: 'oklch(0.45 0.09 150)',
        fontSize: 13,
        fontWeight: 700,
        borderRadius: shape === 'circle' ? '50%' : 0,
        textAlign: 'center',
        padding: 8,
        ...style,
      }}
    >
      {placeholder}
    </div>
  )
}
