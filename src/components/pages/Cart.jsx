import React, { useEffect, useState, useRef } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { LuChevronRight } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../common/Footer';
import Services from '../common/Services';
import axios from 'axios';
import { toast } from 'sonner';
import { Skeleton } from '@nextui-org/react';
import auth from '@/utils/Auth';
import addCartsStore from '@/manage/addCartsStore';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardHeader, CardBody, Divider, CardFooter, Button, ButtonGroup } from "@heroui/react";
import { MdDelete } from 'react-icons/md';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { FaMinus } from 'react-icons/fa';

const url = import.meta.env.VITE_PUBLIC_URL;

function Cart() {
    const [cart, setCart] = useState([]);
    // const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const hasFetched = useRef(false); // Ref to ensure we fetch data only once
    const [orderPlaced, setOrderPlaced] = useState();
    const { removeCart } = addCartsStore();
    const [Quantity, setQuantity] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            // Check if an order has already been placed in localStorage
            // const orderPlaced = localStorage.getItem('orderPlaced');
            if (hasFetched.current || orderPlaced) return;

            hasFetched.current = true; // Set flag immediately to avoid double execution

            const authData = await auth();
            try {
                // const localCart = JSON.parse(localStorage.getItem('carts'));
                // if (!localCart) {
                //     toast.error('No items in cart');
                //     setLoading(false);
                //     return;
                // }
                // Place the order
                const response = await axios.get(`${url}order/single`, {
                    headers: {
                        'Authorization': `Bearer ${authData.token}`,
                    },
                });
                console.log(response.data.order);
                setCart(response.data.order);
                const quantities = response.data.order.map(item => item.quantity);
                setQuantity(quantities);
                // Mark the order as placed in localStorage
                // localStorage.setItem('orderPlaced', 'true');
                setOrderPlaced(true);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch cart');
            } finally {
                // setLoading(false); // Always update loading state
            }
        };

        fetchCart();
    }, [url]);
    const handleDelete = async (id, productId,p_name) => {
        const authData = await auth();
        try {
            const response = await axios.delete(`${url}order/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                },
            });
            const updatedCart = cart.filter((item) => item?._id !== id);
            setCart(updatedCart);
            removeCart(p_name);
            toast.success('Cart deleted successfully', { duration: 3000 });
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete cart');
        }
    };

    const handleCheckout = (id) => {
        if (!id) {
            navigate('/checkout');
        } else {
            console.log("Item already in checkout list");
            navigate('/checkout');
        }
    };

    const handleQuantityChange = (index, type) => {
        setQuantity(prevQuantities => {
            const newQuantities = [...prevQuantities];

            if (type === 'increment') {
                newQuantities[index] += 1;
            } else if (type === 'decrement' && newQuantities[index] > 0) {
                newQuantities[index] -= 1;
            }

            return newQuantities;
        });
    };
    // Render loading skeleton if cart is loading
    // if (loading) {
    //     return (
    //         <div className='w-full py-16'>
    //             <Skeleton className='w-full h-full rounded-lg' />
    //         </div>
    //     );
    // }

    return (
        <>
            <div className='w-full bg-cover' style={{ backgroundImage: 'url("/Assets/Rectangle 1.png")', height: '316px' }}>
                <div className='flex items-center justify-center h-full'>
                    <div>
                        <div className='flex justify-center mb-3'>
                            <img src="/Assets/Meubel House_Logos-05.png" alt="Logo" />
                        </div>
                        <h2 className='text-center text-black text-5xl font-medium mb-4'>Cart</h2>
                        <div className='flex items-center justify-center'>
                            <Link to={'/'} className='text-black text-base font-medium' >Home</Link>
                            <LuChevronRight className='mx-2' size={'18px'} color='black' />
                            <span>Cart</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='py-14 px-16'>
                <div className='flex flex-col gap-y-5 md:flex-row justify-center'>
                    <div className='w-full md:w-3/4 mr-9'>
                        <Table aria-label="Example static collection table" classNames={{
                            th: 'bg-[#F9F1E7] text-black',
                            wrapper: [
                                'overflow-x-auto'
                            ]
                        }}>
                            <TableHeader>
                                <TableColumn></TableColumn>
                                <TableColumn>Product</TableColumn>
                                <TableColumn>Price</TableColumn>
                                <TableColumn>Quantity</TableColumn>
                                <TableColumn>Subtotal</TableColumn>
                                <TableColumn></TableColumn>
                            </TableHeader>
                            {/* <TableBody>
                                {cart && cart.length > 0 ? (
                                    cart.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <img src={item.image} alt="" className='size-20 rounded-lg' />
                                            </TableCell>
                                            <TableCell className='text-[#9F9F9F] font-normal'>{item.name}</TableCell>
                                            <TableCell className='text-[#9F9F9F] font-normal'>Rs. {item.price}</TableCell>
                                            <TableCell>
                                                <ButtonGroup>
                                                    <Button isIconOnly size='sm' className='bg-transparent border-1 focus:outline-none' variant='bordered' onPress={() => handleQuantityChange(index, 'decrement')} isDisabled={Quantity[index] == 0}><FiMinus size={16} />
                                                    </Button>
                                                    <div className='bg-[#919eab14] w-fit py-1.5 px-3'>
                                                        {Quantity[index]}
                                                    </div>
                                                    <Button isIconOnly size='sm' className='bg-transparent border-1 focus:outline-none' variant="bordered" onPress={() => handleQuantityChange(index, 'increment')}isDisabled={Quantity[index] == 15}><FiPlus size={16} /></Button>
                                                </ButtonGroup>
                                            </TableCell>
                                            <TableCell>Rs. {(item.price * item.quantity).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <button className='p-1 rounded-full bg-transparent hover:bg-gray-200/30 transition-background focus:outline-none' onClick={() => handleDelete(item?._id, item?.productId)}><img src="/Assets/Delete.svg" alt="" className='size-5' /></button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell className='px-10'></TableCell>
                                        <TableCell className='px-14'></TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex flex-col items-center justify-center">
                                                <img src="/Assets/ic-cart.svg" alt="Empty Cart" className='h-36 w-36' />
                                                <h2 className='text-[#919EAB] text-2xl font-medium mb-4'>
                                                    Cart is empty!
                                                </h2>
                                                <p className='text-[#919EAB] text-sm font-medium mb-4'>
                                                    Looks like you have no items in your shopping cart.
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className='px-5'></TableCell>
                                        <TableCell className='px-5'></TableCell>
                                        <TableCell className='px-5'></TableCell>
                                    </TableRow>
                                )}
                            </TableBody> */}
                            <TableBody emptyContent={<div className="flex flex-col items-center justify-center">
                                <img src="/Assets/ic-cart.svg" alt="Empty Cart" className='h-36 w-36' />
                                <h2 className='text-[#919EAB] text-2xl font-medium mb-4'>
                                    Cart is empty!
                                </h2>
                                <p className='text-[#919EAB] text-sm font-medium mb-4'>
                                    Looks like you have no items in your shopping cart.
                                </p>
                            </div>}>
                                {cart.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <img src={item.image} alt="" className='size-20 rounded-lg' />
                                        </TableCell>
                                        <TableCell className='text-[#9F9F9F] font-normal'>{item.name}</TableCell>
                                        <TableCell className='text-[#9F9F9F] font-normal'>Rs. {item.price}</TableCell>
                                        <TableCell>
                                            <ButtonGroup>
                                                <Button isIconOnly size='sm' className='bg-transparent border-1 focus:outline-none' variant='bordered' onPress={() => handleQuantityChange(index, 'decrement')} isDisabled={Quantity[index] == 0}><FiMinus size={16} />
                                                </Button>
                                                <div className='bg-[#919eab14] w-fit py-1.5 px-3'>
                                                    {Quantity[index]}
                                                </div>
                                                <Button isIconOnly size='sm' className='bg-transparent border-1 focus:outline-none' variant="bordered" onPress={() => handleQuantityChange(index, 'increment')} isDisabled={Quantity[index] == 15}><FiPlus size={16} /></Button>
                                            </ButtonGroup>
                                        </TableCell>
                                        <TableCell>Rs. {(item.price * item.quantity).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <button className='p-1 rounded-full bg-transparent hover:bg-gray-200/30 transition-background focus:outline-none' onClick={() => handleDelete(item?._id, item?.productId, item?.name)}><img src="/Assets/Delete.svg" alt="" className='size-5' /></button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div>
                        <Card className='w-[393px] bg-[#F9F1E7] h-fit px-10 shadow-md pb-3'>
                            <CardHeader className='flex justify-center'>
                                <h2 className='text-black text-[32px] font-semibold text-center'>Cart Totals</h2>
                            </CardHeader>
                            <CardBody>
                                <div className='flex items-center justify-between mb-5'>
                                    <h4 className='font-medium text-base text-black'>Subtotal</h4>
                                    <h2 className='text-[#9F9F9F] text-base'>Rs. {' '}
                                        {cart && cart?.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString('en-IN')}
                                    </h2>
                                </div>
                                <div className='flex items-center justify-between mb-5'>
                                    <h4 className='font-medium text-base text-black'>Discount</h4>
                                    <h2 className='text-[#9F9F9F] text-base'>Rs. 0</h2>
                                </div>
                                <div className='flex items-center justify-between mb-5'>
                                    <h4 className='font-medium text-base text-black'>Shipping</h4>
                                    <h2 className='text-[#9F9F9F] text-base'>Free
                                    </h2>
                                </div>
                                <Divider />
                                <div className='flex items-center justify-between pt-2'>
                                    <h4 className='font-medium text-base text-black'>Total</h4>
                                    <h2 className='text-primary text-xl font-medium'>Rs. {' '}
                                        {cart && cart?.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString('en-IN')}
                                    </h2>
                                </div>
                                <div className='flex items-center justify-between pt-8'>
                                    <div className='flex justify-between items-center w-full border border-gray-600/50 hover:border-black py-2 px-3.5 rounded-lg'>
                                        <span className='text-[#1c252e] font-medium'>DISCOUNT50</span>
                                        <button className='py-1 px-2 bg-transparent text-[#00A76F] hover:bg-[#00a76f17] transition-background duration-300 font-medium focus:outline-none'>Apply</button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <div className='flex justify-center mt-5'>
                            <button className='text-black  w-full px-12 py-3 bg-transparent hover:bg-gray-200/50 transition-background  border-1 rounded-lg border-black' onClick={() => handleCheckout(cart._id)}>
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Services />
            <Footer />
        </>
    );
}

export default Cart;
