import { Button } from '@heroui/react';
import { Box, Typography } from '@mui/material'
import { Input } from '@nextui-org/react'
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa';
import { GoChevronLeft } from 'react-icons/go';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

let url = import.meta.env.VITE_PUBLIC_URL;
function ResetPassword() {
    const [Loading, setLoading] = useState(false)
    const initialValues = {
        email: '',
    };
    const navigate = useNavigate();
    const onSubmit = async (values) => {
        console.log(values);

        setLoading(true);
        try {
            const res = await axios.post(`${url}resetpass`, values);
            let otp = res.data.otp;
            localStorage.setItem('otp', JSON.stringify(otp));
            setLoading(false);
            navigate('/updatepassword');
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Email must be a valid email address!').required('Email is required!'),
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
                        <h3 className='text-[32px] font-bold text-[#1C252C] text-center'>Manage the job</h3>
                        <p className='text-[#637381] text-base font-normal mt-4 text-center'>More effectively with optimized workflows.</p>
                    </div>
                    <div className='flex justify-center items-center'>
                        <img src="/Assets/illustration-dashboard.webp" alt="" className='aspect-[4/3] mt-20' />
                    </div>
                </Box>
                <Box sx={{ width: '64%', height: '100vh', display: 'flex', alignItems: 'center' }}>
                    <div className="h-full w-full p-10  lg:h-fit lg:w-1/2 lg:mx-auto lg:p-0">
                        <div className='flex flex-col items-center justify-center'>
                            <img src="/Assets/reset-password.svg" alt="" className='h-24 w-24 mb-8' />
                            <h5 className='text-[#1C252E] text-center font-bold text-[1.1875rem] mb-4'>Forgot your password?</h5>
                            <p className='text-[#637381] text-center font-normal text-sm'>Please enter the email address associated with your account and we'll email you a link to reset your password.</p>
                        </div>

                        <div className='mt-10'>
                            <form action="#" onSubmit={formik.handleSubmit}>
                                <div className='mt-5'>
                                    <Input label="Email address" type="email" name='email' variant={'bordered'} isInvalid={formik.touched.email && Boolean(formik.errors.email)} {...formik.getFieldProps('email')} />
                                    {formik.touched.email && formik.errors.email ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.email}</div> : null}
                                </div>
                                <div className='mt-6'>
                                    <Button type='submit' isLoading={Loading} className='bg-[#18181b] font-semibold text-white hover:bg-[#27272a] hover:shadow-lg w-full'>Send request</Button>
                                </div>
                            </form>
                            <div className='flex justify-center mt-8'>
                                <Link className='text-[#1C252E] text-sm font-medium hover:text-[#1C252E] hover:underline flex items-center gap-1' to={'/signin'}><GoChevronLeft />Return to sign in</Link>
                            </div>
                        </div>
                    </div>
                </Box>

            </main >
        </>
    )
}

export default ResetPassword