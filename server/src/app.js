import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"

const app = express();
app.use(cors({
    origin:"http://localhost:3100",
    credentials: true
}))
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({limit: "16kb", extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

//routing starts here 

app.get("/", (req,res)=>{
    res.send("it's working fine ");
})

app.use("/api/v1/user" , userRouter);

//app is exported
export {app}