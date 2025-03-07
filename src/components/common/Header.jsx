import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { MdOutlineShoppingCart, MdOutlineWallet } from "react-icons/md";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { RiAccountCircleLine, RiSearch2Line } from 'react-icons/ri';
import AddToCart from '../products/AddToCart';
import Badge from '@mui/material/Badge';
import {
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from 'axios';
import auth from '@/utils/Auth';
import addCartsStore from '@/manage/addCartsStore';
import { toast } from 'sonner';
import { Icon } from '@iconify/react/dist/iconify.js';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import Sidebar from './Sidebar';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
} from "@heroui/react";

let url = import.meta.env.VITE_PUBLIC_URL;
function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [heart, setHeart] = useState(false);
    const [ProfileData, setProfileData] = useState();
    const authToken = localStorage.getItem('token');
    const { carts } = addCartsStore();
    const navigate = useNavigate();
    const [Amount, setAmount] = useState();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const LinkNames = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    const getProfileData = async () => {
        const authData = await auth();
        try {
            const res = await axios.get(`${url}account/profile`, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            });
            setProfileData(res.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProfileData();
    }, [])

    const handleLogout = async () => {
        const authToken = await auth();
        try {
            const res = await axios.put(`${url}logout`, {}, {
                'headers': {
                    'Authorization': `Bearer ${authToken.token}`
                }
            });
            console.log(res.data);
            if (res.status === 200) {
                toast.success('Successfully logout');
                navigate('/signin');
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div>
                {isCartOpen && (
                    <AddToCart onClose={() => setIsCartOpen(!isCartOpen)} />
                )}
            </div>
            <div className='bg-white w-full py-4 px-5 md:px-12 flex items-center justify-between'>
                <div id='left-sec' className='flex items-center'>
                    <img
                        src="/Assets/Meubel House_Logos-05.png"
                        alt="#"
                        className='h-8 mr-2'
                    />
                    <h2 className='font-bold text-3xl text-black'>Furniro</h2>
                </div>
                <div className='hidden md:flex justify-center gap-5 lg:gap-20'>
                    {LinkNames.map((link, index) => (
                        <Link
                            to={link.path}
                            key={index}
                            className='text-black hover:text-gray-500'
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                {
                    !authToken ? (
                        <div>
                            <Link to={'/signin'} className='text-white hover:text-white '>
                                <button className='bg-blue-700 focus:outline-none text-white py-1'>
                                    SignIn
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className='flex items-center gap-5 lg:gap-14'>
                            {/* Profile */}
                            <PopoverRoot>
                                <PopoverTrigger asChild>
                                    <RiAccountCircleLine size={24} />
                                </PopoverTrigger>
                                <PopoverContent width={'340px'}>
                                    <PopoverArrow />
                                    <PopoverBody width={'340px'}>
                                        <PopoverTitle fontWeight="medium" fontSize={'20px'}>Your Profile</PopoverTitle>
                                        <div className='mt-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='size-14 bg-gray-700 rounded-full'>
                                                    <img src={ProfileData?.image} alt="#" className='size-full rounded-full object-cover' />
                                                </div>
                                                <div>
                                                    <h3 className='text-gray-600 font-semibold text-base'>{ProfileData?.firstname || 'user not found'} {ProfileData?.lastname}</h3>
                                                    <p className='text-gray-500 text-sm'>{ProfileData?.email || "email not found"}</p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-3 mt-5'>
                                                <Link to={'/edituser'} className='text-white hover:text-white outline-none'>
                                                    <button className='bg-blue-600 hover:bg-blue-700 focus:outline-none outline-none text-white'>
                                                        Settings
                                                    </button>
                                                </Link>
                                                <button className='bg-red-600 hover:bg-red-700  focus:outline-none text-white' onClick={handleLogout}>Logout</button>
                                            </div>
                                        </div>
                                    </PopoverBody>
                                </PopoverContent>
                            </PopoverRoot>
                            {/* Wallet */}
                            <PopoverRoot>
                                <PopoverTrigger asChild>
                                    <MdOutlineWallet size={24} className="cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-4 bg-white shadow-lg rounded-lg">
                                    <PopoverArrow />
                                    <PopoverBody>
                                        <PopoverTitle className="text-lg font-semibold flex items-center gap-2">
                                            Your Wallet
                                        </PopoverTitle>

                                        {/* Wallet Balance */}
                                        <div className="mt-3 p-4 bg-blue-50 border border-blue-300 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-500">Available Balance</p>
                                                <h3 className="text-xl font-bold text-blue-700 flex items-center">
                                                    <FaIndianRupeeSign size={14} className="mr-1" />
                                                    {ProfileData?.walletBalance || "0.00"}
                                                </h3>
                                            </div>
                                            <Icon icon="ph:wallet-bold" className="text-blue-600" width={30} />
                                        </div>

                                        {/* Recent Transactions */}
                                        {/* <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-600 mb-2">Recent Transactions</p>
                                            <div className="max-h-40 overflow-y-auto space-y-2">
                                                {fakeTransactions.length > 0 ? (
                                                    fakeTransactions.slice(0, 5).map((txn, index) => (
                                                        <div key={txn.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                                            <div className="flex items-center gap-2">
                                                                <Icon
                                                                    icon={txn.type === "credit" ? "mdi:plus-circle" : "mdi:minus-circle"}
                                                                    className={txn.type === "credit" ? "text-green-500" : "text-red-500"}
                                                                    width={20}
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium">{txn.description}</p>
                                                                    <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <p className={`text-sm font-medium ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                                                                {txn.type === "credit" ? "+" : "-"} ₹{txn.amount}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-gray-500 py-4">
                                                        <Icon icon="mdi:bank-off-outline" width={30} />
                                                        <p className="text-sm mt-2">No transactions found</p>
                                                    </div>
                                                )}
                                            </div>

                                            {fakeTransactions.length > 5 && (
                                                <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                                                    View All Transactions
                                                </button>
                                            )}
                                        </div> */}

                                        {/* Action Buttons */}
                                        <div className="flex justify-between mt-4">
                                            <button className="bg-green-600 text-white px-3 py-2 focus:outline-none rounded-md text-sm hover:bg-green-700" onClick={onOpen}>
                                                Add Money
                                            </button>
                                            <button className="bg-red-600 text-white px-3 py-2 focus:outline-none rounded-md text-sm hover:bg-red-700">
                                                Withdraw
                                            </button>
                                        </div>
                                    </PopoverBody>
                                </PopoverContent>
                            </PopoverRoot>
                            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xs'>
                                <ModalContent>
                                    {(onClose) => (
                                        <>
                                            <ModalHeader className="flex items-center gap-2">Add Money <Icon icon="emojione:money-bag" width="30" height="30" /></ModalHeader>
                                            <ModalBody>
                                                <Input label="Amount" type="text"
                                                    variant='bordered'
                                                    endContent={<FaIndianRupeeSign size={14} className="mr-1" />}
                                                    labelPlacement='outside'
                                                    placeholder='Enter Your Amount'
                                                    value={Amount}
                                                    onChange={(e) => setAmount(e.target.value)} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" className='focus:outline-none'>
                                                    Proceed to pay
                                                </Button>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                            {heart ? (
                                <FaHeart
                                    size={24}
                                    onClick={() => setHeart(!heart)}
                                    color='red'
                                />
                            ) : (
                                <FaRegHeart size={24} onClick={() => setHeart(!heart)} />
                            )}
                            <Badge badgeContent={carts?.length || 0} color="error">
                                <MdOutlineShoppingCart
                                    size={24}
                                    onClick={() => setIsCartOpen(true)}
                                />
                            </Badge>
                            <Sidebar />
                        </div>
                    )
                }
            </div>
            <Outlet />
        </>
    );
}

export default Header;
