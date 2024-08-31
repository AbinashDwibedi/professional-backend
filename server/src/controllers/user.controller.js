import { User } from "../models/user.model.js";
import {AsyncHandler} from "../utils/AsyncHandler.js";

export const registerUser = AsyncHandler(async(req, res)=>{
    res.status(300).json({
        message: "it's working fine"
    })
})
