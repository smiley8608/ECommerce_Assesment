

import React, { useEffect } from "react";
import { fetchUserDetails } from "../redux/features/userDeatils";
import { getCookies } from "../components/cookies/cookies";
import { isEmpty } from "../components/helperFun/helperFun";
import { useDispatch } from 'react-redux'
import { getAllProduct } from "../redux/features/AllProductsdetails";
import { FetchUserCart } from "../redux/features/usercart";

const HelperRouter = () => {

    const dispatch = useDispatch()
    const token = getCookies()
    useEffect(() => {

        console.log(!isEmpty(token), 'token')
        if (!isEmpty(token)) {
            dispatch(fetchUserDetails())
            dispatch(FetchUserCart())
        }

        dispatch(getAllProduct())
    }, [token])
    return (
        <div>
        </div>
    )
}

export default HelperRouter