class APIError extends Error {
    constructor(
        message,
        statusCode,
        data,
        errors,
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = data
        this.errors = errors
        this.stack = stack

        this.success = false
        this.data = null
        this.errors = errors


        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { APIError }