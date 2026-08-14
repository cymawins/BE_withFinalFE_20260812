import express from 'express'
import {
  listHelpPosts,
  getHelpPost,
  createHelpPostHandler,
  updateHelpPostHandler,
  deleteHelpPostHandler,
} from '../controllers/helpPostController.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createSchema, updateSchema } from '../validators/helpPostValidator.js'

const router = express.Router()

router.get('/', listHelpPosts)
router.get('/:id', getHelpPost)
router.post('/', validateRequest(createSchema), createHelpPostHandler)
router.put('/:id', validateRequest(updateSchema), updateHelpPostHandler)
router.delete('/:id', deleteHelpPostHandler)

export default router
