
import Cookies from 'js-cookie'

export const setCookies=async(token)=>{
    if(token){
        Cookies.set('AUTH_TOKEN' , token)
    }
}

export const getCookies =()=>{
   const token =  Cookies.get('AUTH_TOKEN')
   return token
}


export const removecookies =()=>{
    const token =  Cookies.remove('AUTH_TOKEN')
    return true
 }