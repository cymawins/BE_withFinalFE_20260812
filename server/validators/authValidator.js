import {z} from 'zod'

// zod 패키지의 z 기능 사용
// '이 요청 데이터는, 이런 모양이어야 합니다.'
export const loginSchema = z.object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
})
// 이메일 형식 및 비밀번호 형식에 맞지 않으면, 괄호 안의 문자와 함께 에러를 반환