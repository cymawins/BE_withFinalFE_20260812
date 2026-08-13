import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'
import pool from './config/db.js'

// 백엔드 서버의 시작점. 요청 대기인 app.listen을 실행
// app.js에서 만든 서버 설정을 실제로 "실행"시키는 역할만 담당

// __dirname은 ESM 방식에서 기본 제공되지 않으므로, 직접 정의함. (db.js와 동일한 이유)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// .env 파일을 읽어옴
// db.js도 자체적으로 .env를 읽어오지만, PORT 값은 db.js가 아니라 여기서 쓰이므로
// index.js에서도 별도로 한 번 더 읽어와야 함
dotenv.config({ path: path.resolve(__dirname, '.env') })

// .env에 PORT 값이 없을 경우를 대비해 기본값 4000으로 설정
const PORT = process.env.PORT || 4000

// 서버를 PORT 번호로 실행. 이 시점부터 실제로 요청을 받을 준비가 됨
// ***주의: 이건 서버가 켜졌다는 뜻일 뿐, DB 연결 여부와는 무관
app.listen(PORT, ()=>{
    console.log(`서버가 작동 중입니다. 작동중인 서버 : http://localhost:${PORT}`)
})

// ** 연결 확인용 임시코드, 백엔드 완성 시 지워야 함. **
// pool(DB 커넥션 풀)이 실제로 DB와 통신 가능한지 확인하는 테스트 쿼리
// SELECT 1은 아무 테이블도 조회하지 않고 그냥 "1"이라는 값만 반환, DB 연결 자체만 확인
try {
    const [rows] = await pool.query('SELECT 1')
    console.log('MySQL DB pool 연결 성공, 1이 출력되면 성공 : ', rows)
} catch (error) {
    console.error('에러 발생, 타입 : ', error)
}