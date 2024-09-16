

import { userCartmodal, Usermodal } from "../models/index.js";
import { comparePassword, hashPassword } from "../userlibrary/defaultFunctions.js";
import config from '../config/index.js'

export const userRegister = async (req, res) => {
    try {
        const { username, email, password, confirmpassword, type } = req.body
        let error = {}
        if (await Usermodal.exists({ username: username })) {
            error.username = 'Username Already exists'
        }
        if (await Usermodal.exists({ email: email }) || await config.DEFAULTADMIN_EMAIL == email) {
            error.email = 'Email Already exists'
        }
        if (Object.keys(error).length == 0) {
            const hash = await hashPassword(password)
            
            if (hash) {
                const datasav = new Usermodal({
                    username: username,
                    email: email,
                    pwd: hash,
                })
                const payload = {
                    id: datasav._id.toString()
                }
                const token = await new Usermodal().generateJWT(payload)
                
                datasav.save()
                return res.status(200).json({ message: 'User registered Successfully', token: token })
            } else {
                res.status(400).json({ message: 'Error on generating password' })
            }
        } else {
            return res.status(400).json({ error })
        }
    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password, LocalCart } = req.body


        


        let error = {}


        if (!await Usermodal.exists({ email: email }) && await config.DEFAULTADMIN_EMAIL != email) {
            error.email = 'Email Not exists'
        }

        if (await Usermodal.exists({ email: email, status: 1 })) {
            return res.status(400).json({ message: 'User Blocked by admin ' })
        }

        if (Object.keys(error).length == 0) {

            let userDetails
            userDetails = await Usermodal.findOne({ email: email }).lean()


            if (!userDetails) {
                userDetails = {
                    _id: config.DEFAULTADMIN_ID,
                    pwd: config.DEFAULTADMIN_PWD
                }
            }

            

            let hash = await comparePassword(password, userDetails.pwd)

            
            if (hash) {
                const payload = {
                    id: userDetails._id
                }
                const token = await new Usermodal().generateJWT(payload)

                if (LocalCart) {
                    const data = JSON.parse(LocalCart)

                    for (let val of data) {

                        if (await userCartmodal.exists({ productId: val._id, userId: userDetails._id ,status:0 })) {
                            let updatedata
                           
                                updatedata = await userCartmodal.findOneAndUpdate({ productId: val._id, userId: userDetails._id,status:0 }, {
                                    $inc: { OrderQuantity: val.addedQuantity }
                                })
                        } else {
                            const datasav = new userCartmodal({
                                productId: val._id,
                                userId: userDetails._id,
                                OrderQuantity: val.addedQuantity
                            })
                            datasav.save()
                        }
                    }
                }
                
                return res.status(200).json({ message: 'User registered Successfully', token: token })
            } else {
                res.status(400).json({ error:{password: 'Invalid Password'} })
            }
        } else {
            return res.status(400).json({ error })
        }
    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}


export const FetchUserDetails = async (req, res) => {

    try {
        
        const { _id, isSuperAdmin } = req.user
        let userData
        if (!isSuperAdmin) {

            userData = await Usermodal.findById({ _id: _id }).lean()
        } else {
            userData = {
                _id: config.DEFAULTADMIN_ID,
                email: config.DEFAULTADMIN_EMAIL,
                type: 0
            }
        }
        return res.status(200).json({ result: userData })

    } catch (error) {
        return res.status(400).json({ message: 'Error On Server' })
    }

}


export const Deleteuser = async (req, res) => {
    try {
        const { id } = req.body
        if (await Usermodal.exists({ _id: id, status: 1 })) {
            return res.status(400).json({ message: 'User deleted by admin' })
        }
        const updatedata = await Usermodal.findOneAndUpdate({ _id: id }, { status: 1 })
        if (updatedata) {
            return res.status(200).json({ message: 'User Deleted' })
        }
    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}

