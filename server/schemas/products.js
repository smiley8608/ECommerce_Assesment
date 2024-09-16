
import mongoose from "mongoose";


const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        required:true
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
    Quantity:{
        type:Number,   
        default:0
    },
    UOM:{
        type:String,    //  Unit of Measure
        required:true
    },
    HSNCode: {
        type:String,   // Harmonized System Nomenclature
        required:true
    },
    status:{
        type:Number,     // 0 - active , 1 - diactive
        default:0    
    }
},{
    timestamps:true
})


 let productsmodal  = mongoose.model('Products', productSchema ,'Products' )

 export default productsmodal