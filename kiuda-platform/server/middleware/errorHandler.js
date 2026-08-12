export const errorHandler = (err, req, res, next) => {
    console.error(err)

    res.status(500).json({
        message: '서버 오류가 발생했습니다.',
        error: err.message,
    })

}