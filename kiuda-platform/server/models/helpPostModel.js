import pool from '../config/db.js'

export async function createHelpPost({ user_id, type, title, content }) {
  const [result] = await pool.query(
    'INSERT INTO HelpPost (user_id, type, status, title, content) VALUES (?, ?, ?, ?, ?)',
    [user_id, type, 'OPEN', title, content]
  )

  const insertId = result.insertId
  const [rows] = await pool.query('SELECT * FROM HelpPost WHERE help_post_id = ?', [insertId])
  return rows[0]
}

export async function getHelpPosts({ type, status, limit = 20, offset = 0 }) {
  const where = []
  const params = []
  if (type) {
    where.push('type = ?')
    params.push(type)
  }
  if (status) {
    where.push('status = ?')
    params.push(status)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const sql = `SELECT * FROM HelpPost ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  params.push(Number(limit))
  params.push(Number(offset))

  const [rows] = await pool.query(sql, params)
  return rows
}

export async function getHelpPostById(id) {
  const [rows] = await pool.query('SELECT * FROM HelpPost WHERE help_post_id = ?', [id])
  return rows[0]
}

export async function updateHelpPost(id, fields) {
  const set = []
  const params = []
  const allowed = ['title', 'content', 'type', 'status']
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      set.push(`${key} = ?`)
      params.push(fields[key])
    }
  }
  if (set.length === 0) return await getHelpPostById(id)

  params.push(id)
  const sql = `UPDATE HelpPost SET ${set.join(', ')} WHERE help_post_id = ?`
  await pool.query(sql, params)
  return await getHelpPostById(id)
}

export async function deleteHelpPost(id) {
  const [result] = await pool.query('DELETE FROM HelpPost WHERE help_post_id = ?', [id])
  return result.affectedRows > 0
}
