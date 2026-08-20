import pool from '../config/db.js'

// findUserByEmail과 동일한 구조
export const findAdminByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM admin WHERE email = ?',
        [email]
    )
    return rows[0]
}

export async function findAdminById(adminId) {
    const [rows] = await pool.query(
        'SELECT * FROM admin WHERE admin_id = ?',
        [adminId]
    )
    return rows[0]
}