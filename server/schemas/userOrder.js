


import mongoose from "mongoose";


const Objectid= mongoose.Types.ObjectId

const OrderSchema=new mongoose.Schema({
    productId:{
        type:Objectid,
        ref:"Products"
    },
    userId:{
        type:Objectid,
        ref:"Users"
    },
    OriginalPrice:{
        type:Number,   
        default:0
    },
    DiscountPrice:{
        type:Number,   
        default:0
    },
    SellingPrice:{
        type:Number,   
        default:0
    },
    OrderQuantity:{
        type:Number,   
        default:0
    },
    paymentMethod:{
        type:String,
        default:''
    },
    Name:{
        type:String,
        required:true
    },
    Pincode:{
        type:Number,   
        default:0
    },
    City:{
        type:String,
        required:true 
    },
    Address:{
        type:String,
        required:true
    }

},{
    timestamps:true
})


let userOrdermodal  = mongoose.model('Orders', OrderSchema ,'Orders' )

export default userOrdermodal


