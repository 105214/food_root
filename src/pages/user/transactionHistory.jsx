import React, { useEffect, useState } from 'react';
import { Container, Table, Card, Button, Form, InputGroup, Alert, Badge, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFileDownload, FaEye } from 'react-icons/fa';
import './css/transhistory.css';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedDateRange, setSelectedDateRange] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const navigate = useNavigate();

    const ITEMS_PER_PAGE = 10;

    // Get axios instance with auth headers
    const getAxiosInstance = () => {
        const token = localStorage.getItem('token');
        return axios.create({
            baseURL: 'http://localhost:3001/api',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    };

    useEffect(() => {
        fetchTransactions();
    }, [currentPage, filterStatus, selectedDateRange, sortBy, sortOrder]);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const axiosInstance = getAxiosInstance();
            
            // Build query parameters
            let queryParams = `?page=${currentPage}&limit=${ITEMS_PER_PAGE}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
            
            if (filterStatus !== 'all') {
                queryParams += `&status=${filterStatus}`;
            }
            
            if (selectedDateRange !== 'all') {
                queryParams += `&dateRange=${selectedDateRange}`;
            }
            
            if (searchTerm) {
                queryParams += `&search=${searchTerm}`;
            }
            
            const response = await axiosInstance.get(`/payment/transactions${queryParams}`);
            
            if (response.data.success) {
                setTransactions(response.data.transactions);
                setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
            } else {
                setError("Failed to load transactions");
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error.response?.data?.message || "Failed to load transactions");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page on new search
        fetchTransactions();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setSelectedDateRange('all');
        setSortBy('date');
        setSortOrder('desc');
        setCurrentPage(1);
    };

    const handleDownloadReceipt = async (transactionId) => {
        try {
            const axiosInstance = getAxiosInstance();
            const response = await axiosInstance.get(`/payment/download-receipt/${transactionId}`, {
                responseType: 'blob'
            });
            
            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt-${transactionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('Error downloading receipt:', error);
            setError("Failed to download receipt");
        }
    };

    const viewTransactionDetails = async (transactionId) => {
        try {
            setIsLoading(true);
            const axiosInstance = getAxiosInstance();
            const response = await axiosInstance.get(`/payment/transaction-details?transaction_id=${transactionId}`);
            
            if (response.data.success) {
                setSelectedTransaction(response.data.transaction);
            } else {
                setError("Failed to load transaction details");
            }
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            setError(error.response?.data?.message || "Failed to load transaction details");
        } finally {
            setIsLoading(false);
        }
    };

    const closeTransactionDetails = () => {
        setSelectedTransaction(null);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed':
                return <Badge bg="success">Completed</Badge>;
            case 'pending':
                return <Badge bg="warning">Pending</Badge>;
            case 'failed':
                return <Badge bg="danger">Failed</Badge>;
            case 'refunded':
                return <Badge bg="info">Refunded</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Pagination controls
    const renderPagination = () => {
        const pages = [];
        
        pages.push(
            <Pagination.First 
                key="first" 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1} 
            />
        );
        
        pages.push(
            <Pagination.Prev 
                key="prev" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1} 
            />
        );
        
        // Show limited page numbers with ellipsis
        const maxPageItems = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxPageItems - 1);
        
        if (endPage - startPage + 1 < maxPageItems) {
            startPage = Math.max(1, endPage - maxPageItems + 1);
        }
        
        if (startPage > 1) {
            pages.push(<Pagination.Item key={1} onClick={() => setCurrentPage(1)}>{1}</Pagination.Item>);
            if (startPage > 2) {
                pages.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Pagination.Item 
                    key={i} 
                    active={i === currentPage}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
            }
            pages.push(
                <Pagination.Item 
                    key={totalPages} 
                    onClick={() => setCurrentPage(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }
        
        pages.push(
            <Pagination.Next 
                key="next" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages} 
            />
        );
        
        pages.push(
            <Pagination.Last 
                key="last" 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages} 
            />
        );
        
        return (
            <Pagination className="justify-content-center mt-4">
                {pages}
            </Pagination>
        );
    };

    return (
        <Container className="transaction-history-container py-4">
            <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                    <h2 className="mb-0">Transaction History</h2>
                    <Button variant="outline-light" onClick={() => navigate('/my-orders')}>
                        Back to Orders
                    </Button>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                    
                    {/* Filters Section */}
                    <div className="filters-section mb-4">
                        <Form onSubmit={handleSearch}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <InputGroup>
                                        <Form.Control
                                            placeholder="Search by Order ID or Transaction ID"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Button variant="outline-secondary" type="submit">
                                            <FaSearch />
                                        </Button>
                                    </InputGroup>
                                </div>
                                
                                <div className="col-md-2">
                                    <Form.Select 
                                        value={filterStatus} 
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </Form.Select>
                                </div>
                                
                                <div className="col-md-2">
                                    <Form.Select 
                                        value={selectedDateRange} 
                                        onChange={(e) => setSelectedDateRange(e.target.value)}
                                    >
                                        <option value="all">All Time</option>
                                        <option value="today">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                        <option value="year">This Year</option>
                                    </Form.Select>
                                </div>
                                
                                <div className="col-md-2">
                                    <Form.Select 
                                        value={sortBy} 
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="date">Sort by Date</option>
                                        <option value="amount">Sort by Amount</option>
                                    </Form.Select>
                                </div>
                                
                                <div className="col-md-2">
                                    <Form.Select 
                                        value={sortOrder} 
                                        onChange={(e) => setSortOrder(e.target.value)}
                                    >
                                        <option value="desc">Descending</option>
                                        <option value="asc">Ascending</option>
                                    </Form.Select>
                                </div>
                                
                                <div className="col-12 d-flex justify-content-end">
                                    <Button variant="secondary" onClick={clearFilters} className="me-2">
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                    
                    {/* Transaction Table */}
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading transactions...</p>
                        </div>
                    ) : transactions.length > 0 ? (
                        <div className="table-responsive">
                            <Table striped hover className="transaction-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Transaction ID</th>
                                        <th>Order ID</th>
                                        <th>Amount</th>
                                        <th>Payment Method</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction._id} className="transaction-row">
                                            <td>{formatDate(transaction.createdAt)}</td>
                                            <td>
                                                <span className="transaction-id">{transaction.transactionId}</span>
                                            </td>
                                            <td>{transaction.orderId?._id || 'N/A'}</td>
                                            <td>₹{transaction.amount.toFixed(2)}</td>
                                            <td className="text-capitalize">{transaction.paymentMethod}</td>
                                            <td>{getStatusBadge(transaction.status)}</td>
                                            <td>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    className="me-2"
                                                    onClick={() => viewTransactionDetails(transaction._id)}
                                                >
                                                    <FaEye /> Details
                                                </Button>
                                                {transaction.status === 'completed' && (
                                                    <Button 
                                                        variant="outline-success" 
                                                        size="sm"
                                                        onClick={() => handleDownloadReceipt(transaction._id)}
                                                    >
                                                        <FaFileDownload /> Receipt
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <Alert variant="info">No transactions found matching your criteria.</Alert>
                    )}
                    
                    {/* Pagination */}
                    {transactions.length > 0 && renderPagination()}
                </Card.Body>
            </Card>
            
            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <div className="transaction-modal-backdrop" onClick={closeTransactionDetails}>
                    <div className="transaction-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="transaction-modal-header">
                            <h4>Transaction Details</h4>
                            <button className="btn-close" onClick={closeTransactionDetails}></button>
                        </div>
                        <div className="transaction-modal-body">
                            <div className="transaction-detail-item">
                                <span className="label">Transaction ID:</span> 
                                <span className="value">{selectedTransaction.transactionId}</span>
                            </div>
                            <div className="transaction-detail-item">
                                <span className="label">Order ID:</span> 
                                <span className="value">{selectedTransaction.orderId?._id || 'N/A'}</span>
                            </div>
                            <div className="transaction-detail-item">
                                <span className="label">Amount:</span> 
                                <span className="value">₹{selectedTransaction.amount.toFixed(2)}</span>
                            </div>
                            <div className="transaction-detail-item">
                                <span className="label">Status:</span> 
                                <span className="value">{getStatusBadge(selectedTransaction.status)}</span>
                            </div>
                            <div className="transaction-detail-item">
                                <span className="label">Payment Method:</span> 
                                <span className="value text-capitalize">{selectedTransaction.paymentMethod}</span>
                            </div>
                            <div className="transaction-detail-item">
                                <span className="label">Date & Time:</span> 
                                <span className="value">{formatDate(selectedTransaction.createdAt)}</span>
                            </div>
                            
                            {/* Order Items (if available) */}
                            {selectedTransaction.orderId?.items && selectedTransaction.orderId.items.length > 0 && (
                                <div className="order-items-section mt-4">
                                    <h5>Order Items</h5>
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedTransaction.orderId.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.dishName || item.name || "Unknown item"}</td>
                                                    <td>{item.quantity || 1}</td>
                                                    <td>₹{item.price.toFixed(2)}</td>
                                                    <td>₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                            
                            <div className="transaction-actions mt-4">
                                {selectedTransaction.status === 'completed' && (
                                    <Button 
                                        variant="success" 
                                        onClick={() => handleDownloadReceipt(selectedTransaction._id)}
                                    >
                                        <FaFileDownload /> Download Receipt
                                    </Button>
                                )}
                                <Button 
                                    variant="primary" 
                                    onClick={() => navigate(`/my-orders`)}
                                    className="ms-2"
                                >
                                    View All Orders
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default TransactionHistory;