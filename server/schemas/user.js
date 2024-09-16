
import mongoose from "mongoose";
import JWT from 'jsonwebtoken'
import config from '../config/index.js'

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    pwd:{
        type:String,
        required:true
    },
    type:{
        type:Number,   // 0 - admin , 1- user , 3 : superadmin
        default:1
    },
    status:{
        type:Number,     // 0 - active , 1 - diactive
        default:0    
    }
},{
    timestamps:true
})

userSchema.methods.generateJWT = function(payload){

    
    const token = JWT.sign(payload,config.SECRETKEY)

    return `Bearer ${token}`
}

let Usermodal = mongoose.model('Users', userSchema ,'Users' )

export default Usermodal
