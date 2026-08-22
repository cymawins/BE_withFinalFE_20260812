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

export async function findUserById(userId) {
    const [rows] = await pool.query(
        'SELECT * FROM User WHERE user_id = ?',
        [userId]
    )
    return rows[0]
}
// 같은 방식으로, userId로 유저를 찾는 함수를 정의함.
// userID의 필드명은 user_id이므로, SQL DB에서 실행할 때는 user_id로 찾아야 한다.
// 나머지 반환 및 기타 항목들은 전부 동일하다.