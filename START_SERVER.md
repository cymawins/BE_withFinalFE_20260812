# 서버 실행 안내

게시판(공지/FAQ/1:1문의)은 **json-server** (포트 3002) 를 사용합니다.  
프론트는 **Vite** (포트 5173) 입니다.

## 1. 설치 (최초 1회)

```bash
cd kiuda-platform
npm install
```

## 2. API 서버 실행 (터미널 1)

```bash
npm run db
```

성공 시 대략 이렇게 보입니다:

```
Resources
http://localhost:3002/users
http://localhost:3002/notice
http://localhost:3002/faq
http://localhost:3002/inquiry
```

브라우저에서 http://localhost:3002/inquiry 를 열어 JSON이 보이면 OK.

## 3. 프론트 실행 (터미널 2)

```bash
npm run dev
```

http://localhost:5173 접속

## 자주 나는 문제

| 증상 | 해결 |
|------|------|
| `json-server` 명령 없음 | `npm install` 다시 실행 |
| `EADDRINUSE 3002` | 다른 프로그램이 3002 사용 중 → 종료 후 재실행 |
| 게시판 404 / Network Error | **터미널1 `npm run db` 가 꺼져 있음** |
| `npm run server` 실패 | Express+MySQL용. 게시판만 쓸 때는 **쓰지 마세요** (`npm run db` 사용) |

## 참고

- `npm run server` / `npm run dev:server` → 키:우다 Express 백엔드 (MySQL 필요, 포트 4000)
- 게시판 API → `npm run db` (json-server, 포트 3002)
