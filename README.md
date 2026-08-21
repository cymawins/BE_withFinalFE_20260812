# 키:우다 (Kiuda) — Vite + React + TypeScript + Tailwind CSS

생활밀착형 농작물·식물·과수 생육 네트워킹 플랫폼 "키:우다"의 프론트엔드 SPA입니다.
디자인 핸드오프(`design_handoff_kiuda_platform`, dc-runtime 기반 정적 프로토타입)를
동일한 시각/상호작용 품질을 유지하면서 Vite + React 18 + TypeScript + Tailwind CSS
스택으로 마이그레이션했습니다.

## 실행 방법

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # 프로덕션 빌드 (dist/)
npm run preview    # 빌드 결과 로컬 미리보기
npm run lint        # ESLint 검사
```

## 디렉토리 구조

```
kiuda-platform/
├── public/                    # 정적 파일 (favicon 등)
├── src/
│   ├── assets/                 # 이미지 리소스 (원본 assets/ 이전)
│   ├── components/
│   │   ├── ui/                  # 범용 UI 컴포넌트 (AuthActionLink, AuthGatedLink, ImageSlot)
│   │   ├── layout/               # 레이아웃 컴포넌트 (헤더/푸터/배경 레이어)
│   │   └── sections/             # 랜딩페이지 섹션 컴포넌트
│   ├── pages/                   # 라우트 단위 화면 (10개 페이지)
│   ├── data/                    # 목업/정적 데이터 (하드코딩 금지, 전부 이 폴더로 분리)
│   ├── hooks/                    # 커스텀 훅 (스크롤 리빌, anime.js 연동, localStorage 동기화)
│   ├── context/                  # AuthContext (전역 인증 상태)
│   ├── lib/                       # 범용 유틸리티
│   ├── styles/                    # 전역 CSS (원본 common.css/neo.css 등)
│   ├── App.tsx                     # React Router 라우트 정의
│   ├── main.tsx                    # 앱 엔트리 포인트
│   └── vite-env.d.ts
├── original/                   # 원본 디자인 핸드오프 원본 전체 백업 (수정 없이 보존)
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
└── README.md
```

## 라우트

| 경로 | 화면 | 원본 파일 |
|---|---|---|
| `/` | 랜딩 페이지 | `index.html` |
| `/login` | 로그인 | `screens/login.dc.html` |
| `/signup` | 회원가입 (3단계 위저드) | `screens/signup.dc.html` |
| `/dashboard` | 보다 (내 키움터 대시보드) | `screens/dashboard.dc.html` |
| `/ask` | 묻다 (AI 진단 채팅) | `screens/ask.dc.html` |
| `/connect` | 잇다 (이웃 연결) | `screens/connect.dc.html` |
| `/share` | 나누다 (기록 공유) | `screens/share.dc.html` |
| `/profile` | 프로필 | `screens/profile.dc.html` |
| `/settings/account` | 계정 설정 | `screens/settings-account.dc.html` |
| `/admin` | 관리자 대시보드 | `screens/admin.dc.html` |

## 마이그레이션 핵심 원칙

1. **시각적 동일성 최우선** — `common.css`, `neo.css`는 구조 변경 없이 그대로
   `src/styles/`로 옮기고, `src/styles/index.css`에서 원본과 동일한 순서로 로드합니다.
   Tailwind는 새 컴포넌트 작성 편의를 위해 별도 CSS 레이어(`@layer tw-base/tw-components/tw-utilities`)로
   감싸 두어, 어떤 경우에도 Tailwind의 reset이 원본 클래스 스타일을 깨지 않도록 했습니다.
2. **원본 인터랙션 로직 1:1 포팅** — `neo-anim.js`의 스크롤 리빌, 배경 블러/투명도 인터폴레이션,
   anime.js 워드-스태거 타이틀 애니메이션을 새 로직으로 다시 짜지 않고 커스텀 훅으로 그대로 옮겼습니다.
3. **원본 파일 보존** — 원본 핸드오프 전체를 `original/`에 그대로 백업해 두었으며, 삭제된 파일은 없습니다.
4. **데이터는 전부 `src/data/`로 분리** — 컴포넌트 내 하드코딩 없이 네비게이션, 서비스 목록,
   목업 레코드 등을 데이터 모듈로 분리했습니다.
5. **미사용 자산 제외** — `css/home-2026.css`, `js/home-2026.js`는 원본 `index.html`/`screens/*`
   어디에서도 참조되지 않는 죽은 코드로 확인되어 새 빌드에는 포함하지 않았습니다 (원본은 `original/`에 그대로 보존).
