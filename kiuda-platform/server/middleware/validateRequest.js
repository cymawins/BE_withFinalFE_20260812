export const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({
            message: '입력값이 잘못되었습니다.',
            errors: result.error.flatten(),
        })
    }

    req.body = result.data
    next()

}