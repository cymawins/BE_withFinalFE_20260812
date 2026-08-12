import jwt from 'jsonwebtoken'

/*
- 요청 헤더의 JWT를 검증하는 인증 미들웨어.
- 통과하면 req.user에 토큰 payload를 담아 다음 핸들러로 넘긴다.
(아직 이 미들웨어를 쓰는 라우트는 없음 - profile/settings/admin 등 
로그인 필요한 화면의 API를 만들 때 여기서 export한 requireAuth를 
가져다 쓰면 됨
 */

export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({message:'인증이 필요합니다.'})
    }

    try {
        const token = header.split('')[1]
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (err) {
        return res.status(401).json({message:'토큰이 유효하지 않습니다.'})
    }

}