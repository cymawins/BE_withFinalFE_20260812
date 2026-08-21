import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getMyInfo } from '../controllers/userController.js'

// 유저 조회 관련 라우트. 이미 발급받은 토큰을 검증하는 쪽임.
// 그 전의 로그인/회원가입 관련사항은 authRoutes에서 다룸.

const router = express.Router() // 라우트들을 모아두는 작은 라우터 객체 정의

router.get('/me', requireAuth, getMyInfo)
// 마지막으로 라우터에 연결하는 작업
// auth.js의 requireAuth 함수로 '현재 로그인된 사람이 맞는지' 검증
// userModel.js의 findUserById를 이용하여,
// userController.js의 getMyInfo로 정보 얻어옴

export default router