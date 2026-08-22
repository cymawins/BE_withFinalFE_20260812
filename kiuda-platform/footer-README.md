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
cp -r kiuda-platform/src/* ./src/
```

## 포함된 변경 사항

- `app-shell` flex 레이아웃으로 푸터 하단 고정 (sticky footer)
- 리치(Rich) 푸터로 전면 개편 + `/about`, `/guide`, `/faq`, `/terms`, `/privacy`,
  `/notices`, `/notices/:id` 라우트 및 페이지 추가
- 푸터 로고 크기 강제 CSS(`footer-logo-force.css`)를 `neo.css` 맨 끝에 병합
  (`LandingFooter.tsx`의 실제 적용값 `logoHeight: 140`과 일치하는 버전만 반영,
  기존에 있던 280px짜리 구버전 CSS는 현재 값과 불일치하여 제외)

## 푸터 두께 조정

리치 푸터 전체 두께(높이)를 기존 대비 2/3 수준으로 축소했습니다 (실측 283px → 187px, 약 66%).
이후 로고만 100px로 다시 키웠습니다 (실측 푸터 높이 약 208px).

- 로고 높이: 140px → 78px → **100px** (`neo.css`의 강제 CSS + `LandingFooter.tsx`의 `logoHeight` 동시 반영)
- 상하 패딩: `36px … 28px` → `19px … 15px` (유지)
- 로고/태그라인/링크 항목 간 여백(margin-bottom)도 비례 축소 (유지)
- 모바일(600px 이하) 로고 높이: 100px → 60px (유지)

로고를 더 키우거나 줄이고 싶으면 `LandingFooter.tsx`의 `logoHeight` 값과
`neo.css` 맨 아래 `.neo-footer-rich .neo-footer-logo img { height: ... }` 값을
**항상 같이** 맞춰주세요 (CSS가 `!important`라 인라인보다 우선 적용됩니다).

## 주의

`App.tsx`, `Landing.tsx`, `neo.css`에 이미 별도로 손댄 내용이 있다면 단순 덮어쓰기 대신
diff 비교 후 선택적으로 병합하시길 권장합니다.
