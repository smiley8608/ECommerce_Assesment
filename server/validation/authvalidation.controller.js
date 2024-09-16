import { isEmpty, isPasswordValid } from "../userlibrary/defaultFunctions.js"


export const RegisterValidation = async (req,res,next)=>{
    try {
        const { username , email , password , confirmpassword , type } = req.body

        let error ={}

        if(isEmpty(username)){
            error.username='Username Required'
        }
        if(isEmpty(email)){
            error.email='Email Required'
        }
        if(isEmpty(password)){
            error.password='Password Required'
        }
        if(isEmpty(confirmpassword)){
            error.confirmpassword='Confirm Password Required'
        }

        if(password != confirmpassword){
            error.confirmpassword='Confirm Password Must be same as password'
        }

        if(isPasswordValid(password)){
            error.password='Username Required'
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



export const loginValidation = async (req,res,next)=>{
    try {
        const {  email , password , type } = req.body

        let error ={}

        if(isEmpty(email)){
            error.email='Email Required'
        }
        if(isEmpty(password)){
            error.password=='Password Required'
        }

        if(isPasswordValid(password)){
            error.password='Username Required'
        }

        if(Object.keys(error).length==0){
            next()
        }else{
            return res.status(400).json({error:error})
        }
        
    } catch (error) {
        
        res.status(400).json({message:'Error on Server'})
    }
}