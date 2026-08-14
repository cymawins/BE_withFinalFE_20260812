import { z } from 'zod'

export const createSchema = z.object({
  user_id: z.number().int().positive(),
  type: z.enum(['OFFER', 'REQUEST']),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(500),
})

export const updateSchema = z.object({
  type: z.enum(['OFFER', 'REQUEST']).optional(),
  status: z.enum(['OPEN', 'COMPLETED', 'CANCELLED']).optional(),
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(500).optional(),
})
