
import React, { useEffect, useState } from "react";
import NavigationBar from "../../../components/navbar/adminnavbar";
import { Button, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { AlluserList, UserOrderList } from "../../../action/instance";
import moment from 'moment'
import { useNavigate } from "react-router-dom";
function UserDetails(){

    const navigator = useNavigate()

    const [userList, setUserList] = useState([]);
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
            }
            const { result, status } = await AlluserList(payload)
            console.log(result, 'OrderListingPage')
            if (status) {

                const updatedOrder = result.result.map((val, index) => {
                    val.Sno = index + 1
                    return val
                }
                )
                setUserList(updatedOrder);
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
            name: 'User Name',
            selector: row => row.username,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => moment(row.createdAt).format('LL') ,
            sortable: true,
        },
        {
            name: 'CartList',
            cell: row => (
              <button
                onClick={() => handleUserDetails(row._id, 0)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                CartList
              </button>
            ),
            ignoreRowClick: true, 
            allowOverflow: true,
            button: true,
          },
          {
            name: 'OrderList',
            cell: row => (
              <button
                onClick={() => handleUserDetails(row._id, 1)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                OrderList
              </button>
            ),
            ignoreRowClick: true, 
            allowOverflow: true,
            button: true,
          },
    ];

    console.log(userList, 'ordersorders')

    const handleUserDetails = async(id, type)=>{
        if(type==0){
            navigator(`/cart-list/${id}`)
        }else{
            navigator(`/order-list/${id}`)
        }
    }

    

    return (
        <div>
             <NavigationBar />

          
            <Container>
                <Row className="justify-content-center">

                 
                    <Col md={12}>
                    
                        <h2 className="mb-4">Order Listing</h2>
                        <DataTable
                            columns={columns}
                            data={userList}
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
export default UserDetails