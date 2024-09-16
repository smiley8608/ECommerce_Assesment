
import React, { useEffect, useState } from "react";
import NavigationBar from "../../../components/navbar/adminnavbar";
import { useNavigate } from "react-router-dom";
import { FetchAdminAllProducts } from "../../../action/instance";
import { Button, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

function ProductManagement() {

    const navigate=useNavigate()
    const [Allproducts, setAllProduts] = useState([]);
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
            const { result, status } = await FetchAdminAllProducts(payload)
            console.log(result, 'OrderListingPage')
            if (status) {

                const updatedOrder = result.result.map((val, index) => {
                    val.Sno = index + 1
                    return val
                }
                )
                setAllProduts(updatedOrder);
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
            selector: row => row.productName,
            sortable: true,
        },
        {
            name: 'OriginalPrice',
            selector: row => row.OriginalPrice,
            sortable: true,
        },
        {
            name: 'DiscountPrice',
            selector: row => row.DiscountPrice,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.Quantity,
            sortable: true,
        },
         {
            name: 'Actions',
            cell: row => (
              <button
                onClick={() => handleEdit(row._id)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            ),
            ignoreRowClick: true, 
            allowOverflow: true,
            button: true,
          },
    ];

    console.log(Allproducts, 'ordersorders')

    const handleEdit = async(id)=>{
        navigate(`/Add-product/${id}`)
    }

    const NavigateToAdd=async()=>{
        navigate('/Add-product')
    }

    return (
        <div>

            <NavigationBar />
            ProductManagement
            {/* <button onClick={NavigateToAdd}>Add Products</button> */}
           
            <Container>

                 
            <Button variant="primary" className="mt-3" onClick={NavigateToAdd}>
                                Add Product
                            </Button>
                <Row className="justify-content-center">
                    <Col md={12}>
                        <h2 className="mb-4">Order Listing</h2>
                        <DataTable
                            columns={columns}
                            data={Allproducts}
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
export default ProductManagement