import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import './CartList.css';
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import NavigationBar from "../../../components/navbar/adminnavbar";
import { addTocart, getuserCartDetails } from "../../../action/instance";
import config from '../../../lib/config'
import { FetchUserCart } from "../../../redux/features/usercart";
import { useNavigate } from "react-router-dom";
import { getAllProduct } from "../../../redux/features/AllProductsdetails";


const UserCart = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [cartItems, setCartItems] = useState([]);
    const UserCart = useSelector((state) => state.UserCarts);
    const UserDetails = useSelector((state) => state.User);

    useEffect(() => {
        fetchCartDetails();
    }, [UserDetails, UserCart]);

    const fetchCartDetails = async () => {
        try {
            if (Object.keys(UserDetails).length > 0) {
                setCartItems(UserCart?.[0].cartdetails);
            } else {
                const storedData = localStorage.getItem('UserCarts_Produts');
                if (storedData) {
                    const data = JSON.parse(storedData);

                    console.log(data, 'datadatadatadata')
                    if (Array.isArray(data) && data.length > 0) {
                        const { result, status } = await getuserCartDetails(data);

                        const resultdata = [];
                        if (status) {
                            result.result.map((val) => (
                                resultdata.push({ productdetails: [val], OrderQuantity: val.OrderQuantity })
                            ))

                            console.log(resultdata, 'resultresult1111111111111')
                            setCartItems(resultdata);
                        }
                    } else {
                        setCartItems([]);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching cart details:', error);
        }
    };

    console.log(cartItems, 'cartItems')

    const handleIncrement = async (id) => {

        console.log(id, 'handleIncrement')
        if (Object.keys(UserDetails).length == 0) {
            const UsercartItems = JSON.parse(localStorage.getItem('UserCarts_Produts'))
            const updatedCart = UsercartItems.map(item =>
                item._id === id ? { ...item, addedQuantity: item.addedQuantity + 1 } : item
            );

            console.log(updatedCart, 'updatedCart_____22222222')
            updateLocalStorage(updatedCart);


            fetchCartDetails()
        } else {
            const payload = {
                Productid: id,
                type: 0,
                addedQuantity: 1,
            };
            const { result, status } = await addTocart(payload);
            console.log(result, status, 'result, status');
            if (!status) {
                console.error('Failed to add product to cart');
            }

            dispatch(FetchUserCart())
            dispatch(getAllProduct())

        }


    };

    const handleDecrement = async (id) => {
        if (Object.keys(UserDetails).length == 0) {
            const UsercartItems = JSON.parse(localStorage.getItem('UserCarts_Produts'))
            const updatedCart = UsercartItems.map(item =>
                item._id === id ? { ...item, addedQuantity: item.addedQuantity - 1 } : item
            );

            console.log(updatedCart, 'updatedCart_____22222222')
            updateLocalStorage(updatedCart);


            fetchCartDetails()
        } else {
            const payload = {
                Productid: id,
                type: 1,
                addedQuantity: 1,
            };
            const { result, status } = await addTocart(payload);
            console.log(result, status, 'result, status');
            if (!status) {
                console.error('Failed to add product to cart');
            }

            dispatch(FetchUserCart())
            dispatch(getAllProduct())

        }

    };

    const handleRemove = async (id) => {
        if (Object.keys(UserDetails).length == 0) {

            const UsercartItems = JSON.parse(localStorage.getItem('UserCarts_Produts'))
            const updatedCart = UsercartItems.filter(item => item._id !== id);

            updateLocalStorage(updatedCart);

            fetchCartDetails()
        } else {
            const payload = {
                Productid: id,
                type: 2,
                addedQuantity: 1,
            };
            const { result, status } = await addTocart(payload);
            console.log(result, status, 'result, status');
            if (!status) {
                console.error('Failed to add product to cart');
            }

            dispatch(FetchUserCart())
            dispatch(getAllProduct())
        }

    };

    const updateLocalStorage = (items) => {
        localStorage.setItem('UserCarts_Produts', JSON.stringify(items));
    };

    const handleOrder = async (id, type) => {
        navigate(`/CheckoutPage/${id}/${type}`);
    };

    const loginRequest = async () => {
        alert('please login to checkout')
    }


    return (
        <div>
            <NavigationBar />


           


            <Container>
                <Row>
                
                    <div className="cart-list-container">

                    {
                Object.keys(UserDetails).length == 0 ?
                    <Button variant="primary" className="mt-2 " onClick={loginRequest}>
                        Order All
                    </Button> :
                    <Button variant="primary" onClick={() => handleOrder('all', 1)} className="mt-4">
                        Order All
                    </Button>
            }
                        <h2>Your Cart</h2>
                        <Row>

                       
                            {cartItems?.length > 0 ? (
                                cartItems.map(item => (
                                    <Col md={4} key={item._id} className="mb-4">
                                        <Card className="cart-card" style={{ width: '18rem' }}>
                                            <Card.Img variant="top" src={`${config.apiurl}/product/${item.productdetails[0]?.productImage}`} alt={item.productdetails[0]?.productName} />
                                            <Card.Body>
                                                <Card.Title>{item.productdetails[0]?.productName}</Card.Title>
                                                <Card.Text>
                                                    <p><strong>Price:</strong> ${item.productdetails[0]?.DiscountPrice}</p>
                                                    <p><strong>Quantity:</strong> {item.OrderQuantity}</p>
                                                </Card.Text>
                                                <div className="quantity-controls">
                                                    <Button variant="secondary" onClick={() => handleDecrement(item.productdetails[0]?._id)}>-</Button>
                                                    <span className="mx-2">{item.OrderQuantity}</span>
                                                    <Button variant="secondary" onClick={() => handleIncrement(item.productdetails[0]?._id)}>+</Button>

                                                </div>

                                                <Button variant="danger" className="mt-2 w-100" onClick={() => handleRemove(item.productdetails[0]?._id)}>
                                                    Remove
                                                </Button>

                                                {
                                                    Object.keys(UserDetails).length == 0 ?
                                                        <Button variant="primary" className="mt-2 w-100" onClick={loginRequest}>
                                                            Order
                                                        </Button> :
                                                        <Button variant="primary" className="mt-2 w-100" onClick={() => handleOrder(item._id, 0)}>
                                                            Order
                                                        </Button>
                                                }

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <p>Your cart is empty.</p>
                                </Col>
                            )}
                        </Row>

                    </div>
                </Row>
            </Container>
        </div>
    )
}

export default UserCart