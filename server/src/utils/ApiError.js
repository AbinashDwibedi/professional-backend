class ApiError extends Error {
    constructor(statusCode , message  = "something went wrong", errors = [] , stack = ""){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.success = false;
        this.errors = errors;
        if(stack){
            this.stack = stack;
        }
        else{
            console.log("problem caused in api error")
            Error.captureStackTrace(this, this.stack);
            
        }
    }
    

}

export {ApiError}