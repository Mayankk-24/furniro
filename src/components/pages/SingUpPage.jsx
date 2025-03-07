import { Alert, Button } from '@heroui/react';
import { Box, Typography } from '@mui/material'
import { Input } from '@nextui-org/react'
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { LuEyeClosed } from 'react-icons/lu';
import { MdErrorOutline } from 'react-icons/md';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { motion } from 'framer-motion';


let url = import.meta.env.VITE_PUBLIC_URL;
function SingUpPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [Show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const initialValues = {
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        password: '',
    };

    const navigate = useNavigate();
    const onSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post(`${url}register`, values);

            if (res.data.message === "User created successfully") {
                console.log("User successfully created:", res.data);
                setLoading(false);
                navigate("/signin");
            } else {
                console.error("Unexpected response:", res.data);
                alert("An unexpected error occurred. Please try again.");
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data.message) {
                console.error("Error:", error.response.data.message);
                // alert(error.response.data.message);
                setShow(true);
            } else {
                console.error("An error occurred:", error);
                alert("Something went wrong. Please try again.");
            }
        }
    };


    const validationSchema = Yup.object({
        firstname: Yup.string().required('First name is required!'),
        lastname: Yup.string().required('Last name is required!'),
        email: Yup.string().email('Email must be a valid email address!').required('Email is required!'),
        password: Yup.string()
            .required('Password is required!')
            .matches(/^[a-zA-Z0-9]{6}$/, 'Password must be exactly 6 alphanumeric characters.'),
        mobile: Yup.string().required('Mobile is required!').matches(/^\d{10}$/, 'Please enter a valid 10 digit mobile number'),
    })
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    })

    return (
        <>
            <main className='flex'>
                <Box
                    sx={{
                        width: '36%',
                        height: '100vh',
                        background: `linear-gradient(0deg, rgb(254,249,248), rgb(98%, 98%, 98%))`,
                        paddingTop: '72px',
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        paddingBottom: '24px',
                        display: {
                            xs: 'none', // Hides the Box on small screens (theme default is xs < 600px)
                            sm: 'none', // Hides the Box on medium screens (600px to 900px)
                            md: 'block', // Shows the Box on screens larger than 900px (md starts at 900px)
                        },
                    }}
                >
                    <div>
                        <h3 className='text-[32px] font-bold text-[#1C252C] text-center'>Manage the job</h3>
                        <p className='text-[#637381] text-base font-normal mt-4 text-center'>More effectively with optimized workflows.</p>
                    </div>
                    <div className='flex justify-center items-center'>
                        <img src="/Assets/illustration-dashboard.webp" alt="" className='aspect-[4/3] mt-20' />
                    </div>
                </Box>
                <Box sx={{
                    width: {
                        xs: '100%',
                        sm: '100%',
                        md: '64%',
                    }, height: '100vh', display: 'flex', alignItems: 'center'
                }}>
                    <motion.div initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full w-full p-10 lg:h-fit lg:w-1/2 lg:mx-auto lg:p-0">
                        <h5 className='text-[#1C252E] text-left font-bold text-[1.1875rem] mb-4'>Get started absolutely free</h5>
                        <p className='text-[#637381] text-left font-normal text-sm'>Already have an account? <Link className='text-[#00A76F] font-semibold hover:underline hover:text-[#00A76F]' to={'/signin'}>Get started</Link></p>

                        {Show && (
                            <Alert description={'User already exist! Please sign in.'} color='danger' variant='faded' className='mt-5' />
                        )}
                        <div>
                            <form action="#" onSubmit={formik.handleSubmit}>
                                <div className="flex flex-col gap-y-4 lg:flex-row lg:items-center lg:justify-between lg
                                :space-x-4 lg:space-y-0 lg:gap-x-4 mt-8">
                                    <div className='w-full'>
                                        <Input label="First name" type="text" name='firstname' variant={'bordered'} isInvalid={formik.touched.firstname && Boolean(formik.errors.firstname)} {...formik.getFieldProps('firstname')} />
                                        {formik.touched.firstname && formik.errors.firstname ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.firstname}</div>) : null}
                                    </div>
                                    <div className='w-full'>
                                        <Input label="Last name" type="text" name='lastname' variant={'bordered'} isInvalid={formik.touched.lastname && Boolean(formik.errors.lastname)} {...formik.getFieldProps('lastname')} />
                                        {formik.touched.lastname && formik.errors.lastname ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.lastname}</div>) : null}
                                    </div>
                                </div>
                                <div className='mt-5'>
                                    <Input label="Mobile number" type="text" name='mobile' variant={'bordered'} isInvalid={formik.touched.mobile && Boolean(formik.errors.mobile)} {...formik.getFieldProps('mobile')} />
                                    {formik.touched.mobile && formik.errors.mobile ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.mobile}</div> : null}
                                </div>
                                <div className='mt-5'>
                                    <Input label="Email address" type="email" name='email' variant={'bordered'} isInvalid={formik.touched.email && Boolean(formik.errors.email)} {...formik.getFieldProps('email')} />
                                    {formik.touched.email && formik.errors.email ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.email}</div> : null}
                                </div>
                                <div className='mt-5'>
                                    <Input
                                        aria-label="toggle password visibility"
                                        name='password'
                                        endContent={isVisible ? (
                                            <RiEyeFill className="text-2xl cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                        ) : (
                                            <LuEyeClosed className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                        )}
                                        label="Password"
                                        type={isVisible ? "text" : "password"}
                                        variant="bordered"
                                        placeholder='6 alphanumeic characters'
                                        isInvalid={formik.touched.password && Boolean(formik.errors.password)}
                                        {...formik.getFieldProps('password')}
                                    />
                                    {formik.touched.password && formik.errors.password ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.password}</div> : null}
                                </div>
                                <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}  className='mt-6'>
                                    <Button type='submit' isLoading={loading} className='bg-[#18181b] font-semibold text-white hover:bg-[#27272a] hover:shadow-lg w-full focus:outline-none'>Create account</Button>
                                </motion.div>
                            </form>

                            <div>
                                <p className='text-[#637381] text-center font-normal text-sm mt-6
                                lg:text-xs lg:mt-8'>
                                    By signing up, I agree to <Link className='text-black font-medium underline hover:text-black'>Terms of service</Link> and <Link className='text-black font-medium underline hover:text-black'>Privacy policy.</Link>

                                </p>
                            </div>
                        </div>
                    </motion.div>
                </Box>

            </main >
        </>
    )
}

export default SingUpPage