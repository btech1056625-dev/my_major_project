class APIResponse {
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

        this.success = statusCode < 300
        this.data = data
        this.errors = errors


        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}