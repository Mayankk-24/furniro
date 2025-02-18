import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { MdOutlineShoppingCart } from "react-icons/md";
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

let url = import.meta.env.VITE_PUBLIC_URL;
function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [heart, setHeart] = useState(false);
    const [ProfileData, setProfileData] = useState();
    const authToken = localStorage.getItem('token');
    const { carts } = addCartsStore();
    const navigate = useNavigate();

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
                <div className='flex justify-center gap-5 lg:gap-20'>
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
                                                        Edit Profile
                                                    </button>
                                                </Link>
                                                <button className='bg-red-600 hover:bg-red-700  focus:outline-none text-white' onClick={handleLogout}>Logout</button>
                                            </div>
                                        </div>
                                    </PopoverBody>
                                </PopoverContent>
                            </PopoverRoot>
                            <RiSearch2Line size={24} />
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
                        </div>
                    )
                }
            </div>
            <Outlet />
        </>
    );
}

export default Header;
