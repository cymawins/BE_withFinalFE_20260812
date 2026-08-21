import pool from '../config/db.js'

// (MySQL은 대소문자를 가리지 않았으나, Linux기반 서버는 대소문자를 가리기 때문에 확실한 필드값 부여)
export async function findUserByEmail(email) {
    const [rows] = await pool.query(
        'SELECT * FROM user WHERE email = ?', 
        [email]
        // SQL 쿼리를 실행, ?인자를 사용하여 SQL INJECTION 방지
    )
    return rows[0]
    // 일치하는 유저가 있다면 1번째 행을 반환, 없다면 undefined를 반환
    // 어짜피 unique 속성이라, 1개밖에 없다.
}

export async function findUserById(userId) {
    const [rows] = await pool.query(
        'SELECT * FROM user WHERE user_id = ?',
        [userId]
    )
    return rows[0]
}
// 같은 방식으로, userId로 유저를 찾는 함수를 정의함.
// userID의 필드명은 user_id이므로, SQL DB에서 실행할 때는 user_id로 찾아야 한다.
// 나머지 반환 및 기타 항목들은 전부 동일하다.


export async function createUser(user) {
    // user 객체에서 (email, password_hash, name, login_type) 값을 꺼내서
    // DB의 User 테이블에 행(row)을 추가(INSERT)
    // 현재는 user객체를 정의만 했고, 이후에 호출할 때 값들이 들어갈 예정(authController에서 호출)
    const [result] = await pool.query(
        'INSERT INTO user (email, password_hash, name, login_type, terms_agreed_at) VALUES (?, ?, ?, ?, NOW())',
        [user.email, user.password_hash, user.name, user.login_type]
    )
    return result
}
// '' 에 들어있는 내용은, DB에 데이터를 입력하는 형태 (SQL Query)
// result는 조회 결과가 아닌, INSERT에서 정보를 처리한(추가한) 결과를 담은 객체임
// 예를 들어, 새로 생성된 user_id를 조회할 때는, result.insertId 로 조회 가능
