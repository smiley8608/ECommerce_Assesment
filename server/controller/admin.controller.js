

import { productsmodal, userCartmodal, Usermodal, userOrdermodal } from "../models/index.js";
import mongoose from "mongoose";
import { isEmpty } from "../userlibrary/defaultFunctions.js";


export const AddProducts = async (req, res) => {
    try {
        const { productName, description, OriginalPrice, DiscountPrice, Quantity, UOM, HSNCode,productImage ,id} = req.body

        
        
        let error = {}
        if (id == "undefined" && await productsmodal.exists({ productName: productName })  ) {
            error.productName = 'productName Already exists'
        }

        
        if (Object.keys(error).length == 0) {
            const SellingPrice = OriginalPrice - (OriginalPrice * DiscountPrice / 100)
            if(id != "undefined"){
              let updateProduct =  await productsmodal.findOneAndUpdate({_id:id},{
                    productName: productName,
                    description: description,
                    OriginalPrice: OriginalPrice,
                    DiscountPrice: DiscountPrice,
                    Quantity: Quantity,
                    UOM: UOM,
                    HSNCode: HSNCode,
                    SellingPrice: SellingPrice,
                    productImage: req?.file?.filename ?req?.file?.filename:productImage
                })
                return res.status(200).json({ message: 'Product Updated' })
            }else{
                const productsav = new productsmodal({
                    productName: productName,
                    description: description,
                    OriginalPrice: OriginalPrice,
                    DiscountPrice: DiscountPrice,
                    Quantity: Quantity,
                    UOM: UOM,
                    HSNCode: HSNCode,
                    SellingPrice: SellingPrice,
                    productImage: req?.file?.filename ?req?.file?.filename:productImage
                })
                productsav.save()
                return res.status(200).json({ message: 'Product Created' })
            }
           
           

           
        } else {
            return res.status(400).json({ error })
        }

    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}

export const getSingleproduct = async (req, res) => {
    try {
        const { productid } = req.query

        const productdetails = await productsmodal.findOne({ _id: productid, status: 0 })
        return res.status(200).json({ productdetails: productdetails })
    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}

export const EditProducts = async (req, res) => {
    try {
        const { id, productName, description, OriginalPrice, DiscountPrice, Quantity, UOM, HSNCode } = req.body
        
        const { name } = req.file
        let error = {}

        if (await productsmodal.exists({ _id: id, status: 1 })) {
            return res.status(400).json({ message: 'Producted deleted by admin' })
        }

        if (!await productsmodal.exists({ _id: id, productName: productName })) {
            if (await productsmodal.exists({ productName: productName })) {
                error.productName = 'Already exists'
            }
        }
        if (Object.keys(error).length == 0) {
            const SellingPrice = OriginalPrice - (OriginalPrice * DiscountPrice / 100)

            const updatedata = await productsmodal.findOneAndUpdate({ _id: id }, {
                productName: productName,
                description: description,
                OriginalPrice: OriginalPrice,
                DiscountPrice: DiscountPrice,
                Quantity: Quantity,
                UOM: UOM,
                HSNCode: HSNCode,
                SellingPrice: SellingPrice,
                productImage: name
            })
            if (updatedata) {
                return res.status(200).json({ message: 'Product Edited' })
            }
        } else {
            return res.status(400).json({ error })
        }

    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}


export const DeleteProducts = async (req, res) => {
    try {
        const { id } = req.body
        if (await productsmodal.exists({ _id: id, status: 1 })) {
            return res.status(400).json({ message: 'Producted deleted by admin' })
        }
        const updatedata = await productsmodal.findOneAndUpdate({ _id: id }, { status: 1 })
        if (updatedata) {
            return res.status(200).json({ message: 'Product Deleted' })
        }
    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}



export const getAllUserList = async (req, res) => {
    try {
        
        const { page , limit  } = req.query;

        
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

       
        const skip = (pageNumber - 1) * pageSize;
        const limitValue = pageSize;

       
        const users = await Usermodal.find({ status: 0 })
            .skip(skip)
            .limit(limitValue);

       
        const totalCount = await Usermodal.countDocuments({ status: 0 });

        
        return res.status(200).json({
            result: users,
            total: totalCount,
            page: pageNumber,
            limit: limitValue
        });

    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' });
    }
};


export const getSingleUser_cartdetails = async (req, res) => {
    try {
        const { id, page , limit } = req.query;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;
        const limitValue = pageSize;
        const Userdetails = await Usermodal.findOne({ _id: id, status: 0 });

        if (Userdetails) {
            
            const user_cartdetals = await userCartmodal.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(id),
                        status: 0
                    }
                },
                {
                    $lookup: {
                        from: 'Products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productdetails'
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limitValue
                }
            ]);

            
            const totalCount = await userCartmodal.countDocuments({
                userId: new mongoose.Types.ObjectId(id),
                status: 0
            });

            
            return res.status(200).json({
                result: user_cartdetals,
                total: totalCount,
                page: pageNumber,
                limit: limitValue
            });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' });
    }
};



export const getSingleUser_Orderdetails = async (req, res) => {
    try {
        const { id, page , limit  } = req.query;

      
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

     
        const skip = (pageNumber - 1) * pageSize;
        const limitValue = pageSize;

       
        const Userdetails = await Usermodal.findOne({ _id: id, status: 0 });

        if (Userdetails) {
            
            const userOrders = await userOrdermodal.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'Products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productdetails'
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limitValue
                }
            ]);

            
            const totalCount = await userOrdermodal.countDocuments({
                userId: new mongoose.Types.ObjectId(id),
            });

            
            return res.status(200).json({
                result: userOrders,
                total: totalCount,
                page: pageNumber,
                limit: limitValue
            });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' });
    }
};


export const FetchAdminAllProducts = async (req, res) => {
    try {
        
        const { page , limit  } = req.query;

        
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

       
        const skip = (pageNumber - 1) * pageSize;
        const limitValue = pageSize;

       
        const products = await productsmodal.find({ status: 0 })
            .skip(skip)
            .limit(limitValue);

        const totalCount = await productsmodal.countDocuments({ status: 0 });        
        return res.status(200).json({
            result: products,
            total: totalCount,
            page: pageNumber,
            limit: limitValue
        });

    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' });
    }
}
