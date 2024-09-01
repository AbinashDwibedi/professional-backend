import { User } from "../models/user.model.js";
import {AsyncHandler} from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessRefreshtokens = async(userID)=>{
    try{
       const user = await User.findOne({userID});
       const accessToken = await user.generateAccessToken()
       const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave : false})
        return {accessToken, refreshToken}
    }
    catch(err){
        throw new ApiError(500, "something went wrong while while generating access and refresh token");
    }
}
const registerUser = AsyncHandler(async(req, res)=>{
    const {username , fullname , email ,password} = req.body;
    if([username, fullname ,email , password].some((field) => field?.trim()=="")){
        throw new ApiError(400, "All field's are required");
    }
    let userExists  = await User.findOne({
        $or : [
            { username },
            { email }
        ]
    })

    if(userExists){
        throw new ApiError (409  , "user already exists");
    }

    let avatarLocalpath = req.files?.avatar[0]?.path;
    let coverImageLocalpath;
    if( req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalpath = req.files.coverImage[0].path
    }
    if(!avatarLocalpath){
        throw new ApiError (400, "avatar file is required");
    }
    let coverImage = await uploadOnCloudinary(coverImageLocalpath);

    let avatar = await uploadOnCloudinary(avatarLocalpath);

    if(!avatar){
        throw new ApiError(400, "avatar file is required");
    }

    const user = await User.create({
        fullname,
        email,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        password,
        username
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while resistering the user");
    }
    return res.status(201).json(
        new ApiResponse (200, createdUser , "user registered successfully")
    )

})


const loginUser = AsyncHandler(async (req,res)=>{
    const {username , email, password}  = req.body;
    console.log(req.body);
    if(!(username || email)){
        throw new ApiError(400, "username or email is required");
    }
    const user = await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const passwordCheck = await user.isPasswordCorrect(password);
    if(!passwordCheck){
        throw new ApiError(401, "invalid user credintials")
    }

    const {accessToken , refreshToken} = await generateAccessRefreshtokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly : true,
        secure : true,
    }

    return res.status(200).cookie("accessToken", accessToken , options).cookie("refreshToken", refreshToken , options).json(new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken , refreshToken
        }
        ,
        "User loggedin successfully"
    ))
})

const logoutUser = AsyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
        secure : true,
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options);

})

export {
    registerUser,
    loginUser,
    logoutUser,
}