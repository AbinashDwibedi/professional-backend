class ApiError extends Error {
    constructor(statusCode , message  = "something went wrong", errors = [] , stack = ""){
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
            Error.captureStackTrade(this, this.stack);
            
        }
    }
    

}

export {ApiError}