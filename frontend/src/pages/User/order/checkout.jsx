import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import './checkout.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FetchCheckOutDetails, SubmitOrder } from '../../../action/instance';
import { toastAlert } from '../../../components/toastcontainer';
import { CheckOutValidation } from '../../../components/validation/productvalidation';
import { getAllProduct } from '../../../redux/features/AllProductsdetails';
import { FetchUserCart } from '../../../redux/features/usercart';
import { useDispatch } from 'react-redux';


const FormValue={
    name: '',
    address: '',
    city: '',
    pincode:'',
    cashOnly: false
  }

const CheckoutPage = () => {

    const navigate=useNavigate()
    const dispatch = useDispatch()
    const [orderDetails,setOrderDetails]=useState([])

    const [formData, setFormData]=useState(FormValue)
    const [error,setError]=useState()

    const {
        name,
    address,
    city,
    pincode,
    cashOnly
    }=formData

  const {id,type}=useParams()

  console.log(id,type,'id,type')

  


  useEffect(()=>{
    fetchCheckOutlist()
  },[])

  const fetchCheckOutlist = async()=>{
    try {

        const payload = {
            cartid:id ,
            type:type
        }
        const {result , status} = await FetchCheckOutDetails(payload)

        console.log(result , status,'result , status')
        if(status){
            setOrderDetails(result.result)
        }
    } catch (error) {
        console.log(error)
    }
  }

  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {

        console.log(formData,'formDataformData');
        const err = await CheckOutValidation(formData)
        if(Object.keys(err).length==0){
            formData.id=id
            formData.type=type

            const {result,status}= await SubmitOrder(formData)
            
            if(status){
                dispatch(getAllProduct())
                dispatch(FetchUserCart())
                toastAlert('success' , 'Order Created')
                navigate('/Order')
            }
        }else{
            setError(err)
        }
        
    } catch (error) {
        
    }
    // Handle form submission
    
  };

  
  const calculateTotalSellingPrice = () => {
    return orderDetails.reduce((total, order) => {
        // Ensure productdetails array exists and has at least one item
        const product = order.productdetails?.[0];
        if (product) {
            return total + (product.SellingPrice * order.OrderQuantity);
        }
        return total;
    }, 0);
};



  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={8}>
          <div className="border p-4 rounded">
            <h2 className="mb-4">Checkout</h2>

            <Table striped bordered hover className="mb-4">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Discount</th>
                  <th>Amount</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((Val, index) => (
                  <tr key={index}>
                    <td>{Val.productdetails?.[0].productName}</td>
                    <td>{Val.OrderQuantity}</td>
                    <td>${Val.productdetails?.[0].DiscountPrice}</td>
                    <td>${Val.productdetails?.[0].SellingPrice}</td>
                    <td>${Val.OrderQuantity * Val.productdetails?.[0].SellingPrice}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" className="text-right"><strong>Total</strong></td>
                  <td>${calculateTotalSellingPrice()}</td>
                </tr>
              </tbody>
            </Table>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                
                />
              </Form.Group>
              {
                error&& error.name&&<span style={{color:'red'}}>
                    {
                        error.name
                    }
                </span>
              }
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your address"
                  name="address"
                  value={address}
                  onChange={handleChange}
                  
                />
              </Form.Group>
              {
                error&& error.address&&<span style={{color:'red'}}>
                    {
                        error.address
                    }
                </span>
              }
              <Form.Group controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your city"
                  name="city"
                  value={city}
                  onChange={handleChange}
                  
                />
              </Form.Group>
              {
                error&& error.city&&<span style={{color:'red'}}>
                    {
                        error.city
                    }
                </span>
              }
              <Form.Group controlId="formEmail">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Pincode"
                  name="pincode"
                  value={pincode}
                  onChange={handleChange}
                  
                />
              </Form.Group>
              {
                error&& error.pincode&&<span style={{color:'red'}}>
                    {
                        error.pincode
                    }
                </span>
              }
              <Form.Group controlId="formCashOnly" className="mt-4">
                <Form.Check
                  type="checkbox"
                  label="Cash Only"
                  name="cashOnly"
                  checked={cashOnly}
                  onChange={handleChange}
                  className={`custom-checkbox ${formData.cashOnly ? 'highlighted' : ''}`}
                />
                {
                error&& error.cashOnly&&<span style={{color:'red'}}>
                    {
                        error.cashOnly
                    }
                </span>
              }
              </Form.Group>
              
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
