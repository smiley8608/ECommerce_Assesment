
import mongoose from "mongoose";

const Objectid= mongoose.Schema.Types.ObjectId

const CartSchema=new mongoose.Schema({
    productId:{
        type:Objectid,
        ref:"Products"
    },
    userId:{
        type:Objectid,
        ref:"Users"
    },
    OrderQuantity:{
        type:Number,   
        default:0
    },
    status:{
        type:Number,  // 0 - added , 1 - ordered
        default:0
        }
},{
    timestamps:true
})


let userCartmodal= mongoose.model('UserCarts', CartSchema ,'UserCarts' )

export default userCartmodal



