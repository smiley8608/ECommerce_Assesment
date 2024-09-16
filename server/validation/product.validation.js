import { isEmpty } from "../userlibrary/defaultFunctions.js"






export const productValidation = async (req,res,next)=>{
    try {
        const { productName,description,OriginalPrice,DiscountPrice,Quantity,UOM,HSNCode  } = req.body

        let error ={}

        if(isEmpty(productName)){
            error.productName='ProductName Required'
        }
        if(isEmpty(description)){
            error.description='Description Required'
        }

        if(isEmpty(OriginalPrice)){
            error.OriginalPrice='OriginalPrice Required'
        }
        if(isEmpty(DiscountPrice)){
            error.DiscountPrice='DiscountPrice Required'
        }
        if(isEmpty(Quantity)){
            error.Quantity='Quantity Required'
        }if(isEmpty(UOM)){
            error.UOM=='UOM Required'
        }
        if(isEmpty(HSNCode)){
            error.HSNCode='HSNCode Required'
        }

        if(Object.keys(error).length==0){
            next()
        }else{
            return res.status(400).json({error:error})
        }
        
    } catch (error) {
        console.log(error , 'errr')
        res.status(400).json({message:'Error on Server'})
    }
}