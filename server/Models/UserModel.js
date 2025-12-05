import mongoose from "mongoose"



const UserSchema = mongoose.Schema({
    name: {
        type: String,
    required : true,
    },
    email : {
        type: String,
        required :true,
        unique : true, 
    },
    password : {
        type: String,
        required : true,
    },
    Profiler : {
        type: String,
        default :"user.png"
    }
    
})

const UserModel = mongoose.model("userinforms", UserSchema)
export default UserModel