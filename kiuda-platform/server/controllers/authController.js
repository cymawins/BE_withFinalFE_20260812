import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { findUserByEmail, createUser } from '../models/userModel.js'
import { findAdminByEmail } from '../models/adminModel.js'

// bcrypt : 암호화된 비밀번호값과, 사용자가 로그인 시 입력한 비밀번호를 서로 비교하기 위한 라이브러리
// jwt : '이 사람은 인증된 사람입니다.' 라는 것을 증명하는 토큰 발급을 위한 라이브러리
// findUserByEmail : userModel.js에서 만든 함수, 이메일로 유저를 조회하는 함수
// 중괄호가 있는 이유는, export default가 아닌, export const로 내보냈기 때문
// default는 하나만 내보낼 수 있지만, const는 여러 개를 내보낼 수 있음.
// 다만, import 시에 중괄호를 사용하여 '이 함수를 가져오겠다' 라고 명시해야 함.


// 로그인 요청을 처리하는 함수 정의 (login)
    // req, res, next를 매개변수로 받음
    // req : 클라이언트가 보낸 요청 정보 (request)
    // res : 서버가 클라이언트에게 보낼 응답 정보 (response)
    // next : 에러 발생 시, 에러 처리를 위한 파일(middleware)로 넘겨주는 역할
    // async : DB 조회 및 bcrypt 비교작업 등 시간이 오래 걸리는 작업을 하기 때문에,
    // await로 작업이 끝날 때 까지 기다리며 순서대로 처리하기 위해 정의함.
export const login = async (req, res, next) => {

    const {email, password} = req.body // 사용자가 보낸 정보들을 req.body에 저장

    try {
        const user = await findUserByEmail(email) // 해당 이메일의 유저정보 호출
        if (!user) {
            // 관리자인지 검사. 보안을 위해 '관리자가 아닙니다' 등의 메시지 표현하지 않음
            // 관리자는 token 자체가 다름.
            const admin = await findAdminByEmail(email)
            if (admin) {
                const adminMatch = await bcrypt.compare(password, admin.password_hash)
                if(adminMatch){
                    const token = jwt.sign(
                    {adminId: admin.admin_id},
                    process.env.JWT_SECRET,
                    {expiresIn: '7d'}
                    )
                    return res.status(200).json({
                    token,
                    adminId: admin.admin_id,
                    message: '관리자입니다.',
                    })
                }
            }
            return res.status(401).json({message: '이메일 또는 비밀번호가 잘못되었습니다.'})
        } // 이메일로 가입한 유저 정보가 없음. 입력 오류 혹은 회원가입 미실시
        if (user.is_withdrawn) {
            return res.status(401).json({message: '탈퇴한 계정입니다.'})
        } // (탈퇴했으므로) 401 인증권한없음
        if (user.is_suspended) {
            return res.status(403).json({message: '일시정지된 계정입니다.'})
        } // (관리자 권한으로 정지) 403 권한없음

        const isMatch = await bcrypt.compare(password, user.password_hash)
        // bcrypt로 암호화된 값과 입력된 값 일치 여부 판단
        if (!isMatch) {
            return res.status(401).json({message: '이메일 또는 비밀번호가 잘못되었습니다.'})
        } // 비밀번호 불일치

        // 여기까지 왔다면, 이메일과 비밀번호도 맞고, 이용권한도 있는 유저임. 인증토큰 발급.
        const token = jwt.sign(
            {userId: user.user_id}, // 토큰검증시 무슨 유저의 토큰인지 확인용
            process.env.JWT_SECRET, // 토큰위조 방지용 서명 키 (나중에 검증시에 이 키를 사용)
            {expiresIn: '7d'} // 유효기간은 7일
        )

        // 현재까지 에러가 없다면, JWT토큰과 함께 '로그인 성공' 반환
        return res.status(200).json({
            token,
            userId: user.user_id,
            message: '로그인 성공',
        })
    } catch (err) {
         next(err)
    }
    // 혹시 갑자기 DB연결이 끊기는 등의 예기치 못한 에러 발생시,
    // 에러처리를 middleware로 넘김 (errorHandler, 함수위치 : app.js)
}


// 회원가입을 처리하는 함수 (findUserByEmail, createUser는 userModel에서 정의했음)
// 아이디 및 비밀번호 형식은 authValidator의 signupSchema에서 이미 처리 완료
export const signup = async (req, res, next) => {
    try{
        const {email, password, name} = req.body // 사용자가 보낸 정보 저장
        const existing = await findUserByEmail(email) // email이 현재 존재하는지 검증
        if (existing) { // 존재할 경우(true) 'error 409 : 요청처리불가'
            return res.status(409).json({message: '이미 가입된 이메일입니다.'})
        }
        const password_hash = await bcrypt.hash(password, 10) // 그동안 검증해왔으므로 진행
        const result = await createUser({ // userModel에서 정의한 user 및 result 호출
            email,
            password_hash,
            name,
            login_type:'EMAIL'
        })
        return res.status(201).json({
            message : '회원가입이 완료되었습니다.'
        })
        // '201 요청 성공'
        // 회원가입 즉시 로그인 기능 추가시, userId:result.insertId 추가
    } catch(err) {
        next(err) // 예기치 못한 에러 발생시 errorHandler로 보내어, '500 error' 처리
    }
}
