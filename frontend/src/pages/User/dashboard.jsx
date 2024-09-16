
import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import ProductCard from './productCard';
import { useSelector } from 'react-redux';
import NavigationBar from '../../components/navbar/adminnavbar';
import { getProducts } from '../../action/instance';



const App = () => {

    const userDeatils = useSelector((state) => state.User)

    const products = useSelector(state=>state.Products)

    console.log(products,'redux__________products')
    const [updatedProducts, setUpdatedProducts] = useState([]);


    const fetchproduct = async()=>{
        try {

            console.log('rrrrrrrrrrrrrrrrrrrr')
            const {result,status}=await getProducts()

            console.log(result,status , 'fetchproduct')
            if(status){


                let updated
                const cartItems = JSON.parse(localStorage.getItem('UserCarts_Produts')) || [];

                console.log(cartItems,'cartItems')
                if(cartItems.length>0){
                    updated = result.result.length > 0 && result.result.map(product => {
                        const cartItem = cartItems.find(item => item._id === product._id);
                        return {
                            ...product,
                            Addtocart: !!cartItem, 
                            addQuantity: cartItem ? cartItem.addedQuantity : 1 
                        };
                    });
                }else{
                     updated = result.result.map(product => {
                        return {
                            ...product,
                            addQuantity: 1
                        };
                    });
                }

                setUpdatedProducts(updated);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        if(Object.keys(products).length>0){
            if(Object.keys(userDeatils).length==0){
                const cartItems = JSON.parse(localStorage.getItem('UserCarts_Produts')) || [];
                const updated = products.length > 0 && products.map(product => {
                    const cartItem = cartItems.find(item => item._id === product._id);
                    return {
                        ...product,
                        Addtocart: !!cartItem, 
                        addQuantity: cartItem ? cartItem.addedQuantity : 1 
                    };
                });
                setUpdatedProducts(updated);
            }else{
    
                const updated = products.map(product => {
                    return {
                        ...product,
                        addQuantity: product.cartDetails?.[0]?.OrderQuantity
                    };
                });
                console.log(updated, 'updatedProducts');
                setUpdatedProducts(updated);
            }
        }else{
            fetchproduct()
        }
       
    }, [products,userDeatils]); 

    return (
        <div>
            <NavigationBar />
            <Container>
            <Row>
                {updatedProducts.length>0 && updatedProducts.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </Row>
        </Container>
        </div>
        
    );
};

export default App;
