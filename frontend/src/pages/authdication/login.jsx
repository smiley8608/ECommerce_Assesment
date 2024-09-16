import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './register.css';
import { useState } from 'react';
import { setCookies } from '../../components/cookies/cookies';
import { loginuser } from '../../action/instance';
import { useNavigate } from 'react-router-dom';
import { LoginValid } from '../../components/validation/authvalidation';

import { getAllProduct } from '../../redux/features/AllProductsdetails';
import { FetchUserCart } from '../../redux/features/usercart';

const initialvalue = {
    email: '',
    password: '',
    showPassword: false
};

function Login() {
    const navigate = useNavigate();

    
    const [formvalue, setFormvalue] = useState(initialvalue);
    const [error , setError]=useState()

    const { email, password, showPassword } = formvalue;

    const changeHandler = (e) => {
        const { id, value } = e.target;
        setFormvalue({ ...formvalue, [id]: value });
    };

    const togglePasswordVisibility = () => {
        setFormvalue(prevState => ({
            ...prevState,
            showPassword: !prevState.showPassword
        }));
    };

    const submithandler = async (e) => {
        e.preventDefault();
        try {

            const err = await LoginValid(formvalue)
            if(Object.keys(err).length ==0){
                const LocalCart = localStorage.getItem('UserCarts_Produts');
                if (LocalCart) {
                    formvalue.LocalCart = LocalCart;
                }
                const { result, status } = await loginuser(formvalue);
    
                console.log(result, status, 'result, status');
                if (status) {
                    localStorage.removeItem('UserCarts_Produts');
                    
                    await setCookies(result.token);
                    window.location.href='/'
                    

                }else{
                    setError(result.error)
                }
            }else{
                setError(err)
            }
           
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row className="justify-content-center">
                <Col md={6} lg={12}>
                    <div className="form-container">
                        <Form>
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                <Form.Label column sm="4">
                                    Email
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type='text'
                                        placeholder='Email'
                                        id='email'
                                        value={email}
                                        onChange={changeHandler}
                                    />
                                    {error && error.email && <span style={{ color: 'red' }}>{error.email}</span>}
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="4">
                                    Password
                                </Form.Label>
                                <Col sm="8" className="position-relative">
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        id='password'
                                        value={password}
                                        onChange={changeHandler}
                                    />
                                    <Button
                                        variant="link"
                                        className="position-absolute end-0"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <i className={`fa${showPassword ? 's' : 'r'} fa-eye`} />
                                    </Button>

                                    {error && error.password && <span style={{ color: 'red' }}>{error.password}</span>}

                                </Col>
                            </Form.Group>
                            <Row className="justify-content-center">
                                <Col sm="auto">
                                    <Button variant="primary" onClick={submithandler}>
                                        Login
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
