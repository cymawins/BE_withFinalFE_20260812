import jwt from 'jsonwebtoken'
// 웹토큰 검증

/*
- 요청 헤더의 JWT를 검증하는 인증 미들웨어.
- 통과하면 req.user에 토큰 payload를 담아 다음 핸들러로 넘긴다.
(아직 이 미들웨어를 쓰는 라우트는 없음 - profile/settings/admin 등 
로그인 필요한 화면의 API를 만들 때 여기서 export한 requireAuth를 
가져다 쓰면 됨
 */

// requireAuth는 req, res, next의 인자를 받는다.
// 요청정보 / 응답 / 다음단계 를 의미, Express가 호출할때 넘겨주는 매개변수
export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization
    // 요청 헤더에서 인증 정보를 꺼낸다. 
    // 예시로는 Authorization: Bearer eyJhbGc... 의 형태로 저장되어 있다.

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({message:'인증이 필요합니다.'})
    }
    // header가 없는 경우, Bearer ~~로 시작하지 않는 경우, 둘중 하나라도 해당 시 
    // 인증이 유효하지 않다는 것이므로, 요청 거부 메세지와 함께 메세지를 띄운다. 
    // 성공시 try로 계속 진행

    try {
        const token = header.split(' ')[1]
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (err) {
        return res.status(401).json({message:'토큰이 유효하지 않습니다.'})
    }
    // header에서 Bearer 이후에 작성된 토큰을 꺼낸다.
    // 이때 split('')을 쓰면 모든 글자가 하나씩 쪼개지므로, 띄어쓰기 단위로 체크하기 위해
    // split(' ')을 써서, [0]인 Bearer 이후의 [1] 토큰명만 제대로 가져오게 된다.
    // 이후에 verify(검증)하여, 진짜 우리서버에서 발급한 토큰이 맞는지 확인하고, 
    // 검증에 성공하면 req.user에 userId를 반환 후 계속 진행
    // 검증에 실패 시 401 error를 반환한다.
}

// 관리자인지 검증
// req.user는 token에서 꺼내온 값이지, User테이블에서 꺼내온 값이 아니기 때문에
// Admin 테이블이 따로 있어도, req.user로 조회 가능
export const requireAdmin = (req, res, next) => {
    if (req.user.adminId){
        next()
    }
    else return res.status(403).json({message:'권한이 없습니다.'})
}
