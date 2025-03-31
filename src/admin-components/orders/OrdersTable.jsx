import React, { useEffect, useMemo } from 'react'
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Trash2 } from "lucide-react";
import axios from 'axios';
import { Button } from '@nextui-org/react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { toast } from 'sonner';

// const orderData = [
//     { id: "ORD001", customer: "John Doe", total: 235.4, status: "Delivered", date: "2023-07-01" },
//     { id: "ORD002", customer: "Jane Smith", total: 412.0, status: "Processing", date: "2023-07-02" },
//     { id: "ORD003", customer: "Bob Johnson", total: 162.5, status: "Shipped", date: "2023-07-03" },
//     { id: "ORD004", customer: "Alice Brown", total: 750.2, status: "Pending", date: "2023-07-04" },
//     { id: "ORD005", customer: "Charlie Wilson", total: 95.8, status: "Delivered", date: "2023-07-05" },
//     { id: "ORD006", customer: "Eva Martinez", total: 310.75, status: "Processing", date: "2023-07-06" },
//     { id: "ORD007", customer: "David Lee", total: 528.9, status: "Shipped", date: "2023-07-07" },
//     { id: "ORD008", customer: "Grace Taylor", total: 189.6, status: "Delivered", date: "2023-07-08" },
// ];

let url = import.meta.env.VITE_ADMIN_URL;
const PRODUCTS_PER_PAGE = 8; // Number of products per page
function OrdersTable() {
    const [orderData, setorderData] = useState([]);
    const [searchItem, setSearchItem] = useState("");
    const [filteredOrders, setFilteredOrders] = useState(orderData);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderDetails, setOrderDetails] = useState([]);
    const authToken = JSON.parse(localStorage.getItem('token'));

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchItem(term);
        const filtered = orderData.filter((order) => order._id.slice(-5)?.toLowerCase().includes(term) || order.productname.toLowerCase().includes(term));
        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to first page after search
    }
    const totalPages = Math.ceil(filteredOrders.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const currentProducts = filteredOrders.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    const getOrders = async () => {
        try {
            const res = await axios.get(`${url}order/all`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setorderData(res.data.orders);
            setFilteredOrders(res.data.orders);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getOrders();
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    const handleUpdateStatus = async (status, id) => {
        status = status.anchorKey;
        try {
            const res = await axios.put(`${url}order/update/${id}?status=${status}`,{}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (res.status == 200) {
                getOrders();
            }
        } catch (error) {
            console.log(error)
        }
    }
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const handleSingleGet = async (id) => {
        try {
            const res = await axios.get(`${url}order/single/${id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setOrderDetails(res.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (orderId) => {
        try {
            const res = await axios.delete(`${url}order/cancel/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const updatedOrdersData = orderData.filter((order) => order._id !== orderId);
            setorderData(updatedOrdersData);

            setFilteredOrders(updatedOrdersData.filter(
                (order) =>
                    order?._id.slice(-5)?.toLowerCase().includes(searchItem.toLowerCase()) ||
                    order?.productname.toLowerCase().includes(searchItem.toLowerCase())
            ));
            if (res.status == 200) {
                toast.success("Order delete successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setFilteredOrders(
            orderData.filter(
                (order) =>
                    order?._id.slice(-5)?.toLowerCase().includes(searchItem.toLowerCase()) ||
                    order?.productname.toLowerCase().includes(searchItem.toLowerCase())
            )
        );
    }, [orderData, searchItem]);
    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-semibold text-gray-100'>Order List</h2>
                    <div className="relative">
                        <input type="text"
                            placeholder='Search orders...'
                            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            onChange={handleSearch} value={searchItem} />
                        <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                    </div>
                </div>

                <div className='overflow-x-auto relative'>
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Order ID
                                </th>

                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Customer
                                </th>

                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Total
                                </th>

                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Status
                                </th>

                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Date
                                </th>

                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-gray-700'>
                            {currentProducts.map((order) => {
                                return (
                                    <motion.tr key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            ORD{(order._id).slice(-5)}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            {order.username}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            Rs.{order.total?.toFixed(2)}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            {/* <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${order.status === "Delivered" ? "bg-green-100 text-green-800 " : order.status === "Processing"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"}`}>
                                                {order.status}
                                            </span> */}
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button className={`capitalize focus:outline-none ${order.status === "Delivered" ? "bg-green-100 text-green-800" : order.status === "Processing"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"}`} variant="bordered" color={`${order.status === "Delivered" ? "success" : order.status === "Processing"
                                                            ? "primary"
                                                            : "danger"}`} size='sm'>
                                                        {order.status}
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu
                                                    disallowEmptySelection
                                                    aria-label="Single selection example"
                                                    selectedKeys={new Set([order.status])}
                                                    selectionMode="single"
                                                    variant="flat"
                                                    onSelectionChange={(status) => handleUpdateStatus(status, order._id)}
                                                    color='primary'
                                                >
                                                    <DropdownItem key="Delivered">Delivered</DropdownItem>
                                                    <DropdownItem key="Processing">Processing</DropdownItem>
                                                    <DropdownItem key="Pending">Pending</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            {formatDate(order.orderdate)}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            <Tooltip content={'View'} color='secondary'>
                                                <button className='text-indigo-400 hover:text-indigo-300 p-2 bg-transparent focus:outline-none' onClick={() => {
                                                    onOpen()
                                                    handleSingleGet(order?._id)
                                                }} >
                                                    <Eye size={22} />
                                                </button>
                                            </Tooltip>
                                            <Tooltip content={'Delete'} color='danger'>
                                                <button className='text-red-400 hover:text-red-300 p-2 bg-transparent focus:outline-none' onClick={() => handleDelete(order?._id)}>
                                                    <Trash2 size={22} />
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>

                </div>
                <div className="flex justify-between items-center mt-4">
                    <Button
                        disabled={currentPage === 1}
                        onClick={handlePreviousPage}
                        variant="light"
                        color="primary"
                        className={`focus:outline-none ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Previous
                    </Button>
                    <span className="text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        disabled={currentPage === totalPages}
                        onClick={handleNextPage}
                        variant="light"
                        color="primary"
                        className={`focus:outline-none ${currentPage === totalPages ? " opacity-50 cursor-not-allowed" : " "}`}
                    >
                        Next
                    </Button>
                </div>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='sm'>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Order details</ModalHeader>
                                <ModalBody>
                                    <div className="space-y-4">
                                        {/* Order ID */}
                                        <div>
                                            <h2 className="text-lg font-bold">Order ID</h2>
                                            <p className="text-gray-600">ORD{(orderDetails?._id)?.slice(-5)}</p>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">Customer</h2>
                                            <p className="text-gray-600">{orderDetails.username || "user not found"}</p>
                                        </div>
                                        {/* Product Name(s) */}
                                        <div>
                                            <h2 className="text-lg font-bold">Product Name(s)</h2>
                                            {Array.isArray(orderDetails.products) ? (
                                                orderDetails.products.map((name, index) => (
                                                    <p key={index} className="text-gray-600">
                                                        {name.productname}
                                                    </p>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">{orderDetails.productname}</p>
                                            )}

                                        </div>

                                        {/* Order Date */}
                                        <div>
                                            <h2 className="text-lg font-bold">Order Date</h2>
                                            <p className="text-gray-600">
                                                {new Date(orderDetails.orderdate).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">Payment type</h2>
                                            <p className="text-gray-600">
                                                {orderDetails.orderType}
                                            </p>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">Shipping address</h2>
                                            <p className="text-gray-600">
                                                {orderDetails.address}
                                            </p>
                                        </div>

                                        {/* Total */}
                                        <div>
                                            <h2 className="text-lg font-bold">Total</h2>
                                            <p className="text-gray-600">Rs. {orderDetails.total}</p>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <h2 className="text-lg font-bold">Status</h2>
                                            <p className={`font-semibold ${orderDetails.status === 'Delivered' ? 'text-green-800' :
                                                orderDetails.status === 'Processing' ? 'text-yellow-800' : 'text-red-800'
                                                }`}>{orderDetails.status}</p>
                                        </div>

                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose} className='focus:outline-none'>
                                        Close
                                    </Button>
                                    {/* <Button color="primary" onPress={onClose} className='focus:outline-none'>
                                        Action
                                    </Button> */}
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </motion.div>
        </>
    )
}

export default OrdersTable