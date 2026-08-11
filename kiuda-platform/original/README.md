# Handoff: 키:우다(Kiuda) 플랫폼 — 랜딩페이지 + 앱 화면 세트

## Overview
생활밀착형 농작물·식물·과수 생육 네트워킹 플랫폼 "키:우다"의 랜딩페이지와 로그인 이후 앱 화면 전체 세트입니다. 랜딩페이지에서 스크롤에 따라 배경 사진의 선명도가 변화하며, 로그인/회원가입 후 대시보드(보다)·AI 질의(묻다)·이웃 연결(잇다)·기록 공유(나누다)·프로필·계정 설정·관리자 화면으로 이어지는 전체 사용자 흐름을 담고 있습니다.

## About the Design Files
이 번들에 포함된 파일들은 **HTML로 제작된 디자인 레퍼런스**입니다 — 의도된 외관과 동작을 보여주는 프로토타입이며, 그대로 복사해 프로덕션에 반영할 코드가 아닙니다. 작업은 이 HTML 디자인을 대상 코드베이스의 기존 환경(React, Vue, SwiftUI, 네이티브 등)에 맞춰 그 환경의 기존 패턴과 라이브러리를 사용해 **재구현**하는 것입니다. 아직 환경이 없다면, 프로젝트에 가장 적합한 프레임워크를 선택해 그 위에 구현하십시오.

이번 대화에서 사용자는 이 화면들을 **React(웹) SPA 단일 앱 + Tailwind CSS**로 변환하고자 합니다.

## Fidelity
**High-fidelity (hifi)**: 모든 화면은 최종 색상, 타이포그래피, 간격, 인터랙션이 확정된 픽셀 단위 목업입니다. 개발자는 대상 스택(React + Tailwind)의 관례를 따르되, 이 디자인을 픽셀 단위로 동일하게 재현해야 합니다.

## Screens / Views

### 1. 랜딩페이지 (`index.html`)
- **목적**: 서비스 소개, 회원가입/로그인 유도
- **레이아웃**: 세로 스크롤 단일 페이지. `<header>` sticky 상단바(로고+내비+인증 버튼) → 히어로(전체화면, 배경사진 위 카피+CTA) → Pain Points(세로 인용구 4개) → "키:우다는" 소개(좌측 상단 큰 타이틀 + 중앙 정렬 설명) → Core Values(3원 순환 다이어그램) → Core Services(2x2 카드 그리드) → Why Kiuda(좌측 텍스트+체크리스트, 우측 사진 2장 세로 배치) → Reviews(세로 인용구 3개) → Invitation(전체화면, 로고+타이틀+CTA, 배경사진 최고 선명도) → 접이식 Footer
- **배경 사진 시스템**: `assets/hero-bg-source.jpg` 1장을 두 개의 고정 레이어(`neo-bg-wrap`/`neo-bg-wrap2`)로 겹쳐 사용. 스크롤 위치에 따라 JS가 `opacity`와 `filter: blur()`를 연속적으로 보간(hero 100% 선명 → Pain Points 구간 0.3 고정 → Core Services에서 0으로 소실 → Why Kiuda부터 다시 서서히 페이드인 + 블러 감소 → Invitation에서 blur 0 / opacity 1로 최고 선명도 도달)
- **컴포넌트**:
  - 헤더: 로고(`assets/logo.png`, height 210px) + 내비 4개(보다/묻다/잇다/나누다, 비로그인 시 클릭 무반응) + 회원가입/로그인 버튼(클릭 시 `localStorage.kiuda_auth=1` 설정 후 이동)
  - 히어로 타이틀: "함께" / "키:우다" 2줄, `font-size: clamp(2.4rem,5vw,3.6rem)`, cream색(`#f5f9ee`), 텍스트 그림자로 사진 위 가독성 확보, 배경 사진의 새싹 위 중앙 배치
  - Core Values 다이어그램: SVG 3원(성장/연결/지속), 흰색 원 배경 + 진초록(`#4f7a3e`) 텍스트, 두꺼운 진초록 점선 링으로 순환 표시
  - Footer: 기본 `max-height:0`으로 숨김, 하단 "확대" 버튼 클릭 시 `max-height`/`opacity` 트랜지션으로 슬라이드 인. 3열 균등 폭(키:우다 링크 / 고객지원 링크 / 저작권)

### 2. 로그인 (`screens/login.dc.html`) / 회원가입 (`screens/signup.dc.html`)
- 중앙 정렬 카드 레이아웃, 로고(텍스트 없이 이미지만, height 210px 상단)
- 이메일/비밀번호 입력, 제출 버튼(진초록 계열 `oklch(0.56 0.09 152)`), 하단에 반대 액션 링크

### 3. 대시보드 "보다" (`screens/dashboard.dc.html`)
- **목적**: 사용자의 키움터(재배 작물) 현황을 한눈에 파악
- **레이아웃**: sticky 헤더 → 인사말+오늘 날짜/지역+"키움이 추가" 버튼 → 4개 요약 카드 그리드(오늘의 날씨/병해충 주의보/오늘의 체크리스트) → 상태 필터 버튼 행 → 키움터 카드 그리드(사진+환경라벨+품종+애칭+물주기 상태+심은 날짜) → 상태별 상세 모달(클릭 시 통계+목록)
- **컬러**: 배경 `oklch(0.985 0.008 95)`, 텍스트 `oklch(0.24 0.02 145)`, 포인트 그린 `oklch(0.56 0.09 152)` / `oklch(0.5 0.1 152)`, 카드 배경 `oklch(1 0 0)`, 보조 텍스트 `oklch(0.5 0.02 145)` / `oklch(0.55 0.02 145)`
- **상태 관리**: 선택된 상태 필터, 모달 열림/닫힘, 상세 보기 대상 keeping in local component state

### 4. "묻다" (`screens/ask.dc.html`)
- AI 채팅형 UI: 질문 입력창 + 대화 로그, AI 답변 카드

### 5. "잇다" (`screens/connect.dc.html`)
- 이웃 피드/품앗이 게시글 목록, 팔로우, 지도 기반 근접 이웃 표시, 다이렉트 메시지 진입점

### 6. "나누다" (`screens/share.dc.html`)
- 키움 일지/성장 기록 작성 및 피드, 사진 첨부, 태그, 북마크/좋아요

### 7. 프로필 (`screens/profile.dc.html`)
- 사용자 정보, 키운 작물 목록, 팔로워/팔로잉, "계정 설정 변경" 링크 → `settings-account.dc.html`

### 8. 계정 설정 (`screens/settings-account.dc.html`)
- 공개 범위 토글(프로필/성장기록/위치 공개), 계정 삭제, 뒤로가기 버튼(`window.history.back()`)
- 다른 화면들과 동일한 배경/폰트/색상 팔레트로 통일(oklch 톤 매칭 완료)

### 9. 관리자 대시보드 (`screens/admin.dc.html`)
- 좌측 사이드 탭 내비(사용자 관리/탈퇴 관리/메시지 삭제/통계/로그) + 우측 테이블/통계 카드 패널

## Interactions & Behavior
- **인증 게이팅**: `data-auth-action` 속성이 있는 버튼(회원가입/로그인/초대 수락하기) 클릭 시 `localStorage.setItem('kiuda_auth','1')`. `data-auth-link` 속성이 있는 링크(헤더 내비, 서비스 카드)는 클릭 시 `localStorage.getItem('kiuda_auth') !== '1'`이면 `preventDefault()`로 이동 차단 — 비로그인 상태에서는 앱 화면으로 진입 불가
- **스크롤 애니메이션**: `neo-reveal` 클래스 요소는 IntersectionObserver로 뷰포트 진입 시 페이드인. 배경 사진 레이어는 스크롤 Y값 기반 실시간 opacity/blur 보간(위 배경 사진 시스템 참조)
- **Footer 토글**: 버튼 클릭 시 `max-height`/`opacity` CSS 트랜지션(0.6s ease)으로 열림/닫힘, 라벨이 "확대"/"축소"로 전환
- **관리자 탭 전환**: 사이드바 버튼 클릭 시 `.active` 클래스 토글로 패널 표시/숨김(SPA 방식 클라이언트 전환, 페이지 이동 없음)
- **네비게이션**: 모든 화면 간 이동은 `<a href>` 상대경로 링크. React SPA 전환 시 React Router 라우트로 1:1 매핑 가능

## State Management
- **랜딩페이지**: 인증 여부(localStorage), 스크롤 위치(파생값으로 배경 opacity/blur 계산), 모바일 메뉴 열림 여부
- **대시보드**: 선택된 상태 필터, 상태 상세 모달 열림 여부/대상, 체크리스트 항목 완료 여부
- **어드민**: 활성 탭
- **데이터 요구사항**: 사용자 정보, 키움터(작물) 목록, 날씨, 병해충 경보, AI 질의 로그, 이웃/팔로우, 다이렉트 메시지, 성장 기록/게시물 — 상세 테이블 구조는 첨부된 DB 스키마 참고

## Design Tokens

### 랜딩페이지 (`css/neo.css` 기준)
- 배경: `--neo-bg: #eef3ea`, `--neo-bg-2: #e4ebe0`
- 텍스트: `--neo-text: #2c3a28`, `--neo-muted`(회색 그린 계열)
- 포인트: `--neo-green`, `--neo-green-dark: #4f7a3e`, `--neo-green-soft`
- 그림자: `--neo-shadow-dark`, `--neo-shadow-light` (뉴모피즘 스타일 이중 그림자)
- 카드/버튼 radius: `--neo-radius: 28px`
- 폰트: 시스템 산세리프 스택 (프로젝트 내 지정 폰트 없으면 Pretendard 계열 권장)

### 앱 화면 (screens/*.dc.html, oklch 기준)
- 배경: `oklch(0.985 0.008 95)` (거의 흰색, 살짝 웜톤)
- 본문 텍스트: `oklch(0.24 0.02 145)`
- 보조 텍스트: `oklch(0.5 0.02 145)` / `oklch(0.55 0.02 145)` / `oklch(0.48 0.02 145)`
- 포인트 그린: `oklch(0.56 0.09 152)`(버튼/강조), `oklch(0.5 0.1 152)`(라벨), `oklch(0.68 0.1 140)`(그라데이션 보조)
- 경고/주의: `oklch(0.6 0.14 55)`
- 카드 배경: `oklch(1 0 0)`, 카드 테두리: `oklch(0.9 0.015 120)` / `oklch(0.9 0.012 130 / 0.6)`
- 폰트: Pretendard Variable (`https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/woff2/PretendardVariable.woff2`), fallback `-apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif`
- Border radius: 카드 16–28px, 버튼 999px(pill), 아이콘/체크박스 6–12px

## Assets
- `assets/logo.png` — 키:우다 로고 (헤더/앱 화면 공통, height 210px 기준)
- `assets/hero-bg-source.jpg` — 랜딩 히어로 및 스크롤 배경 사진 (업스케일 4800×3280, 선명도 보정 완료)
- `assets/hero-photo.png`, `assets/why-card.jpg` — Why Kiuda 섹션 보조 사진
- `assets/bg/*.jpg` — 기타 섹션 배경(Core Services 등)
- `screens/image-slot.js` — 이미지 드래그앤드롭 플레이스홀더 컴포넌트(사용자가 실제 사진으로 교체하는 용도, 프로덕션에서는 실제 업로드 UI로 대체)

## Screenshots
`screenshots/` 폴더에 주요 화면 캡처 포함: 랜딩페이지(01–06, 히어로부터 Invitation까지 스크롤 진행), 로그인, 대시보드(보다), 잇다, 관리자.

## Files
- `index.html` — 랜딩페이지 본체
- `css/neo.css`, `css/common.css`, `css/home-2026.css` — 랜딩페이지 스타일
- `js/neo-anim.js`, `js/common.js`, `js/home-2026.js` — 랜딩페이지 스크롤/인터랙션 로직
- `screens/login.dc.html`, `screens/signup.dc.html` — 인증 화면
- `screens/dashboard.dc.html` — 보다(대시보드)
- `screens/ask.dc.html` — 묻다
- `screens/connect.dc.html` — 잇다
- `screens/share.dc.html` — 나누다
- `screens/profile.dc.html` — 프로필
- `screens/settings-account.dc.html` — 계정 설정
- `screens/admin.dc.html` — 관리자 대시보드
- `screens/components/icon-badge.dc.html`, `screens/components/section-heading.dc.html` — 공용 컴포넌트
- `db/kiuda_db_schema_v7_confirmed_20260811.sql` — 전체 화면 기능에 대응하는 DB 스키마 (User, UserPlant, AIQueryLog, Follow, HelpPost, DirectMessage, GrowthStory, Admin, AdminActivityLog 등)

`.dc.html` 파일 내부의 `{{ }}` 표기(예: `{{ plot.nickname }}`)는 이 프로토타입 툴의 템플릿 바인딩 문법입니다 — React로 옮길 때는 JSX 표현식/props로 대체하면 됩니다. `<sc-for>`/`<sc-if>`는 각각 배열 순회(`.map()`)와 조건부 렌더링에 대응합니다.
