import addCartsStore from '@/manage/addCartsStore';
import auth from '@/utils/Auth';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useState } from 'react'
import { FaHeart, FaShareAlt, FaExchangeAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


let url = import.meta.env.VITE_PUBLIC_URL;
function ProductCard({ img, title, des, price, disprice, discount, Cid }) {
    const IconsName = [
        { name: 'Share', icon: FaShareAlt },
        { name: 'Compare', icon: FaExchangeAlt },
        { name: 'Like', icon: FaHeart },
    ];
    const { addCart, carts } = addCartsStore();
    const navigate = useNavigate();
    const handlePhotoClick = (PicId) => {
        // console.log(PicId);
        navigate(`/shop/product/${PicId}`);
    }

    const HandleAddToCart = async (CartId, ProductName) => {
        const authData = await auth();
        try {
            const res = await axios.post(`${url}cart/direct/${CartId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                }
            });
            console.log(res.data);
            if (res.status === 200) {
                toast.success('Product Added to Cart!!', { duration: 1000 });
                const addCartList = {
                    id: CartId,
                    ProductName: ProductName,
                }
                const isAlreadyInCart = carts.some(cart => cart.id === CartId);
                if (!isAlreadyInCart) {
                    addCart(addCartList);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            {/* w-[310px] */}
            <motion.div initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -10 }}
                className='cards relative rounded-md w-[310px]' style={{ backgroundColor: 'rgba(244, 245, 247, 1)' }}>
                {discount && (
                    discount === 'New' ? (
                        <div
                            className="absolute h-12 w-12 rounded-full right-6 top-5 text-white flex items-center justify-center"
                            style={{ backgroundColor: '#2EC1AC' }}>
                            {discount}
                        </div>
                    ) : (
                        <div
                            className="absolute h-12 w-12 rounded-full right-6 top-5 text-white flex items-center justify-center"
                            style={{ backgroundColor: '#E97171' }}>
                            -{discount}%
                        </div>
                    )
                )}

                <img src={img} alt="#" className='object-cover w-full h-52 lg:h-80 rounded-t-md' />

                <div id="overlay" className='absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-md' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className='flex flex-col gap-3 justify-center'>
                        <button className="add-to-cart bg-white rounded-none px-14 py-3 text-primary text-base font-semibold focus:outline-none" onClick={() => HandleAddToCart(Cid, title)}>Add to cart</button>
                        <button className="add-to-cart bg-white rounded-none px-14 py-3 text-primary text-base font-semibold focus:outline-none" onClick={() => handlePhotoClick(Cid)}>Info</button>
                    </div>
                    <div className="action-icons flex mt-5">
                        {
                            IconsName.map((item, index) => {
                                return (
                                    <div key={index} className='flex items-center'>
                                        <item.icon color='white' className='mr-1' />
                                        <span className='text-white mr-4'>{item.name}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="product-info p-4 px-6 rounded-b-md" style={{ backgroundColor: 'rgba(244, 245, 247, 1)' }}>
                    <h3 className='text-3xl font-semibold capitalize' style={{ color: 'rgba(58, 58, 58, 1)' }}>{title}</h3>
                    <p style={{ color: 'rgba(137, 137, 137, 1)' }} className='text-base font-medium mt-1 mb-3 capitalize'>{des}</p>
                    <div className="price flex items-center mb-2">
                        <span style={{ color: 'rgba(58, 58, 58, 1)' }} className='text-xl font-semibold mr-4'>Rp {discount && discount <= 50 ? disprice : price}</span>
                        {disprice && <span style={{ color: 'rgba(176, 176, 176, 1)' }} className='text-lg font-normal line-through'>{discount <= 50 ? price : disprice}</span>}
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default ProductCard