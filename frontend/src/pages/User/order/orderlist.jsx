import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Container, Row, Col } from 'react-bootstrap';
import { UserOrderList } from '../../../action/instance';
import NavigationBar from '../../../components/navbar/adminnavbar';

const OrderListingPage = () => {
    const [orders, setOrders] = useState([]);
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
            const { result, status } = await UserOrderList(payload)
            console.log(result, 'OrderListingPage')
            if (status) {

                const updatedOrder = result.result?.[0]?.OrderList.map((val, index) => {
                    val.Sno = index + 1
                    return val
                }
                )
                setOrders(updatedOrder);
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

    console.log(orders, 'ordersorders')

    return (

        <div>
            <NavigationBar />

            <Container>
                <Row className="justify-content-center">
                    <Col md={12}>
                        <h2 className="mb-4">Order Listing</h2>
                        <DataTable
                            columns={columns}
                            data={orders}
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

    );
};
export default OrderListingPage;
