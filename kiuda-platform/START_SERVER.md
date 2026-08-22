# 서버 실행 안내

게시판(공지/FAQ/1:1문의)은 **json-server** (포트 3002) 를 사용합니다.  
프론트는 **Vite** (포트 5173) 입니다.

## 1. 설치 (최초 1회)

```powershell
cd kiuda-platform
npm install
```

설치가 끝날 때까지 기다린 후 다음 단계로 진행하세요.

## 2. 한 번에 실행 (권장)

```powershell
npm run dev
```

- json-server (포트 3002) + Vite (포트 5173) 가 **동시에** 실행됩니다.
- 브라우저에서 http://localhost:5173 접속

> ⚠️ PowerShell에서 `json-server` 를 **직접** 치지 마세요.  
> 반드시 `npm run db` 또는 `npm run dev` 를 사용하세요.

## 3. 개별 실행 (필요 시)

```powershell
# 터미널 1 - API만
npm run db

# 터미널 2 - 프론트만
npm run dev:front
```

## Windows 오류 해결

### `'json-server' 용어가 인식되지 않습니다`

직접 `json-server` 명령을 실행해서 생긴 오류입니다.

```powershell
# ❌ 잘못된 방법
json-server --watch ./src/db/data.json --port 3002

# ✅ 올바른 방법
npm run db
# 또는
npm run dev
```

그래도 안 되면:

```powershell
rmdir /s /q node_modules
npm install
npm run dev
```

### `Unknown browser query basedir=$(dirname...`

```powershell
del browserslist
del browserslist.cmd
rmdir /s /q node_modules
npm install
npm run dev
```

### `EADDRINUSE` (포트 이미 사용 중)

다른 터미널에서 이미 서버가 켜져 있을 수 있습니다. 해당 창을 닫거나:

```powershell
netstat -ano | findstr :3002
netstat -ano | findstr :5173
```

## 참고

- `npm run server` → Express+MySQL 백엔드 (게시판만 쓸 때는 사용하지 마세요)
- 게시판 API → `npm run db` (json-server, 포트 3002)
- JSX → TSX 변환 완료, TypeScript Strict Mode 적용됨
