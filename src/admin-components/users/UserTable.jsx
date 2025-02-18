import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { Edit, Search, Trash2 } from 'lucide-react';
import { Button, Tooltip } from '@nextui-org/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LuMoveLeft, LuMoveRight } from 'react-icons/lu';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

let url = import.meta.env.VITE_ADMIN_URL;
const PRODUCTS_PER_PAGE = 5; // Number of products per page
// const userData = [
//     { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
//     { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
//     { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
//     { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
//     { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
// ];

function UserTable() {
    const [users, setUsers] = useState([]);
    const [searchItem, setSearchItem] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const authToken = JSON.parse(localStorage.getItem('token'));

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchItem(term);
        const filtered = users.filter((user) => user.firstname.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));
        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page after search
    }
    const totalPages = Math.ceil(filteredUsers.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const currentProducts = filteredUsers.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);


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
    async function myFun() {
        try {
            const res = await axios.get(`${url}users/all`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);
            setUsers(res.data.data);
            setFilteredUsers(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        myFun();
    }, [])

    const handleInsert = () => {
        navigate('insert')
    }

    const handleDelete = async (userId) => {
        try {
            const res = await axios.delete(`${url}users/delete/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);

            // Update ProductData
            const updatedUsersData = users.filter((user) => user._id !== userId);
            setUsers(updatedUsersData);

            // Update filteredProducts dynamically
            setFilteredUsers(updatedUsersData.filter(
                (user) =>
                    user?.firstname.toLowerCase().includes(searchItem.toLowerCase()) ||
                    user?.email.toLowerCase().includes(searchItem.toLowerCase())
            ));
            toast.success('User Successfully Deleted!!')
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // Keep filteredProducts in sync with searchItem changes
        setFilteredUsers(
            users.filter(
                (user) =>
                    user?.firstname?.toLowerCase().includes(searchItem.toLowerCase()) ||
                    user?.email.toLowerCase().includes(searchItem.toLowerCase())
            )
        );
    }, [users, searchItem]);

    const handleUpdate = (id) => {
        navigate(`update/${id}`);
    }

    const handleChange = async (id, status) => {
        // console.log(id, status)
        try {
            const res = await axios.put(`${url}users/status/${id}?status=${status}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);
            if (res.status === 200) {
                myFun();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-semibold mb-4 text-gray-100'>Users</h2>
                    <div>
                        <div className="relative flex items-center gap-5">
                            <input type="text"
                                placeholder='Search users...'
                                className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                onChange={handleSearch} value={searchItem} />
                            <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                            <Button
                                radius="sm"
                                color="success"
                                variant="shadow"
                                className="outline-none focus:outline-none"
                                onClick={handleInsert}>
                                Insert
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Name
                                </th>

                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Email
                                </th>

                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Role
                                </th>

                                <th className='px-[53.5px] py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Status
                                </th>

                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-gray-700'>
                            {currentProducts.map((user) => {
                                return (
                                    <motion.tr key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <div className='flex-shrink-0 h-10 w-10'>
                                                    <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                                                        {user.firstname?.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='text-sm font-medium text-gray-100'>{user.firstname} {user.lastname}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-300'>
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className='px-2 inline-flex text-xs leading-5 font-semibold capitalize rounded-full bg-blue-800 text-blue-100'>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            {/* <span className={`px-2 inline-flex text-xs leading-5 font-semibold capitalize rounded-full ${user.status === "active" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}`} >
                                                {user.status}
                                            </span> */}
                                            <ToggleButtonGroup
                                                color="primary"
                                                value={user.status}
                                                exclusive
                                                onChange={(e, status) => handleChange(user._id, status)}
                                                aria-label="Platform"
                                                className='bg-transparent'
                                                style={{ display: 'flex', justifyContent: 'center' }}
                                            >
                                                <ToggleButton value="active" style={{
                                                    padding: '0px', marginRight: '7px', borderRadius: '20px', fontSize: '13px', paddingRight: '10px', paddingLeft: '10px', color: 'white', textTransform: 'capitalize', fontWeight: '500',
                                                    background: user?.status == "active" ? "green" : '', border: '2px solid green'
                                                }} className='focus:outline-none'>Active</ToggleButton>
                                                <ToggleButton value="inactive" style={{ padding: '0px', marginRight: '7px', borderRadius: '20px', fontSize: '13px', paddingRight: '10px', paddingLeft: '10px', color: 'white', textTransform: 'capitalize', fontWeight: '500', background: user?.status == "inactive" ? "#1D24CA" : '', border: '2px solid #1D24CA' }} className='focus:outline-none '>Inactive</ToggleButton>
                                                <ToggleButton value="block" style={{ padding: '0px', marginRight: '7px', borderRadius: '20px', fontSize: '13px', paddingRight: '10px', paddingLeft: '10px', color: 'white', textTransform: 'capitalize', fontWeight: '500', background: user?.status == "block" ? "red" : '', border: '2px solid red' }} className='focus:outline-none'>Block</ToggleButton>
                                            </ToggleButtonGroup>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            <Tooltip content={'Update'} color='secondary'>
                                                <button className='text-indigo-400 hover:text-indigo-300 bg-transparent p-2' onClick={() => handleUpdate(user?._id)}>
                                                    <Edit size={22} />
                                                </button>
                                            </Tooltip>

                                            <Tooltip content={'Delete'} color='danger'>
                                                <button className='text-red-400 hover:text-red-300 bg-transparent p-2' onClick={() => handleDelete(user?._id)}>
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
            </motion.div >
        </>
    )
}

export default UserTable