import express from 'express';
import {login, signup} from '../controllers/authController.js'
import {validateRequest} from '../middleware/validateRequest.js'
import {loginSchema, signupSchema} from '../validators/authValidator.js'

// 인증(로그인/회원가입) 관련 라우트. /login을 검증, 토큰을 발급하는 쪽임.
// 로그인된 유저의 정보조회는 userRoutes에서 다룸. 토큰을 검증해서 데이터를 주는 쪽.

const router = express.Router() // 라우트들을 모아두는 작은 라우터 객체 정의

// 마지막으로 라우트에 연결함.
// 그 전에, 마지막으로 한번 더 검사
// validateRequest는 middleware의 validateRequest에 있으며, 오류 검증용 함수
// loginSchema는 validators의 authValidator에 있으며, 검사중 오류 발생시 에러메세지 반환

router.post('/login', validateRequest(loginSchema), login)
// HTTP method가 POST일 때만 반응 (로그인 : 데이터 제출)
// *첫 항목 : POST로 /api/auth/login에 요청이 오면,
// *중간 항목 : 오류 검증 방법을 이용하여 오류를 검증하고(현재는 validateRequest(loginSchema)),
// *마지막 항목 : 통과시 최종 로그인

router.post('/signup', validateRequest(signupSchema), signup)
// 로그인과 동일하게 POST일 때 반응(데이터 제출)
// Body에 email, password, name 의 key값과 value값을 입력
// signupSchema로 오류검증 후 결과값 도출 (201, 400, 409)

export default router
