import logo from './logo.svg';
import './App.css';
import Register from './pages/authdication/register';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  Route,
  Routes,
} from "react-router-dom";
import Login from './pages/authdication/login';
import Dashboard from './pages/User/dashboard.jsx';
import { Loginrouter } from './components/router/loginrouter';
import { UserProductedrouter } from './components/router/UserproductedRouter';
import HelperRouter from './pages/helperpage';
import { AdminProductedrouter } from './components/router/Adminproductedrouter';
import AdminDashboard from './pages/admin/dashboard';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import UserDetails from './pages/admin/user/userDetails.jsx';
import ProductManagement from './pages/admin/ProductManagement/productManagement.jsx';
import AdminManagement from './pages/admin/adminMonagement/adminManagement.jsx';
import NavigationBar from './components/navbar/adminnavbar';
import { ProtectedRoute, SuberAdminProductedrouter } from './components/router/productedRoute.js';
import AddProduct from './pages/admin/ProductManagement/AddProduct.jsx';

import { ToastContainer } from "react-toastify";
import UserCart from './pages/User/cart/CartList.jsx';
import CheckoutPage from './pages/User/order/checkout.jsx';
import OrderListingPage from './pages/User/order/orderlist.jsx';
import UserOrderList from './pages/admin/user/userorderlist.jsx';
import UserCartDetails from './pages/admin/user/userCartlist.jsx';
function App() {

  const userdetails=useSelector(state=>state.User)

  const [isAdmin,setisAdmin]=useState(false)

  useEffect(
    ()=>{

      setisAdmin( userdetails.type==0 )
    },[userdetails]
  )

 

  return (
    <div >
      <Routes>

        {/* {login router } */}
        <Route element={<Loginrouter />}>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        </Route >

        <Route element={<AdminProductedrouter />}>
        {/* <Route path='/Adddashboard' element={<AdminDashboard />} /> */}
       
        <Route path="/user" element={<UserDetails />} />
        <Route path="/cart-list/:id" element={<UserCartDetails />} />
        <Route path="/order-list/:id" element={<UserOrderList />} />

        
        <Route path="/products" element={<ProductManagement />} />
        <Route path='/Add-product' element={<AddProduct/>} />
        <Route path='/Add-product/:id' element={<AddProduct/>} />
        </Route>

        <Route element={<UserProductedrouter />}>
        <Route path='/Order' element={<OrderListingPage />} />
        <Route path='/CheckoutPage/:id/:type' element={<CheckoutPage />} />
        </Route>

        <Route element={<ProtectedRoute isAllowed={isAdmin} redirectTo='/login' />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/Cart' element={<UserCart />} />
      </Route>
        

      </Routes>
      
      <ToastContainer />
      
      <HelperRouter />
    
    </div>
  );
}

export default App;
