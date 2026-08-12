import express from 'express';
import {login} from '../controllers/authController.js'
import {validateRequest} from '../middleware/validateRequest.js'
import {loginSchema} from '../validators/authValidator.js'

const router = express.Router()

router.post('/login', validateRequest(loginSchema), login)

export default router