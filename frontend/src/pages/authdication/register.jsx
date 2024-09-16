import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './register.css';
import { useState } from 'react';
import { registerUser } from '../../action/instance';
import { RegisterValid } from '../../components/validation/authvalidation';
import { useNavigate } from 'react-router-dom';
import { toastAlert } from '../../components/toastcontainer';


const validatePasswordStrength = (password) => {
    const strength = {
        score: 0, 
        message: '',
        color: 'danger' 
    };

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (hasUpperCase && hasLowerCase && hasDigits && hasSpecialChar && isLongEnough) {
        strength.score = 2;
        strength.message = 'Strong password';
        strength.color = 'success'; // green
    } else if (isLongEnough && (hasUpperCase || hasLowerCase) && hasDigits) {
        strength.score = 1;
        strength.message = 'Moderate password';
        strength.color = 'warning'; // yellow
    } else {
        strength.message = 'Password is too weak';
        strength.color = 'danger'; // red
    }

    return strength;
};

const initialState = {
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
    showPassword: false,
    showConfirmPassword: false,
    passwordStrength: '',
    passwordStrengthColor: 'danger'
};

function Register() {
    const [formvalue, setFormvalue] = useState(initialState);
    const [error, setError] = useState({});

    const navigate=useNavigate()

    const { username, email, password, confirmpassword, showPassword, showConfirmPassword, passwordStrength, passwordStrengthColor } = formvalue;

    const changeHandler = (e) => {
        const { id, value, type, checked } = e.target;

        if (id === 'password') {
            const { message, color } = validatePasswordStrength(value);
            setFormvalue({
                ...formvalue,
                [id]: value,
                passwordStrength: message,
                passwordStrengthColor: color
            });
        }else {
            setFormvalue({
                ...formvalue,
                [id]: type === 'checkbox' ? checked : value
            });
        }
    };

    const togglePasswordVisibility = (field) => {
        setFormvalue(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    const submithandler = async (e) => {
        try {
            e.preventDefault();
            const err = await RegisterValid(formvalue);
            console.log(err,'eeeeeeeeeeeeeee',passwordStrength)
            if (Object.keys(err).length === 0 && passwordStrength === 'Strong password' && confirmpassword === password) {
                const { result, status } = await registerUser(formvalue);
                console.log(result, status, 'result , status');
                if (status) {
                    setError({});
                    toastAlert('success' , result.message)
                    navigate('/login')
                }else{
                    setError(result.error);
                }
            } else {
                setError(err);
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
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextUserName">
                                <Form.Label column sm="4">
                                    UserName
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control id='username' value={username} onChange={changeHandler} type='text' placeholder='User Name' />
                                    {error && error.username && <span style={{ color: 'red' }}>{error.username}</span>}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                <Form.Label column sm="4">
                                    Email
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control id='email' value={email} onChange={changeHandler} type='text' placeholder='Email' />
                                    {error && error.email && <span style={{ color: 'red' }}>{error.email}</span>}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="4">
                                    Password
                                </Form.Label>
                                <Col sm="8" className="position-relative">
                                    <Form.Control
                                        id='password'
                                        value={password}
                                        onChange={changeHandler}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                    />
                                    <Button
                                        variant="link"
                                        className="position-absolute end-0"
                                        onClick={() => togglePasswordVisibility('showPassword')}
                                    >
                                        <i className={`fa${showPassword ? 's' : 'r'} fa-eye`} />
                                    </Button>
                                    {passwordStrength && (
                                        <div>
                                            <ProgressBar
                                                now={passwordStrength === 'Strong password' ? 100 : passwordStrength === 'Moderate password' ? 60 : 30}
                                                variant={passwordStrengthColor}
                                                className="mt-2"
                                            />
                                            <span style={{ color: passwordStrengthColor === 'danger' ? 'red' : passwordStrengthColor === 'warning' ? 'yellow' : 'green' }}>
                                                {passwordStrength}
                                            </span>
                                        </div>
                                    )}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextConfirmPassword">
                                <Form.Label column sm="4">
                                    Confirm Password
                                </Form.Label>
                                <Col sm="8" className="position-relative">
                                    <Form.Control
                                        id='confirmpassword'
                                        value={confirmpassword}
                                        onChange={changeHandler}
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                    />
                                    <Button
                                        variant="link"
                                        className="position-absolute end-0"
                                        onClick={() => togglePasswordVisibility('showConfirmPassword')}
                                    >
                                        <i className={`fa${showConfirmPassword ? 's' : 'r'} fa-eye`} />
                                    </Button>
                                    {password !== confirmpassword && <span style={{ color: 'red' }}>Passwords do not match</span>}
                                </Col>
                            </Form.Group>

                            <Row className="justify-content-center">
                                <Col sm="auto">
                                    <Button variant="primary" onClick={submithandler}>
                                        Register
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

export default Register;
