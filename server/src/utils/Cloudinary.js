import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: 'dhqp5laqc', 
    api_key: '233535473398846', 
    api_secret: 'ydDHFzCBNr9dQsW0abTEs1Au-sE'
})
const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath){
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type : "auto"
        })
        fs.unlinkSync(localFilePath);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null
    }

}
export {uploadOnCloudinary}
