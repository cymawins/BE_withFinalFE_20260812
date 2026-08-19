import {z} from 'zod'

// zod 패키지의 z 기능 사용
// '이 요청 데이터는, 이런 모양이어야 합니다.'
export const loginSchema = z.object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
})
// 이메일 형식 및 비밀번호 형식에 맞지 않으면, 괄호 안의 문자와 함께 에러를 반환


// 회원가입 시의 아이디/비밀번호 검증
// '비밀번호확인' 은 프론트엔드에서 검증완료 후, 백엔드로 요청하지 않기 때문에
// 중복검증하지 않는다.
// (대문자 금지)소문자, 숫자, 특수문자를 포함한 8자리이상의 검증 정규식 포함
// '이용약관에 동의했는지' (Talend 등의 외부 방식으로 접근시 동의하지 않았음.)
export const signupSchema = z.object ({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .regex(/^[^A-Z]+$/, '대문자를 사용할 수 없습니다.')
    .regex(/[a-z]/, '소문자를 포함해야 합니다.')
    .regex(/[0-9]/, '숫자를 포함해야 합니다.')
    .regex(/[^A-Za-z0-9]/, '특수문자를 포함해야 합니다.'),
    name: z.string().min(1, '이름을 입력해주세요.'),
    termsAgreed: z.literal(true, { message: '이용약관에 동의해야 합니다.' }),
})
