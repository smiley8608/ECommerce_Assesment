

import express from 'express'

//validation
import * as AuthValid from './validation/authvalidation.controller.js'

import * as productvalid from './validation/product.validation.js'
import * as UserCtrl from './controller/user.controller.js'

import * as AdminCtrl from './controller/admin.controller.js'

import * as productCtrl from './controller/userproduct.controller.js'

import multer from 'multer'

import passport from 'passport'
import path from 'path'


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/product");
    },
    filename: (req, file, cb) => {
        var randon = Math.floor(Math.random() * 9999);
        let filename =
            "product" + randon + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
})
  
  const upload = multer({ storage: storage })

const router=express()

let AuthPassport= passport.authenticate('userAuth', { session: false })

router.route('/register').post(AuthValid.RegisterValidation,UserCtrl.userRegister)

router.route('/login').post(AuthValid.loginValidation,UserCtrl.userLogin)

router.route('/userdetails').get(AuthPassport,UserCtrl.FetchUserDetails)


router.route('/Deleteuser').post(UserCtrl.Deleteuser)


router.route('/AddProducts')
.post(productvalid.productValidation,upload.single("productImage"), AdminCtrl.AddProducts)
.put(productvalid.productValidation,AdminCtrl.EditProducts)
.get(AdminCtrl.getSingleproduct)
.delete(AdminCtrl.DeleteProducts)


router.route('/FetchAdminAllProducts').get( AdminCtrl.FetchAdminAllProducts)



router.route('/getallProducts').get(AuthPassport, productCtrl.getAllProductsList)

router.route('/getProducts').get( productCtrl.getAllProducts)

router.route('/getUserCart').get(AuthPassport, productCtrl.getUserCart)

router.route('/getuserCartDetails').post( productCtrl.getuserCartDetails)

router.route('/addTocart').post(AuthPassport, productCtrl.AddtoCart)


router.route('/FetchCheckOutDetails').post(AuthPassport, productCtrl.fetchCheckOutDetails)

router.route('/SubmitOrder').post(AuthPassport, productCtrl.SubmitOrder)

router.route('/UserOrderList').get(AuthPassport, productCtrl.getUserOrders)


router.route('/getAllUserList').get( AdminCtrl.getAllUserList)



router.route('/getSingleUser_cartdetails').get(AdminCtrl.getSingleUser_cartdetails)

router.route('/getSingleUser_Orderdetails').get(AdminCtrl.getSingleUser_Orderdetails)

export default router 
