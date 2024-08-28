import {Schema , model} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim : true,
        index: true,
        lowercase: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    fullname : {
        type:String,
        required : true,
        trim  : true
    },
    password: {
        type: String,
        required: true,
    },
    avatar :{
        required :true,
        type: String
    },
    coverImage: {
        type: String
    },
    refreshToken: {
        type : String,
    }
},{timestamps : true})

//just before saving the data into the data into the database if you want to do something than you can use pre hook of mongoose
userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password , 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id : this.id,
        email : this.email,
        username : this.username,
        fullname : this.fullname
    }),
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id : this.id
    }),
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
}

const User = model("User", userSchema);
export {User} ;