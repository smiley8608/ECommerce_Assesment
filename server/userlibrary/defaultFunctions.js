
import bcrypt from 'bcryptjs'

let saltRound = 12
export const isEmpty = (value) => {
  return  value==undefined ||
    value == null ||
    typeof value == 'object' && Object.keys(value).length == 0 ||
    typeof value == 'string' && value.trim()==''
}

export const isPasswordValid = value =>{

    const passwordRegex= /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    return !passwordRegex.test(value)
}

export const hashPassword =async( value) =>{
    try {
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(value, salt);
        return hash;
    } catch (error) {
        
        throw error; 
    }
}

export const comparePassword= (value , hash) =>{
   return  bcrypt.compare(value,hash)
}