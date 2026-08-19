// '정해진 규칙(schema)에 맞아야 합니다.'
// validateRequest(schema) 라는 검사 전용 함수를 생성
// req는 req.body를 꺼낼 때, res는 검사 실패시, next는 검사 성공시 넘어가기 위해 인자로 받음
// req.body는 사용자가 보낸 이메일, 비밀번호 (from authController)

export const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    // 이 데이터가 정말로 정해진 규칙에 맞아? 프론트엔드에서 제대로 검사해준 거 맞아?
    // safeParse(true/false 반환)로 백엔드에서 독립적으로 검사해봐.

    if (!result.success) {
        return res.status(400).json({
            message: '입력값이 잘못되었습니다.',
            errors: result.error.flatten(),
        })
    }
    // 규칙검증에 실패하면, 입력값 오류 반환
    // authValidator에서 만든 z함수는 에러정보가 복잡하기 때문에, flatten()으로 읽기 편하게 변환

    req.body = result.data
    next()
    // zod가 검증하며 정리한 result의 data로 덮어쓰며 최종 승인 후 진행

    // 주의 : zod에 정의되지 않은 데이터를 입력 후 덮어쓸 시
    // result.data에 존재하지 않은 데이터이기 때문에,
    // 필드 참조 시 undefined 상태가 되어, 500 error 발생위험 있음. (26/8/19 에러 확인)
    // 이 부분은 추후 수정이 필요한 사항으로 보임.
}
