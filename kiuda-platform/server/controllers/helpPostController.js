import {
  createHelpPost,
  getHelpPosts,
  getHelpPostById,
  updateHelpPost,
  deleteHelpPost,
} from '../models/helpPostModel.js'

export const listHelpPosts = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)
    const items = await getHelpPosts({ type, status, limit: Number(limit), offset })
    return res.status(200).json({ items })
  } catch (err) {
    next(err)
  }
}

export const getHelpPost = async (req, res, next) => {
  try {
    const { id } = req.params
    const post = await getHelpPostById(id)
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' })
    return res.status(200).json(post)
  } catch (err) {
    next(err)
  }
}

export const createHelpPostHandler = async (req, res, next) => {
  try {
    const { user_id, type, title, content } = req.body
    const created = await createHelpPost({ user_id, type, title, content })
    return res.status(201).json(created)
  } catch (err) {
    next(err)
  }
}

export const updateHelpPostHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const fields = req.body
    const updated = await updateHelpPost(id, fields)
    if (!updated) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' })
    return res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
}

export const deleteHelpPostHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const ok = await deleteHelpPost(id)
    if (!ok) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' })
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}
