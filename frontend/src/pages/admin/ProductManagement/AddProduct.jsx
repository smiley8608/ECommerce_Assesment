import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './Addproducts.css';
import { toastAlert } from '../../../components/toastcontainer';
import { validateProducts } from '../../../components/validation/productvalidation';
import { useNavigate, useParams } from 'react-router-dom';
import { crateProduct, getSingleProduct } from '../../../action/instance';
import config from '../../../lib/config'
const initialform = {
    productName: '',
    description: '',
    productImage: '',
    OriginalPrice: '',
    DiscountPrice: '',
    SellingPrice: '',
    Quantity: '',
    UOM: '',
    HSNCode: '',
}

const Addproducts = () => {

    const {id} = useParams()

    

    const [formValues, setFormValues] = useState(initialform);

    const [ImagePreview, setImagePreview] = useState('')

    const [error, setError] = useState()

    const navigate =useNavigate()


    const getProductdetails = async()=>{
        try {
            
            const payload={
                productid:id
            }
            const {result , status}= await getSingleProduct(payload)

            
            if(status){
                setFormValues({
                    ...formValues , 
                    productName:result.productdetails.productName,
                    description: result.productdetails.description,
                    productImage: result.productdetails.productImage,
                    OriginalPrice: result.productdetails.OriginalPrice,
                    DiscountPrice: result.productdetails.DiscountPrice,
                    SellingPrice: result.productdetails.SellingPrice,
                    Quantity: result.productdetails.Quantity,
                    UOM: result.productdetails.UOM,
                    HSNCode: result.productdetails.HSNCode,
                })
            }
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        if(id){
            getProductdetails()
        }
    },[id])


    const {
        productName,
        description,
        productImage,
        OriginalPrice,
        DiscountPrice,
        Quantity,
        UOM,
        HSNCode,
    } = formValues


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };


    const handleImageChange = (e) => {

        const allowedImageTypes = ['image/jpeg', 'image/png'];
        const file = e.target.files[0];
        if (file) {

            if (!allowedImageTypes.includes(file.type)) {
                toastAlert('error', 'Invalid file type. Please select a JPEG or PNG image.');
                setImagePreview('');
                return;
            }
            setError('');
            setFormValues(prevValues => ({
                ...prevValues,
                'productImage': file
            }));
            setImagePreview(URL.createObjectURL(file)); // Create a preview URL
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        const err = await validateProducts(formValues)

        
        if (Object.keys(err).length == 0) {

            if(id){
                formValues.id = id
            }
            const {result, status}= await crateProduct(formValues)
            
            if(status){
                setError()
                toastAlert('success',result.message)
                navigate('/products')
            }else{
                setError(result.error)
            }
        } else {
            setError(err)
        }
    };

    const backhandler = ()=>{
        navigate('/products')
    }

    
    return (
        <Container>
             <Button variant="primary" onClick={backhandler}>
                        back
                    </Button>
            <div className="form-container">
                <h1>Add Products</h1>
                <Form onSubmit={handleSubmit}>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group controlId="field1">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter ProductName"
                                    id='productName'
                                    defaultValue={productName}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            {
                                error && error.productName && <span style={{ color: 'red' }}>
                                    {error.productName}
                                </span>
                            }
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="field2">
                                <Form.Label>OriginalPrice</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter OriginalPrice,"
                                    value={OriginalPrice}
                                    id='OriginalPrice'
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {
                                error && error.OriginalPrice && <span style={{ color: 'red' }}>
                                    {error.OriginalPrice}
                                </span>
                            }
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="field3">
                                <Form.Label>DiscountPrice</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter DiscountPrice"
                                    value={DiscountPrice}
                                    id='DiscountPrice'
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {
                                error && error.DiscountPrice && <span style={{ color: 'red' }}>
                                    {error.DiscountPrice}
                                </span>
                            }
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group controlId="field4">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter Description"
                                    value={description}
                                    id='description'
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {
                                error && error.description && <span style={{ color: 'red' }}>
                                    {error.description}
                                </span>
                            }
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group controlId="field1">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Quantity"
                                    id='Quantity'
                                    value={Quantity}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {
                                error && error.Quantity && <span style={{ color: 'red' }}>
                                    {error.Quantity}
                                </span>
                            }
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="field2">
                                <Form.Label>UOM</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter UOM,"
                                    value={UOM}
                                    id='UOM'
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {
                                error && error.UOM && <span style={{ color: 'red' }}>
                                    {error.UOM}
                                </span>
                            }
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="field3">
                                <Form.Label>HSNCode</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter HSNCode"
                                    value={HSNCode}
                                    id='HSNCode'
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {
                                error && error.HSNCode && <span style={{ color: 'red' }}>
                                    {error.HSNCode}
                                </span>
                            }
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="field4">
                                <Form.Label>Uploade Product Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    placeholder="Uploade productImage"
                                    id='productImage'
                                    onChange={handleImageChange}
                                />
                            </Form.Group>
                            {
                                error && error.productImage && <span style={{ color: 'red' }}>
                                    {error.productImage}
                                </span>
                            }
                        </Col>
                        {ImagePreview ? 
                            <div className="mt-3">
                                <img
                                    src={ImagePreview}
                                    alt="Image preview"
                                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }}
                                />
                            </div>
                            :
                             <>
                                {
                                    productImage != '' ?
                                        <div className="mt-3">
                                            <img
                                                src={`${config.apiurl}/product/${productImage}`}
                                                alt="Image preview"
                                                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }}
                                            />
                                        </div> : ''
                                }


                            </>
                        }
                    </Row>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>

                   
                </Form>
            </div>
        </Container>
    );
};

export default Addproducts;
