import React, { useEffect, useState } from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductCard.css';
import { useDispatch, useSelector } from 'react-redux';
import { addTocart } from '../../action/instance';
import { toastAlert } from '../../components/toastcontainer';
import config from '../../lib/config'
import { getAllProduct } from '../../redux/features/AllProductsdetails';
import { FetchUserCart } from '../../redux/features/usercart';

const ProductCard = ({ product }) => {

    const userDeatils = useSelector((state) => state.User)

    console.log(product, 'product')
    const {
        productName,
        description,
        productImage,
        OriginalPrice,
        DiscountPrice,
        Quantity,
        UOM,
        HSNCode,
        _id,
        Addtocart,
        addQuantity
    } = product;

    useEffect(()=>{
        setIsAddedToCart(Addtocart)
        setaddedQuantity(addQuantity)
    },[product])

    const [addedQuantity, setaddedQuantity] = useState();

    const dispatch = useDispatch()
    const [isExpanded, setIsExpanded] = useState(false);

    const [isAddedToCart, setIsAddedToCart] = useState();


    const handleIncrement = async() => {
        if (addedQuantity < Quantity) {
            if (Object.keys(userDeatils).length === 0) {
                const storedCart = JSON.parse(localStorage.getItem('UserCarts_Produts'));
               const indexvalue= storedCart.findIndex(val=>val._id==_id)
               storedCart[indexvalue].addedQuantity +=1

               localStorage.setItem('UserCarts_Produts', JSON.stringify(storedCart));
            }else{
                const payload = {
                    Productid: product._id,
                    type: 0, 
                    addedQuantity: 1,
                };
                const { result, status } = await addTocart(payload);
                console.log(result, status, 'result, status');
                if (!status) {
                    console.error('Failed to add product to cart');
                }
                dispatch(getAllProduct())
                dispatch(FetchUserCart())
                setIsAddedToCart(true)

            }
            setaddedQuantity(addedQuantity + 1);
        }
    };

    const handleDecrement = async() => {
        if (addedQuantity > 1) {

            if (Object.keys(userDeatils).length === 0) {
                const storedCart = JSON.parse(localStorage.getItem('UserCarts_Produts'));
               const indexvalue= storedCart.findIndex(val=>val._id==_id)
               storedCart[indexvalue].addedQuantity -=1

               localStorage.setItem('UserCarts_Produts', JSON.stringify(storedCart));
            }else{
                const payload = {
                    Productid: product._id,
                    type: 1, 
                    addedQuantity: 1,
                };
                const { result, status } = await addTocart(payload);
                console.log(result, status, 'result, status');
                if (!status) {
                    console.error('Failed to add product to cart');
                }
                dispatch(getAllProduct())
                dispatch(FetchUserCart())
                setIsAddedToCart(true)
            }
            setaddedQuantity(addedQuantity - 1);
        }
    };

    const handleAddToCart = async () => {
        try {
            console.log('Adding to cart:', { ...product, addedQuantity });
            if (Object.keys(userDeatils).length === 0) {
                const storedCart = localStorage.getItem('UserCarts_Produts');
                let cartProducts = storedCart ? JSON.parse(storedCart) : [];
                const payload = {
                    _id: product._id,
                    addedQuantity: 1,
                };
                cartProducts.push(payload);

                console.log(cartProducts,'cartProductscartProducts')
                localStorage.setItem('UserCarts_Produts', JSON.stringify(cartProducts));
                setIsAddedToCart(true)
            } else {
                const payload = {
                    Productid: product._id,
                    type: 0, 
                    addedQuantity: 1,
                };
                const { result, status } = await addTocart(payload);
                console.log(result, status, 'result, status');
                if (!status) {
                    console.error('Failed to add product to cart');
                }
                dispatch(getAllProduct())
                dispatch(FetchUserCart())
                setIsAddedToCart(true)
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };


    console.log(Addtocart , 'addTocart' , isAddedToCart)

    return (
        <Col md={4} className="mb-4"> 
            <Card className="product-card" style={{ width: '20rem' }}> 
                <Card.Img variant="top" src={`${config.apiurl}/product/${productImage}`} alt={productName} className="product-image" />
                <Card.Body>
                    <Card.Title>{productName}</Card.Title>
                    <div className={`description ${isExpanded ? 'expanded' : 'collapsed'}`}>
                        <Card.Text>{description}</Card.Text>
                    </div>
                    <Button
                        variant="link"
                        className="read-more"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </Button>
                    <div className="product-details mt-3">
                        <div className="detail-row">
                            <p><strong>Original Price:</strong> ${OriginalPrice}</p>
                            <p><strong>Discount Price:</strong> ${DiscountPrice}</p>
                        </div>
                        <div className="detail-row">
                            <p><strong>Quantity:</strong> {Quantity} {UOM}</p>
                            <p><strong>HSN Code:</strong> {HSNCode}</p>
                        </div>
                    </div>
                    {
                        isAddedToCart ? <div className="quantity-controls mt-3">
                            <Button variant="secondary" onClick={handleDecrement}>-</Button>
                            <span className="mx-2">{addedQuantity}</span>
                            <Button variant="secondary"  onClick={handleIncrement}>+</Button>
                        </div> :
                            <Button variant="primary" className="mt-3" onClick={handleAddToCart}>
                                Add to Cart
                            </Button>
                    }
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ProductCard;
