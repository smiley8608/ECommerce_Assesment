


import React, { useEffect, useState } from "react";
import NavigationBar from "../../../components/navbar/adminnavbar";
import { Button, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { UserCart, UserOrderList } from "../../../action/instance";
import moment from 'moment'
import { useNavigate, useParams } from "react-router-dom";
function UserCartDetails(){

    const navigator = useNavigate()

    const {id}=useParams()

    const [userCartList, setUsercartList] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);


    const fetchCartList = async (page, size) => {
        setLoading(true);
        try {

            const payload = {
                page: page,
                limit: size,
                id:id
            }
            const { result, status } = await UserCart(payload)
            console.log(result, 'OrderListingPage')
            if (status) {

                const updatedOrder = result.result.map((val, index) => {
                    val.Sno = index + 1
                    return val
                }
                )
                setUsercartList(updatedOrder);
                setTotalRows(result.total)
            }


        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(id){

            fetchCartList(currentPage, perPage);
        }
    }, [id, currentPage, perPage]);

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
            name: 'ProductName',
            selector: row => row.productdetails[0].productName,
            sortable: true,
        },
        {
            name: 'OrderQuantity',
            selector: row => row.OrderQuantity,
            sortable: true,
        },
        {
            name: 'TotalAmount',
            selector: row => row.productdetails[0].SellingPrice * row.OrderQuantity,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => moment(row.createdAt).format('LL') ,
            sortable: true,
        },
       
    ];

    console.log(userCartList, 'ordersorders')

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
                        <h2 className="mb-4">User Cart Listing</h2>
                        <DataTable
                            columns={columns}
                            data={userCartList}
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
export default UserCartDetails