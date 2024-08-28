import {config} from "dotenv"
import { mongoConnect } from "./src/db/db.js";
import { app } from "./src/app.js";
config();

mongoConnect().then(()=> {
    app.listen(process.env.PORT , ()=> {
        console.log(`server is listening on port :3000 || http://localhost:${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log("mongodb connecton failed : " , err);
})