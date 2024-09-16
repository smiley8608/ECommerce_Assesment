
import { isEmpty } from '../helperFun/helperFun'



export const isPasswordValid = value => {

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    return !passwordRegex.test(value)
}



export const RegisterValid = (value) => {

    const { username, email, password, confirmpassword } = value

    let error = {}

    if (isEmpty(username)) {
        error.username = 'Username Required'
    }
    if (isEmpty(email)) {
        error.email = 'Email Required'
    }
    if (isEmpty(password)) {
        error.password = 'Password Required'
    }
    if (isEmpty(confirmpassword)) {
        error.confirmpassword = 'Confirm Password Required'
    }

    if (password != confirmpassword) {
        error.confirmpassword = 'Confirm Password Must be same as password'
    }

    if (isPasswordValid(password)) {
        error.password = 'Invalid Password'
    }
    return error
}


export const LoginValid = (value) => {

    const { email, password } = value

    let error = {}

    if (isEmpty(email)) {
        error.email = 'Email Required'
    }
    if (isEmpty(password)) {
        error.password = 'Password Required'
    }
    if (isPasswordValid(password)) {
        error.password = 'Invalid Password'
    }
    return error
}

