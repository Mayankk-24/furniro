import { Alert, Button } from '@heroui/react';
import { Box, Typography } from '@mui/material'
import { Input } from '@nextui-org/react'
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { LuEyeClosed } from 'react-icons/lu';
import { MdErrorOutline } from 'react-icons/md';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

let url = import.meta.env.VITE_PUBLIC_URL;
function SignIn() {
    const [isVisible, setIsVisible] = useState(false);
    const [Show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const initialValues = {
        email: '',
        password: '',
    };

    const navigate = useNavigate();
    const onSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post(`${url}login`, values);

            if (res.data.message === "User logged in successfully") {
                console.log("User successfully created:", res.data);
                let token = res.data.token;
                localStorage.setItem('token', JSON.stringify(token));
                setLoading(false);
                if (res.data.role === 'admin') {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
            else {
                console.log("Unexpected response:", res.data);
                setError("An unexpected error occurred. Please try again.");
                setShow(true);
                setLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setLoading(false);

                if (errorMessage === "Invalid email") {
                    setError("User does not exist! Please create your account");
                    setLoading(false);
                } else if (errorMessage === "Invalid password") {
                    setError("Password is invalid, Please check your password");
                    setLoading(false);
                } else {
                    setError(errorMessage);
                    setLoading(false);
                }

                setShow(true);
            } else {
                console.error("An error occurred:", error);
                setError("Something went wrong. Please try again.");
                setShow(true);
                setLoading(false);
            }
        }
    };


    const validationSchema = Yup.object({
        email: Yup.string().email('Email must be a valid email address!').required('Email is required!'),
        password: Yup.string()
            .required('Password is required!')
            .matches(/^[a-zA-Z0-9]{6}$/, 'Password must be exactly 6 alphanumeric characters.'),
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
                        paddingBottom: '24px'
                    }}
                >
                    <div>
                        <h3 className='text-[32px] font-bold text-[#1C252C] text-center'>Hi, Welcome back</h3>
                        <p className='text-[#637381] text-base font-normal mt-4 text-center'>More effectively with optimized workflows.</p>
                    </div>
                    <div className='flex justify-center items-center'>
                        <img src="/Assets/illustration-dashboard.webp" alt="" className='aspect-[4/3] mt-20' />
                    </div>
                </Box>
                <Box sx={{ width: '64%', height: '100vh', display: 'flex', alignItems: 'center' }}>
                    <div className="h-full w-full p-10  lg:h-fit lg:w-1/2 lg:mx-auto lg:p-0">
                        <h5 className='text-[#1C252E] text-left font-bold text-[1.1875rem] mb-4'>Sign in to your account</h5>
                        <p className='text-[#637381] text-left font-normal text-sm'>Don’t have an account? <Link className='text-[#00A76F] font-semibold hover:underline hover:text-[#00A76F]' to={'/signup'}>Get started</Link></p>

                        {
                            Show && error && (
                                <Alert description={error} color='danger' variant='faded' className='mt-5' />
                            )
                        }

                        <div>
                            <form action="#" onSubmit={formik.handleSubmit}>
                                <div className='mt-5'>
                                    <Input label="Email address" type="email" name='email' variant={'bordered'} isInvalid={formik.touched.email && Boolean(formik.errors.email)} {...formik.getFieldProps('email')} />
                                    {formik.touched.email && formik.errors.email ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.email}</div> : null}
                                </div>
                                <div className='mt-5 flex flex-col gap-y-2'>
                                    <div className='text-end'>
                                        <Link className='text-[#1C252E] text-sm font-normal hover:text-[#1C252E] hover:underline' to={'/resetpassword'}>Forgot password?</Link>
                                    </div>
                                    <div>
                                        <Input
                                            aria-label="toggle password visibility"
                                            name='password'
                                            endContent={isVisible ? (
                                                <RiEyeFill className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
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
                                </div>
                                <div className='mt-6'>
                                    {/* <button type='submit' className='bg-[#18181b] font-semibold text-white hover:bg-[#27272a] hover:shadow-lg w-full'>Sign in</button> */}
                                    <Button type='submit' isLoading={loading} className='bg-[#18181b] font-semibold text-white hover:bg-[#27272a] hover:shadow-lg w-full focus:outline-none' radius='sm'>Sign in</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Box>

            </main >
        </>
    )
}

export default SignIn