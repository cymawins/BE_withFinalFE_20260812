import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import {errorHandler} from './middleware/errorHandler.js'

// 백엔드 서버의 기본 환경설정을 모아둔 곳입니다.
// cors : 프론트엔드 허용
// json 해석 설정 (express.json())
// routes들을 등록

// 백엔드 호출시 : index > app 
// > routes (라우트 진입)
// > middleware (JWT토큰 검증) *로그인 및 회원가입 시에는, JWT토큰 자체가 없으므로 거치지 않음.
// > validators (유효성 검증)
// > controllers(요청 해석 후, 어떤 함수를 정할지 결정 후 호출)
// > models(repositories) (DB를 조회하여 SQL 쿼리 실행 후 결과를 반환)
// > controllers (결과를 JSON형태로 가공)
// > middleware (최종에러 처리)

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth',authRoutes)

app.use(errorHandler)

export default app
