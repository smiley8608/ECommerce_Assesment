import mongoose from "mongoose"
import { productsmodal, userCartmodal, Usermodal, userOrdermodal } from "../models/index.js"


export const getAllProductsList = async (req, res) => {
    try {

        

        if (req?.user) {
            if (req?.user.isSuperAdmin) {
                return res.status(200).json({ result: [] })
            }
            const { _id } = req?.user
            const Userdetails = await Usermodal.findOne({ _id: _id, status: 0 })

            if (Userdetails) {

                const userId = Userdetails._id;

                const Allproducts = await productsmodal.aggregate([
                    {
                        $lookup: {
                            from: 'UserCarts',
                            let: { productid: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$userId', userId] },
                                                { $eq: ['$productId', '$$productid'] },
                                                { $eq: ['$status', 0] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: 'cartDetails'
                        }
                    },
                    {
                        $addFields: {
                            Addtocart: {
                                $cond: {
                                    if: { $gt: [{ $size: '$cartDetails' }, 0] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    }
                ]);

                return res.status(200).json({ result: Allproducts })

            } else {
                return res.status(400).json({ message: 'User Deleted by admin', loginstatus: false })
            }
        } else {
            const Allproducts = await productsmodal.find({ status: 0 })
            return res.status(200).json({ result: Allproducts })
        }

    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}


export const getAllProducts = async (req, res) => {
    try {

        

    
            const Allproducts = await productsmodal.find({ status: 0 })
            return res.status(200).json({ result: Allproducts })


    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}

export const getUserCart = async (req, res) => {
    try {
        
        const { _id } = req.user
        if (req?.user.isSuperAdmin) {
            return res.status(200).json({ result: [] })
        }

        const Userdetails = await Usermodal.findOne({ _id: _id, status: 0 })
        if (Userdetails) {
            const user_cartdetals = await Usermodal.aggregate([
                {
                    $match: {
                        _id: _id,
                        status: 0
                    }
                },
                {
                    $lookup:
                    {
                        from: 'UserCarts',
                        let: { userid: '$_id' },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", '$$userid'], },
                                        { $eq: ['$status', 0] }

                                    ]

                                }
                            }
                        }, {
                            $lookup:
                            {
                                from: 'Products',
                                localField: 'productId',
                                foreignField: '_id',
                                as: 'productdetails'
                            }
                        }],
                        as: 'cartdetails'
                    }
                }
            ])
            
            return res.status(200).json({ result: user_cartdetals })
        }

    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}


export const getuserCartDetails = async (req, res) => {
    try {


        
        const reqBody = req.body
        const resdata = []
        if (Object.keys(reqBody).length > 0) {
            for (let val of reqBody) {
                let CartDetails = await productsmodal.findOne({ _id: val._id }).lean()
                CartDetails.OrderQuantity = val.addedQuantity
                resdata.push(CartDetails)
            }
        }

        return res.status(200).json({ result: resdata })
    }

    catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}


export const getUserOrders = async (req, res) => {
    try {
        const { _id } = req.user;
        const { page , limit } = req.query; 
        const skip = (page - 1) * limit;
        
        const Userdetails = await Usermodal.findOne({ _id: _id, status: 0 });

        if (Userdetails) {
            
            const user_OrderList = await Usermodal.aggregate([
                {
                    $match: {
                        _id: _id,
                        status: 0
                    }
                },
                {
                    $lookup: {
                        from: 'Orders',
                        let: { userid: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$userId", "$$userid"]
                                    }
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
                                $skip: skip,
                            },
                            {
                                $limit: parseInt(limit)
                            }
                        ],
                        as: 'OrderList'
                    }
                },
            ]);

           
            const totalCount = await Usermodal.aggregate([
                {
                    $match: {
                        _id: _id,
                        status: 0
                    }
                },
                {
                    $lookup: {
                        from: 'Orders',
                        let: { userid: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$userId", "$$userid"]
                                    }
                                }
                            }
                        ],
                        as: 'orders'
                    }
                },
                {
                    $unwind: '$orders'
                },
                {
                    $count: 'totalCount'
                }
            ]);

            const totalOrders = totalCount[0] ? totalCount[0].totalCount : 0;

            return res.status(200).json({
                result: user_OrderList,
                total: totalOrders,
                page: parseInt(page),
                limit: parseInt(limit)
            });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' });
    }
};



export const AddtoCart = async (req, res) => {
    try {
        const { _id } = req.user

        
        const { Productid, type } = req.body

        const Productdetails = await productsmodal.findOne({ _id: Productid }).lean()
        
        if (Productdetails) {
            if (await userCartmodal.exists({ productId: Productid, userId: _id ,status: 0 })) {
                let updatedata
                if (type == 0) {
                    updatedata = await userCartmodal.findOneAndUpdate({ productId: Productid, userId: _id,status: 0 }, {
                        $inc: { OrderQuantity: 1 }
                    })
                } else if (type == 1) {
                    updatedata = await userCartmodal.findOneAndUpdate({ productId: Productid, userId: _id,status: 0 }, {
                        $inc: { OrderQuantity: -1 }
                    })
                } else {
                    await userCartmodal.deleteOne({ productId: Productid, userId: _id })
                }
                return res.status(200).json({ message: `Product ${type == 0 ? 'incremented' : type == 1 ? 'Decremented' : 'Deleted'}` })

            } else {
                const datasav = new userCartmodal({
                    productId: Productid,
                    userId: _id,
                    OrderQuantity: 1
                })
                datasav.save()
                return res.status(200).json({ message: 'Product Added to cart' })
            }

        }

    } catch (error) {
        
        return res.status(400).json({ message: 'Error on Server' })
    }
}

export const fetchCheckOutDetails = async (req, res) => {
    try {
        

        const { _id } = req.user;
        const { cartid, type } = req.body;


        if (!cartid || !type) {
            return res.status(400).json({ error: 'Cart ID and type are required' });
        }


        const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


        const cartIdObjectId = isValidObjectId(cartid) ? new mongoose.Types.ObjectId(cartid) : null;
        const userIdObjectId = isValidObjectId(_id) ? new mongoose.Types.ObjectId(_id) : null;

        

        if (type == 0) {

            if (!cartIdObjectId) {
                return res.status(400).json({ error: 'Invalid cart ID format' });
            }


            const resultdata = await userCartmodal.aggregate([
                {
                    $match: {
                        _id: cartIdObjectId,
                        status:0
                    }
                },
                {
                    $lookup: {
                        from: 'Products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productdetails'
                    }
                }
            ]);

            return res.status(200).json({ result: resultdata });

        } else if (type == 1) {

            if (!userIdObjectId) {
                return res.status(400).json({ error: 'Invalid user ID format' });
            }


            const resultdata = await userCartmodal.aggregate([
                {
                    $match: {
                        userId: userIdObjectId,
                        status:0
                    }
                },
                {
                    $lookup: {
                        from: 'Products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productdetails'
                    }
                }
            ]);

            

            return res.status(200).json({ result: resultdata });

        } else {
            return res.status(400).json({ error: 'Invalid type parameter' });
        }

    } catch (error) {
        
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const SubmitOrder = async (req, res) => {
    try {
        const { _id } = req.user;
        const { name, address, city, cashOnly, pincode, id, type } = req.body;

        
        if (type == 0) {
           
            const cartDetails = await userCartmodal.findOne({ _id: id })
            if (!cartDetails) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const productDetails = await productsmodal.findOne({ _id: cartDetails.productId, status: 0 });
            if (productDetails) {
                const order = new userOrdermodal({
                    productId: productDetails._id,
                    userId: _id,
                    OriginalPrice: productDetails.OriginalPrice,
                    DiscountPrice: productDetails.DiscountPrice,
                    SellingPrice: productDetails.SellingPrice,
                    OrderQuantity: cartDetails.OrderQuantity,
                    paymentMethod: cashOnly ? 'Cash' : 'Other',
                    Name: name,
                    Pincode: pincode,
                    Address: address,
                    City: city,
                });

                await order.save();
                cartDetails.status = 1;
                await cartDetails.save();

                productDetails.Quantity -= cartDetails.OrderQuantity;
                await productDetails.save();

                return res.status(200).json({ message: 'Order created' });
            } else {
                return res.status(404).json({ message: 'Product not found' });
            }
        } else if (type == 1) {
           
            const cartDetails = await userCartmodal.find({ userId: _id , status:0 });

            
            if (cartDetails.length === 0) {
                return res.status(404).json({ message: 'No items in cart' });
            }
            for (const item of cartDetails) {
                const productDetails = await productsmodal.findOne({ _id: item.productId, status: 0 });
                if (productDetails) {
                    const order = new userOrdermodal({
                        productId: productDetails._id,
                        userId: _id,
                        OriginalPrice: productDetails.OriginalPrice,
                        DiscountPrice: productDetails.DiscountPrice,
                        SellingPrice: productDetails.SellingPrice,
                        OrderQuantity: item.OrderQuantity,
                        paymentMethod: cashOnly ? 'Cash' : 'Other',
                        Name: name,
                        Pincode: pincode,
                        Address: address,
                        City: city,
                    });

                    await order.save();
                    item.status = 1;
                    await item.save();

                    productDetails.Quantity -= item.OrderQuantity;
                    await productDetails.save();
                }
            }

            return res.status(200).json({ message: 'Orders created' });
        } else {
            return res.status(400).json({ message: 'Invalid type parameter' });
        }
    } catch (error) {
        
        return res.status(500).json({ message: 'Server error' });
    }
};



