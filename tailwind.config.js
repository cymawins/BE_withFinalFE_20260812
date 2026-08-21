/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 랜딩(뉴모피즘) 팔레트 — css/neo.css의 CSS 변수와 1:1 매칭
        neo: {
          bg: '#eef3ea',
          bg2: '#e4ebe0',
          text: '#2c3a28',
          muted: '#5c6b55',
          green: '#6f9b5a',
          'green-dark': '#4f7a3e',
          'green-soft': '#d5e6c8',
          brand: '#6f9b5a',
          leaf: '#7cb342',
          soil: '#8b7355',
          light: '#f7faf4',
        },
        // 앱 화면(oklch) 팔레트
        app: {
          bg: 'oklch(0.985 0.008 95)',
          text: 'oklch(0.24 0.02 145)',
          muted: 'oklch(0.5 0.02 145)',
          'muted-2': 'oklch(0.55 0.02 145)',
          green: 'oklch(0.56 0.09 152)',
          'green-label': 'oklch(0.5 0.1 152)',
          'green-soft': 'oklch(0.68 0.1 140)',
          warn: 'oklch(0.6 0.14 55)',
        },
      },
      fontFamily: {
        pretendard: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Noto Sans KR',
          'sans-serif',
        ],
      },
      borderRadius: {
        neo: '28px',
        'neo-sm': '18px',
      },
    },
  },
  plugins: [],
}
