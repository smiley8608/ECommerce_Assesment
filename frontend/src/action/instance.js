import instance from "./axios"


const responceData= (type , data)=>{
    
    if(type=='success'){
        return {
          status:true,
          result:data.data
        }
    }else{
        return {
            status:false,
            result:data.response.data
          } 
    }
}


export const registerUser=async(data)=>{
    try {
        const respdata= await instance({
            method:'post',
            url:'/api/register',
            data:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}



export const loginuser=async(data)=>{
    try {
        const respdata= await instance({
            method:'post',
            url:'/api/login',
            data:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}

export const FetchUser = async()=>{
    try {
        const respdata= await instance({
            method:'get',
            url:'/api/userdetails',
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}

export const getSingleProduct = async(data)=>{
    try {
        const respdata= await instance({
            method:'get',
            url:'/api/AddProducts',
            params:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}



export const crateProduct = async(data)=>{
    try {

        const formdData= new FormData()

        if(data.id){
            formdData.append('id' , data.id)
        }
        formdData.append('productName' , data.productName)
        formdData.append('description' , data.description)
        formdData.append('productImage' , data.productImage)
        formdData.append('OriginalPrice' , data.OriginalPrice)
        formdData.append('DiscountPrice' , data.DiscountPrice)
        formdData.append('Quantity' , data.Quantity)
        formdData.append('UOM' , data.UOM)
        formdData.append('HSNCode' , data.HSNCode)
        formdData.append('id' , data.id)

        const respdata= await instance({
            method:'post',
            url:'/api/AddProducts',
            data:formdData
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}


export const getallProducts=async()=>{
    try {
        const respdata= await instance({
            method:'get',
            url:'/api/getallProducts',
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}


export const getProducts=async()=>{
    try {
        const respdata= await instance({
            method:'get',
            url:'/api/getProducts',
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}






export const addTocart=async(data)=>{
    try {
        const respdata= await instance({
            method:'post',
            url:'/api/addTocart',
            data:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}



export const getUserCart=async()=>{
    try {
        const respdata= await instance({
            method:'get',
            url:'/api/getUserCart',
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}



export const getuserCartDetails =async(data)=>{
    try {
        const respdata= await instance({
            method:'post',
            url:'/api/getuserCartDetails',
            data:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}

export const FetchCheckOutDetails=async(data)=>{
    try {
        const respdata= await instance({
            method:'post',
            url:'/api/FetchCheckOutDetails',
            data:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    }
}

export const SubmitOrder =async(data)=>{
    try {
        const respdata= await instance({
            method:'post',
            url:'/api/SubmitOrder',
            data:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    } 
}



export const UserOrderList =async(data)=>{
    try {

       
        const respdata= await instance({
            method:'get',
            url:'/api/UserOrderList',
            params:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    } 
}




export const AlluserList =async(data)=>{
    try {

       
        const respdata= await instance({
            method:'get',
            url:'/api/getAllUserList',
            params:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    } 
}



export const UserCart =async(data)=>{
    try {

       
        const respdata= await instance({
            method:'get',
            url:'/api/getSingleUser_cartdetails',
            params:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    } 
}



export const FetchUserOrderList =async(data)=>{
    try {

       
        const respdata= await instance({
            method:'get',
            url:'/api/getSingleUser_Orderdetails',
            params:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    } 
}



export const FetchAdminAllProducts =async(data)=>{
    try {
        const respdata= await instance({
            method:'get',
            url:'/api/FetchAdminAllProducts',
            params:data
        })
        
       return responceData('success', respdata)
    } catch (error) {
        
       return responceData('error',error)
    } 
}





