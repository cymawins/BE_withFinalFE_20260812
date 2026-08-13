import pool from '../config/db.js'

export async function findUserByEmail(email) {
    const [rows] = await pool.query(
        'SELECT * FROM User WHERE email = ?', 
        [email]
        // SQL 쿼리를 실행, ?인자를 사용하여 SQL INJECTION 방지
    )
    return rows[0]
    // 일치하는 유저가 있다면 1번째 행을 반환, 없다면 undefined를 반환
    // 어짜피 unique 속성이라, 1개밖에 없다.
}