import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
<<<<<<< Updated upstream
import inquiryRoutes from './routes/inquiryRoutes.js'
=======
// import inquiryRoutes from './routes/inquiryRoutes.js' // [2026-09-02] 비활성화 (아래 마운트 주석 참고)
>>>>>>> Stashed changes
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

const app = express() // 빈 서버 생성, 이후 자료를 채워넣을 것임.
// 이후 app. 으로 시작한다면, 서버에 내용물을 채워넣는 것과 같음.

app.use(cors()) // 프론트엔드에서 온 자료들을 허용합니다
app.use(express.json()) // json언어로 해석합니다

// 아래는 등록된 routes 목록입니다.
app.use('/api/auth',authRoutes) // 로그인, 토큰 발급
app.use('/api/users', userRoutes) // 토큰 검증, 내 정보 조회
app.use('/api/admin', adminRoutes) // 관리자 권한 확인
<<<<<<< Updated upstream
app.use('/api/inquiries', inquiryRoutes); // 문의하기
=======
// [2026-09-02] 1:1 문의 API 비활성화
// 사유: 확정 스키마(v7 confirmed v2)에 Inquiry 테이블이 없어 호출 시 무조건 500이 났고,
//       문의 주체를 '비회원'으로 정의하면서 프론트(localStorage) 전용으로 전환했다.
//       routes/inquiryRoutes.js, controllers/inquiryController.js, models/inquiryModel.js는
//       삭제하지 않고 보존한다. 추후 Inquiry 테이블을 추가하면 이 두 줄만 되살리면 된다.
// app.use('/api/inquiries', inquiryRoutes); // 문의하기
>>>>>>> Stashed changes

app.use(errorHandler)
// 중간에 next(err) 함수를 호출 시, 에러내용과 함께 실행
// middleware의 errorHandler.js 파일에 있으며, '500 (에러내용)' 반환

export default app
