import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  create,
  getMyList,
  getOne,
  reply,
} from '../controllers/inquiryController.js';

const router = express.Router();

// 문의 등록 (로그인 필요)
router.post('/', requireAuth, create);

// 내 문의 목록 (로그인 필요)
router.get('/', requireAuth, getMyList);

// 문의 상세 (로그인 필요 + 본인/관리자 체크는 컨트롤러에서)
router.get('/:id', requireAuth, getOne);

// 관리자 답변 등록 (로그인 + 관리자 권한 필요)
router.patch('/:id', requireAuth, requireAdmin, reply);

export default router;