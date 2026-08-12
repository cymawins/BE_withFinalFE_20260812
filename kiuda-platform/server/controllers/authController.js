export const login = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({message: '이메일과 비밀번호를 입력하세요'})
    }

    // 여기서 DB 조회/비밀번호 검증을 넣으면 됨
    if (email === 'test@example.com' && password === '1234') {
        return res.status(200).json({
            token: 'demo-jwt-token',
            userId:'user-001',
            message: '로그인 성공',
        })
    }

    return res.status(401).json({message: '이메일 또는 비밀번호가 잘못되었습니다'})

}