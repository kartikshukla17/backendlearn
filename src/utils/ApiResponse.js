class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

//server status codes must be less than 400 lines(khud k liye standard set kiya)! : https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
export {ApiResponse}
