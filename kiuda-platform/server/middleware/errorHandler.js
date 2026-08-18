// next(err) 함수를 호출한다면,
// 다음 단계로 넘어가는 대신 이 파일로 넘어와서 errorHandler 함수 실행
export const errorHandler = (err, req, res, next) => {
    console.error(err) // 콘솔에도 에러 출력

    res.status(500).json({
        message: '서버 오류가 발생했습니다.',
        error: err.message,
    })
    // 500 서버오류 발생 및 error message 출력
}