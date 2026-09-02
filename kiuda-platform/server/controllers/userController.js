import { findUserById } from "../models/userModel.js";

// userModel.js에서 정의한 함수로, 유저의 정보를 표시해주는 함수를 정의하는 과정임

export const getMyInfo = async (req, res, next) => {
    try {
        const userId = req.user.userId
        // req.user 객체의 userId 숫자값을 꺼내어, 다시 userId라는 새로운 변수로 담음

        const getUser = await findUserById(userId)
        // DB 조회가 끝날 때까지 기다렸다가, 결과값을 받은 뒤에 다음 줄로 넘어가도록 await 사용
        // await가 없으면 조회 완료 전에 다음 코드가 실행되어,
        // getUser에 '결과값' 대신 '처리중' 상태만 담기게 됨

        if (!getUser) return res.status(401).json({message:'유저가 존재하지 않습니다.'})
        // getUser가 false일 경우, 유저 정보가 없다는 것이므로 에러 반환
    
        return res.status(200).json({
            userId: getUser.user_id,
            email: getUser.email,
            name: getUser.name,
            province: getUser.province,
            district: getUser.district,
            message: '유저 조회 성공'
        })
        // 유저정보를 userId, email, name으로 반환
        // (이때 검색은 DB에서 하므로, userID가 아닌 user_id로 검색된 값)
    } catch (err) {
        next(err)
    }
    // 이때 예기치 못한 에러가 발생할 수 있으므로, try/catch로 묶었음
}