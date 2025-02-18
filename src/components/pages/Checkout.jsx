import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { LuChevronRight } from 'react-icons/lu'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../common/Footer';
import Services from '../common/Services';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { CircularProgress, image } from '@nextui-org/react';
import { Button } from '@heroui/react';
import * as Yup from 'yup';
import auth from '@/utils/Auth';
import { toast } from 'sonner';

let url = import.meta.env.VITE_PUBLIC_URL;
function Checkout() {
    const [Select, setSelect] = useState(0);
    const [Checkout, setCheckout] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [Total, setTotal] = useState();
    const formikRef = useRef(null);
    const navigate = useNavigate();

    const toggle = (index) => {
        setSelect(Select === index ? null : index);
    }
    const myFun = async () => {
        const authData = await auth();
        const response = await axios.get(`${url}billing/orderitems`, {
            headers: {
                'Authorization': `Bearer ${authData.token}`
            }
        });
        console.log(response.data);
        setCheckout(response.data.data);
        const total = response.data.total;
        setTotal(total);
    }
    useEffect(() => {
        myFun();
    }, [])


    const initialValues = {
        firstname: '',
        lastname: '',
        company: '',
        country: '',
        street_address: '',
        city: '',
        province: '',
        zipcode: '',
        phone: '',
        email: '',
        additional: '',
    }
    const loadRazorpay = async () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    };

    useEffect(() => {
        loadRazorpay();
    }, []);
    const onSubmit = async (value) => {
        console.log(value);
        // let stripe = await loadStripe("pk_test_51PusNECHOQZoLRUR3OI6nBwxvIdHcw1nuzlL1atjjlkAW4bB0hOxfXbp1tT2AnXWMQK5ay2iXqcWSknlYbWQOrcm00baZGQt92");
        // try {
        //     setLoading(true);
        //     console.log("RESPONSE")
        //     const res = await axios.post(`${url}billing/payment/${check}`, value);
        //     console.log("RESPONSE")
        //     setLoading(false);
        //     console.log(res.data);
        //     const sessionId = res?.data?.sessionId;

        //     // Set sessionId in the state   
        //     setSession(sessionId);
        //     console.log(sessionId);
        //     // console.log(Session?.paymentResponse?.sessionId);/

        //     const result = stripe.redirectToCheckout({ sessionId })
        //     if (result.error) {
        //         console.log(result.error)
        //     }

        // } catch (error) {
        //     setLoading(false);
        //     console.log(error)
        // }

        setLoading(true);
        const authData = await auth();
        try {
            // **Step 1: Create Order in Backend**
            const orderResponse = await axios.post(`${url}billing/payment`, value, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            });
            console.log(orderResponse.data);
            const orderId = orderResponse.data.paymentResponse?.orderId;
            const amount = orderResponse.data.paymentResponse?.amount;
            // **Step 2: Initialize Razorpay**
            const options = {
                key: "rzp_test_MxS2jZpZhwd7kV", // Replace with Razorpay Key
                amount: amount,
                currency: "INR",
                name: "furniro",
                image: '/Assets/Meubel House_Logos-05.png',
                description: "Purchase Order",
                order_id: orderId,
                handler: async function (response) {
                    console.log(`Payment ID: ${response.razorpay_payment_id}`);
                    console.log(`Order ID: ${response.razorpay_order_id}`);

                    // **Step 3: Verify Payment in Backend**
                    // await axios.post(`${url}billing/verify-payment`, {
                    //     ...response,
                    // });
                    try {
                        console.log("Payment Success:", response);
                        navigate(`/thanks`);
                        setLoading(false);
                    } catch (error) {
                        console.error("Error handling response:", error);
                        setLoading(false);
                    }
                },
                prefill: {
                    name: `${value.firstname} ${value.lastname}`,
                    email: value.email,
                    contact: value.phone,
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: { color: "#3399cc" },
            };
            setLoading(false);
            const paymentObject = new window.Razorpay(options);
            paymentObject.on("payment.failed", function (response) {
                console.error("Payment Failed:", response.error);
            });
            paymentObject.open();
            // if (orderResponse.data.paymentResponse.status === 500) {
            //     toast.error('Invalid Order ID');
            // } else {

            // }
        } catch (error) {
            console.error("Payment Failed", error);
            setLoading(false);
        }
    }

    const validationSchema = Yup.object({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        company: Yup.string().required('company is required'),
        country: Yup.string().required('country is required'),
        street_address: Yup.string().required('street address is required'),
        city: Yup.string().required('city is required'),
        province: Yup.string().required('province is required'),
        zipcode: Yup.string().required('zipcode is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        additional: Yup.string().required('additional is required'),
    })
    return (
        <>
            <div className='w-full bg-cover' style={{ backgroundImage: 'url("/Assets/Rectangle 1.png")', height: '316px' }}>
                <div className='flex items-center justify-center h-full w-full'>
                    <div>
                        <div className='flex justify-center mb-3'>
                            <img src="/Assets/Meubel House_Logos-05.png" alt="#" />
                        </div>
                        <h2 className='text-center text-black text-5xl font-medium mb-4'>Checkout</h2>
                        <div className='flex items-center justify-center'>
                            <Link to={'/'} className='text-black text-base font-medium' >Home</Link>
                            <LuChevronRight className='mx-2' size={'18px'} color='black' />
                            <span>Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='px-24 py-24 flex flex-col md:flex-row justify-evenly'>
                <div className='w-full md:w-2/5'>
                    <h2 className='text-4xl font-semibold text-black mb-10'>Billing details</h2>
                    <div>
                        <Formik initialValues={initialValues}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                            innerRef={formikRef} >
                            {({ touched, errors }) => (
                                <Form>
                                    <div className='flex gap-5'>
                                        <div className='w-full'>
                                            <label htmlFor="" className='text-black'>First Name</label><br />
                                            <Field type='text' name='firstname' className={`border ${touched.firstname && errors.firstname ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-4`} />
                                            <ErrorMessage name="firstname" component="div" className="text-red-500 font-semibold text-xs" />
                                        </div>
                                        <div className='w-full'>
                                            <label htmlFor="" className='text-black'>Last Name</label><br />
                                            <Field type='text' name='lastname' className={`border ${touched.lastname && errors.lastname ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-4`} />
                                            <ErrorMessage name="lastname" component="div" className="text-red-500 font-semibold text-xs" />
                                        </div>
                                    </div>
                                    <div className='mt-7'>
                                        <label htmlFor="" className='text-black'>Company Name (Optional)
                                        </label><br />
                                        <Field type='text' name='company' className={`border ${touched.company && errors.company ? 'border-red-500' : 'border-gray-400'}  py-3 rounded-lg mt-4 w-full px-4`} />
                                        <ErrorMessage name="company" component="div" className="text-red-500 font-semibold text-xs" />
                                    </div>
                                    <div className='mt-7'>
                                        <label htmlFor="" className='text-black'>Country / Region
                                        </label><br />
                                        <Field as='select' name="country" id="country" className={`border ${touched.country && errors.country ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-5 text-gray-500`}>
                                            <option value="india">India</option>
                                            <option value="srilanka">Sri Lanka</option>
                                            <option value="usa">USA</option>
                                            <option value="england">England</option>
                                        </Field>
                                        <ErrorMessage name="country" component="div" className="text-red-500 font-semibold  text-xs" />
                                    </div>
                                    <div className='mt-7'>
                                        <label htmlFor="" className='text-black'>Street address
                                        </label><br />
                                        <Field type='text' name='street_address' className={`border ${touched.street_address && errors.street_address ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-4`} />
                                        <ErrorMessage name="street_address" component="div" className="text-red-500 font-semibold  text-xs" />
                                    </div>
                                    <div className='mt-7'>
                                        <label htmlFor="" className='text-black'>Town / City
                                        </label><br />
                                        <Field type='text' name='city' className={`border ${touched.city && errors.city ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-4`} />
                                        <ErrorMessage name="city" component="div" className="text-red-500 font-semibold  text-xs" />
                                    </div>
                                    <div className='mt-7'>
                                        <label htmlFor="" className='text-black'>Province
                                        </label><br />
                                        <Field as='select' name="province" id="country" className={`border ${touched.province && errors.province ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-5 text-gray-500`}>
                                            <option value="Western Province">Western Province</option>
                                            <option value="Northern Province">Northern Province</option>
                                            <option value="Eastern Province">Eastern Province</option>
                                            <option value="Southern Province">Southern Province</option>
                                        </Field>
                                        <ErrorMessage name="province" component="div" className="text-red-500 font-semibold text-xs" />
                                    </div>
                                    <div className='mt-7'>
                                        <label htmlFor="" className='text-black'>ZIP code
                                        </label><br />
                                        <Field type='text' name='zipcode' className={`border ${touched.zipcode && errors.zipcode ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-4`} />
                                        <ErrorMessage name="zipcode" component="div" className="text-red-500 font-semibold  text-xs" />
                                    </div>
                                    <div className='mt-7'>
                                        <label htmlFor="" className='text-black'>Phone
                                        </label><br />
                                        <Field type='phone' name='phone' className={`border ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-4`} />
                                        <ErrorMessage name="phone" component="div" className="text-red-500 font-semibold  text-xs" />
                                    </div>
                                    <div className='mt-7'>
                                        <label htmlFor="" className='text-black'>Email address
                                        </label><br />
                                        <Field type='email' name='email' className={`border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-4`} />
                                        <ErrorMessage name="email" component="div" className="text-red-500 font-semibold  text-xs" />
                                    </div>
                                    <div className='mt-7'>
                                        <Field type='text' name='additional' className={`border ${touched.additional && errors.additional ? 'border-red-500' : 'border-gray-400'} py-3 rounded-lg mt-4 w-full px-4`}
                                            placeholder='Additional information' />
                                        <ErrorMessage name="additional" component="div" className="text-red-500 font-semibold text-xs" />
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                <div className='px-10 pt-16 ml-0 md:ml-20 h-fit w-full md:w-2/5'>
                    <div className='border-b-2'>
                        <div className='flex justify-between items-center mb-5'>
                            <h2 className='text-2xl text-black font-medium'>Product</h2>
                            <h2 className='text-2xl text-black font-medium'>Subtotal</h2>
                        </div>
                        {
                            Checkout?.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className='flex justify-between items-center mb-5'>
                                            <div className='flex items-center gap-5'>
                                                <h2 className='text-base text-[#9F9F9F] font-medium'>{item.name}</h2>
                                                <span className='text-black'>X</span>
                                                <span className='text-black'>{item.quantity}</span>
                                            </div>
                                            <h2 className='text-black'>Rs. {(item.price)?.toLocaleString()}
                                                {/* {Checkout.reduce((total, pro) => total + pro.quantity * pro.price, 0).toLocaleString()} */}
                                            </h2>
                                        </div>
                                        <div className='flex justify-between items-center mb-5'>
                                            <h2 className='text-base text-black font-medium'>Subtotal</h2>
                                            <h2 className='text-black'>Rs. {(item.subtotal)?.toLocaleString()}</h2>
                                        </div>
                                    </div>
                                );
                            })

                        }
                        < div className='flex justify-between items-center mb-10'>
                            <h2 className='text-base text-black font-medium'>Total</h2>
                            <h2 className='text-primary text-2xl font-bold'>Rs. {Total?.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className='py-5'>
                        <div className='mb-5'>
                            <div className='flex items-center gap-4 mb-5'>
                                <div className={`h-4 w-4 rounded-full ${Select === 0 ? "bg-black" : "bg-transparent border-2"}`} onClick={() => toggle(0)}></div>
                                <h2 className={`text-base  ${Select === 0 ? "text-black" : "text-gray-400"}`}>Direct Bank Transfer</h2>
                            </div>
                            {Select === 0 && (<div>
                                <p className='text-[#9F9F9F] text-justify'>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                            </div>)}
                        </div>
                        <div className='mb-5'>
                            <div className='flex items-center gap-4 mb-5'>
                                <div className={`h-4 w-4 rounded-full ${Select === 1 ? "bg-black" : "bg-transparent border-2"}`} onClick={() => toggle(1)}></div>
                                <h2 className={`text-base ${Select === 1 ? "text-black" : "text-gray-400"}`}>Credit & Debit Cards</h2>
                            </div>
                            {Select === 1 && (<div>
                                <p className='text-[#9F9F9F] text-justify'>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                            </div>)}
                        </div>
                        <div className='mb-5'>
                            <div className='flex items-center gap-4 mb-5'>
                                <div className={`h-4 w-4 rounded-full ${Select === 2 ? "bg-black" : "bg-transparent border-2"}`} onClick={() => toggle(2)}></div>
                                <h2 className={`text-base ${Select === 2 ? "text-black" : "text-gray-400    "}`}>Cash On Delivery</h2>
                            </div>
                            {Select === 2 && (<div>
                                <p className='text-[#9F9F9F] text-justify'>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                            </div>)}
                        </div>
                        <div className='mt-7'>
                            <p className='text-black text-justify'>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <span className='font-semibold text-black text-justify'>privacy policy.</span></p>
                            <div className='text-center mt-8 '>
                                {/* <button type='submit' className='text-xl px-14 py-2 text-black focus:outline-none bg-transparent border-1 border-black' onClick={() => formikRef.current?.handleSubmit('123')}>{Loading ? "Processing..." : "Place order"}</button> */}
                                <Button className='border-2 border-black focus:outline-none px-20 py-2 bg-transparent' size='lg' variant='bordered' isLoading={Loading} onPress={() => formikRef.current?.handleSubmit('123')}>Place order</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Services />
            <Footer />
        </>
    )
}

export default Checkout