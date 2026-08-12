import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'



export const login = async (req, res, next) => {
    const {email, password} = req.body

    try {
        const [rows] = await pool.query('SELECT * FROM User WHERE email = ?', [email])
        const user = rows[0]

        if (!user) {
            return res.status(401).json({message: '이메일 또는 비밀번호가 잘못되었습니다.'})
        }
        if (user.is_withdrawn) {
            return res.status(401).json({message: '탈퇴한 계정입니다.'})
        }
        if (user.is_suspended) {
            return res.status(403).json({message: '일시정지된 계정입니다.'})
        }

        const isMatch = await bycrypt.compare(password, user.password_hash)

        if (!isMatch) {
        return res.status(401).json({message: '이메일 또는 비밀번호가 잘못되었습니다.'})
        }

        const token = jwt.sign(
            {userId: user.user_id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )

        return res.status(200).json({
            token,
            userId: user.user_id,
            message: '로그인 성공',
        })
    } catch (err) {
         next(err)
    }
}
