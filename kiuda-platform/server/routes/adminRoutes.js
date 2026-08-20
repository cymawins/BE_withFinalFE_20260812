import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

// 관리자 API로 접근 요구시 권한 인증절차
// 각 router에 requireAuth, requireAdmin을 순서대로 붙이면 됨

const router = express.Router()

export default router