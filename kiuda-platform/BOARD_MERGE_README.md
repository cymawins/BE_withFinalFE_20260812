# 키:우다 + 게시판(공지/FAQ/1:1문의) 병합 안내

## 포함된 내용

- 키:우다 플랫폼 (Footer, Landing, Auth 등)
- 공지사항 `/notices`
- FAQ `/faq`
- 1:1 문의 `/inquiry`

### 1:1 문의 정책
- 질문(문의 본문): 등록 후 **수정 불가**
- 답변: **관리자(admin)** 만 작성/수정
- 삭제: **관리자** 만 가능
- 문의 작성: 로그인한 사용자 누구나

Footer의 "1:1 문의" → `/inquiry` 로 연결됨.

## 실행 방법

```bash
cd kiuda-platform
npm install
# 게시판용 JSON Server (포트 3002)
npm run json-server
# 다른 터미널에서
npm run dev
```

필요 패키지: `axios`, `rc-pagination` (package.json에 추가됨)

## 주요 경로

```
src/pages/info/notices/   공지
src/pages/info/faq/       FAQ
src/pages/info/inquiry/   1:1 문의
src/provider/             Context Providers
src/hooks/                useNoticeContext 등
src/reducer/
src/config/constants.js   API URL (기본 http://localhost:3002)
src/db/data.json          json-server 데이터
src/styles/board.css      게시판 스타일
```

## 참고

- 게시판 데이터는 기본적으로 json-server(`src/db/data.json`)를 사용합니다.
- 실제 Express/MySQL 백엔드와 연동할 경우 `src/config/constants.js`의 URL만 맞추면 됩니다.
- `IUpdateForm`은 질문 수정용이라 라우트에 연결하지 않았습니다.
