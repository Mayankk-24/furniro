import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { lazy, Suspense } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'
import { LuChevronRight } from 'react-icons/lu'
import { MdLocationPin, MdOutlineAccessTimeFilled } from 'react-icons/md'
import { Link } from 'react-router-dom'
import Services from '../common/Services'
import Footer from '../common/Footer'
import axios from 'axios'
import { toast } from 'sonner'
import * as Yup from 'yup'
import MapContainer from '../common/MapContainer'
import { Skeleton } from '@heroui/react'
import { LoadScript } from '@react-google-maps/api'

let url = import.meta.env.VITE_PUBLIC_URL;
function Contact() {
    const initialValues = {
        name: '',
        email: '',
        subject: '',
        msg: '',
    };

    const onSubmit = async (value, { resetForm }) => {
        console.log(value);
        try {
            const res = await axios.post(`${url}contact/add`, value);
            console.log(res.data);
            toast.success("Message sent successfully");
            resetForm();
        } catch (error) {
            console.log(error)
        }
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        subject: Yup.string().required('Subject is required'),
        msg: Yup.string().required('Message is required'),
    });


    // const SkeletonLoader = () => (
    //     <div className="w-full h-[600px] bg-gray-200 animate-pulse rounded-lg"></div>
    // );
    return (
        <>
            <div className='w-full bg-cover' style={{ backgroundImage: 'url("/Assets/Rectangle 1.png")', height: '316px' }}>
                <div className='flex items-center justify-center h-full'>
                    <div>
                        <div className='flex justify-center mb-3'>
                            <img src="/Assets/Meubel House_Logos-05.png" alt="#" />
                        </div>
                        <h2 className='text-center text-black text-5xl font-medium mb-4'>Contact</h2>
                        <div className='flex items-center justify-center'>
                            <Link to={'/'} className='text-black text-base font-medium' >Home</Link>
                            <LuChevronRight className='mx-2' size={'18px'} color='black' />
                            <span>Contact</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='py-16'>
                <h2 className='text-4xl text-black font-semibold text-center mb-3'>Get In Touch With Us</h2>
                <p className='text-[#9F9F9F] text-center'>For More Information About Our Product & Services. Please Feel Free To Drop Us <br /> An Email. Our Staff Always Be There To Help You Out. Do Not Hesitate!</p>
            </div>

            <div className='px-32 py-16 flex'>
                <div className='py-10 px-10 w-1/2'>
                    <div className='flex gap-5 mb-8'>
                        <div className='pt-0.5'>
                            <MdLocationPin size={30} color='black' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-medium text-black mb-2'>Address</h2>
                            <p className='text-black'>236 5th SE Avenue, New <br /> York NY10000, United <br />States</p>
                        </div>
                    </div>
                    <div className='flex gap-5 mb-8'>
                        <div className='pt-1'>
                            <FaPhoneAlt size={25} color='black' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-medium text-black mb-2'>Phone</h2>
                            <p className='text-black'>Mobile: +(84) 546-6789 <br />
                                Hotline: +(84) 456-6789</p>
                        </div>
                    </div>
                    <div className='flex gap-5 mb-8'>
                        <div className='pt-1'>
                            <MdOutlineAccessTimeFilled size={25} color='black' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-medium text-black mb-2'>Working Time </h2>
                            <p className='text-black'>Monday-Friday: 9:00 <br /> - 22:00 <br />
                                Saturday-Sunday: 9:00 <br /> - 21:00</p>
                        </div>
                    </div>
                </div>
                <div className='w-1/2'>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}>
                        <Form>
                            <div className='mb-6'>
                                <label htmlFor="" className='text-black'>Your name</label> <br />
                                <Field type="text" name='name' placeholder='abc' className='border-1 rounded-lg w-full py-3 px-5 mt-4' />
                                <ErrorMessage className='text-xs mt-1 text-red-600 font-semibold' name="name" component={'div'} />
                            </div>
                            <div className='mb-6'>
                                <label htmlFor="" className='text-black'>Email address</label> <br />
                                <Field type="text" name='email' placeholder='abc@def.com' className='border-1 rounded-lg w-full py-3 px-5 mt-4' />
                                <ErrorMessage className='text-xs mt-1 text-red-600 font-semibold' name="email" component={'div'} />
                            </div>
                            <div className='mb-6'>
                                <label htmlFor="" className='text-black'>Subject</label> <br />
                                <Field type="text" name='subject' placeholder='This is an optional' className='border-1 rounded-lg w-full py-3 px-5 mt-4' />
                                <ErrorMessage className='text-xs mt-1 text-red-600 font-semibold' name="subject" component={'div'} />
                            </div>
                            <div className='mb-6'>
                                <label htmlFor="" className='text-black'>Message</label> <br />
                                <Field type="text" name='msg' placeholder='Hi! i’d like to ask about' className='border-1 rounded-lg w-full py-10   px-5 mt-4 placeholder:absolute placeholder:top-5' />
                                <ErrorMessage className='text-xs mt-1 text-red-600 font-semibold' name="msg" component={'div'} />
                            </div>
                            <div className='mt-10'>
                                <button type='submit' className='text-white bg-primary focus:outline-none rounded-md px-16'>Submit</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
            <div className='px-20 mb-10'>
                <h2 className='text-4xl text-black font-semibold text-center mb-8'>Get In Touch With Map</h2>
                    <MapContainer />
            </div>
            <Services />
            <Footer />
        </>
    )
}

export default Contact