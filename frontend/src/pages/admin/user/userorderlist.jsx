
import React, { useEffect, useState } from "react";
import NavigationBar from "../../../components/navbar/adminnavbar";
import { Button, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FetchUserOrderList } from "../../../action/instance";
import moment from 'moment'
import { useNavigate, useParams } from "react-router-dom";
function UserOrderList(){

    const navigator = useNavigate()

    const {id}=useParams()


    const [userOrderList, setUserOrder] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);


    const fetchOrders = async (page, size) => {
        setLoading(true);
        try {
            const payload = {
                page: page,
                limit: size,
                id:id
            }
            const { result, status } = await FetchUserOrderList(payload)
            console.log(result, 'OrderListingPage')
            if (status) {

                const updatedOrder = result.result.map((val, index) => {
                    val.Sno = index + 1
                    return val
                }
                )
                setUserOrder(updatedOrder);
                setTotalRows(result.total)
            }


        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage, perPage);
    }, [currentPage, perPage]);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };



    const columns = [
        {
            name: 'Sno',
            selector: row => row.Sno,
            sortable: true,
        },
        {
            name: 'Product name',
            selector: row => row.productdetails[0].productName,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.OrderQuantity,
            sortable: true,
        },
        {
            name: 'Total Amount',
            selector: row => row.OrderQuantity * row.productdetails[0].SellingPrice,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => "Ordereds",
            sortable: true,
        },
    ];

    console.log(userOrderList, 'ordersorders')

    const handleUserDetails = async(id, type)=>{
        if(type==0){
            navigator(`/cart-list/${id}`)
        }else{
            navigator(`/order-list/${id}`)
        }
    }

    const backHandler = async()=>{
        navigator('/user')
    }

    return (
        <div>
             <NavigationBar />
            
            
            <Container>
                <Row className="justify-content-center">
                    <Col md={12}>
                    <Button variant="primary" className="mt-3" onClick={backHandler}>
                                back
                            </Button>
                        <h2 className="mb-4">User Order Listing</h2>
                        <DataTable
                            columns={columns}
                            data={userOrderList}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handlePerRowsChange}
                            progressPending={loading}
                            highlightOnHover
                            pointerOnHover
                            striped
                            responsive
                        />
                    </Col>
                </Row>
            </Container>

        </div>
    )



}
export default UserOrderList