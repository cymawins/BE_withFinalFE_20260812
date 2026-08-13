import mysql from 'mysql2/promise' // mysql2 및 async/await 사용을 위한 import
import dotenv from 'dotenv' // .env 파일을 읽기 위함.
import path from 'path' // 파일 경로를 다루기 위함
import { fileURLToPath } from 'url' // 파일 경로를 다루기 위함

// import/export 방식은 ES6 문법이고, __dirname은 다른 문법이므로,
// __dirname을 사용하기 위해서 따로 정의해줌.
// 현재 나의 파일 위치를 알기 위해, 따로 설정해주는 것.
// 이것이 없다면 db.js가 현재 어느 위치에 있는지 읽지 못하는 큰 오류가 발생함.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// .env 파일을 읽어와서, 그 설정을 path에 그대로 이식함.
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// DB 연결 통로를 만듬
// 커넥션 풀을 여러개 설정해두어, await 작업을 수행할 동안, 다른 커넥션을 사용하여 DB에 접근할 수 있도록 함
// 어느 서버의 어느 계정으로 어느 DB에 접근할지 설정
const pool = mysql.createPool ({
    host: process.env.DB_HOST, // host 값은 DB_HOST (env에서 가져옴)
    port: Number(process.env.DB_PORT) || 3306,
    // port 값은 DB_PORT (env에서 가져옴), 만약 없으면 3306으로 설정
    user: process.env.DB_USER, // user 값은 DB_USER (env에서 가져옴)
    password: process.env.DB_PASSWORD, // password 값은 DB_PASSWORD (env에서 가져옴)
    database: process.env.DB_NAME, // database 값은 DB_NAME (env에서 가져옴)
    waitForConnections: true, // 커넥션 풀이 전부 사용 중이라면, 에러를 발생시키지 않고 대기하기
    connectionLimit: 10,
    // 커넥션 풀은 최대 10개까지 생성, 10개가 넘는다면 waitForConnections:true 이므로 대기
})

export default pool