import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavigationBar.css';
import { removecookies } from '../cookies/cookies';
import { useSelector } from 'react-redux';

const NavigationBar = () => {

    const userdetails = useSelector(state => state.User)

  

    const logoutHandler = async () => {
        const isremoved = removecookies()
        if (isremoved) {
            window.location.reload()
        }
    }
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand as={Link} to="/" className="navbar-brand">MyApp</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {
                        userdetails?.type == 0 ?
                            <>
                                <Nav.Link as={Link} to="/user">User</Nav.Link>
                                <Nav.Link as={Link} to="/products">Products</Nav.Link>:

                            </>
                            :
                            <>
                                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/Cart">Cart</Nav.Link>
                                <Nav.Link as={Link} to="/Order">Order</Nav.Link>
                            </>
                    }

                    <NavDropdown title="More" id="basic-nav-dropdown">
                        {
                            Object.keys(userdetails).length !=0   ? <>
                            <NavDropdown.Item as={Link} to="#">{userdetails.username?userdetails.username:'Admin'}</NavDropdown.Item>
                            <NavDropdown.Item as={Link} onClick={logoutHandler}>Logout</NavDropdown.Item>
                            </>:
                            <>
                           
                            <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                            </>
                        }
                        
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
