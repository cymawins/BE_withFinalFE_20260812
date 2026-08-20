# 푸터 패치 (계층 구조 정리판)

기존 footer 패치를 `src/pages/info/`, `src/pages/info/notices/` 계층으로 재정리했습니다.
원본과 겹치는 파일(Landing.tsx, App.tsx, LandingFooter.tsx, SubPageLayout.tsx,
data/footer.ts, data/notices.ts, styles/neo.css)은 기존 경로를 그대로 유지합니다.

## 적용 경로

```
src/App.tsx                                  (덮어쓰기)
src/pages/Landing.tsx                        (덮어쓰기)
src/components/layout/LandingFooter.tsx      (덮어쓰기)
src/components/layout/SubPageLayout.tsx      (덮어쓰기)
src/data/footer.ts                           (덮어쓰기)
src/data/notices.ts                          (덮어쓰기)
src/styles/neo.css                           (덮어쓰기)

src/pages/info/About.tsx                     (신규)
src/pages/info/Guide.tsx                     (신규)
src/pages/info/Faq.tsx                       (신규)
src/pages/info/Terms.tsx                     (신규)
src/pages/info/Privacy.tsx                   (신규)
src/pages/info/notices/Notices.tsx           (신규)
src/pages/info/notices/NoticeDetail.tsx      (신규)
```

## 적용

```bash
cp -r src/* ./src/
```

## 포함된 변경 사항

- `app-shell` flex 레이아웃으로 푸터 하단 고정 (sticky footer)
- 리치(Rich) 푸터로 전면 개편 + `/about`, `/guide`, `/faq`, `/terms`, `/privacy`,
  `/notices`, `/notices/:id` 라우트 및 페이지 추가
- 푸터 데이터·로고 크기를 `data/footer.ts` 의 `footerConfig` 로 단일화
- 로고 높이는 CSS 변수 `--footer-logo-height` 로 전달 (값 이중 관리 제거)

## 리뷰 피드백 반영 (PR#3 후속)

1. **data 단일 소스**  
   `LandingFooter.tsx` 내부 로컬 `FOOTER` 중복을 제거하고 `footerConfig` 를 import 해서 사용합니다.  
   문구/컬럼/로고 높이 변경은 `src/data/footer.ts` 만 수정하면 됩니다.

2. **로고 크기 단일 값**  
   `footerConfig.logoHeight` → 컴포넌트가 `--footer-logo-height` 설정 → `neo.css` 가
   `height: var(--footer-logo-height)` 로 참조합니다.  
   하드코딩된 `100px !important` 와 인라인 높이 이중 관리는 제거했습니다.

3. **`!important` 제거 (클래스 분리)**  
   리치 푸터는 `neo-footer` 를 쓰지 않고 `neo-footer-rich` 만 사용합니다.  
   레거시 `.page-neo .neo-footer { … !important }` 선택자에 걸리지 않으므로
   리치 푸터 블록의 선언에는 `!important` 가 없습니다.

## 로고 크기

- 데스크톱 기본: **160px** (`footerConfig.logoHeight`)
- 모바일(≤600px): **96px** (`neo.css` 미디어쿼리에서 변수 재정의)

로고를 더 키우거나 줄이려면 `src/data/footer.ts` 의 `logoHeight` 만 바꾸면 됩니다.  
모바일 비율을 바꾸려면 `neo.css` 의 `@media (max-width: 600px)` 안
`--footer-logo-height` 값을 조정하세요.

## 주의

`App.tsx`, `Landing.tsx`, `neo.css`에 이미 별도로 손댄 내용이 있다면 단순 덮어쓰기 대신
diff 비교 후 선택적으로 병합하시길 권장합니다.
