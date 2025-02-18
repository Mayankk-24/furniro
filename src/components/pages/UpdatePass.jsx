import { Button, InputOtp } from '@heroui/react';
import { Box, Typography } from '@mui/material'
import { Input } from '@nextui-org/react'
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa';
import { GoChevronLeft } from 'react-icons/go';
import { LuEyeClosed } from 'react-icons/lu';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner';
import * as Yup from 'yup'

let url = import.meta.env.VITE_PUBLIC_URL;
function UpdatePass() {
    const [Loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const initialValues = {
        email: '',
        otp: '',
        newpassword: '',
        confirmpassword: '',
    };

    const navigate = useNavigate();
    const onSubmit = async (values) => {
        console.log(values);
        setLoading(true);
        try {
            const res = await axios.put(`${url}reset`, values);
            console.log(res.data);
            setLoading(false);
            if (res.data?.message === "Password changed successfully") {
                toast.success("Password changed successfully");
                localStorage.removeItem('otp');
                navigate('/signin');
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            // const msg = "Password already exists";
            if (error.response.status == 400) {
                toast.error(error?.response?.data?.message);
            }
        }

    };

    const storedOtp = JSON.parse(localStorage.getItem('otp'));
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid Email address').required('Email address is required'),
        otp: Yup.string()
            .required('Please fill out this field') // Error when the field is empty
            .test('otp-length', function (value) {
                const { path, createError } = this;
                if (!value || value.length < 6) {
                    return createError({
                        path,
                        message: `Please lengthen this text to 6 characters or more (you are currently using ${value ? value.length : 0
                            } characters).`,
                    });
                }
                return true;
            })
            .test('match-otp', 'OTP does not match', function (value) {
                if (value && value.length === 6 && value !== storedOtp) {
                    return false; // Trigger error only when the field is complete but incorrect
                }
                return true;
            }),
        newpassword: Yup.string()
            .required('New Password is required!')
            .matches(/^[a-zA-Z0-9]{6}$/, 'Password must be exactly 6 alphanumeric characters.'),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('newpassword'), null], 'Passwords dose not match')
            .required('Confirm Password is required'),
    });

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
                            <img src="/Assets/successfull.svg" alt="" className='h-24 w-24 mb-8' />
                            <h5 className='text-[#1C252E] text-center font-bold text-[1.1875rem] mb-4'>Request sent successfully!</h5>
                            <p className='text-[#637381] text-center font-normal text-sm'>We've sent a 6-digit confirmation email to your email. <br />Please enter the code in below box to verify your email.</p>
                        </div>

                        <div className='mt-10 w-'>
                            <form action="#" onSubmit={formik.handleSubmit}>
                                <div className='mt-5 flex flex-col justify-center'>
                                    <InputOtp length={6} name='otp' variant='faded' description="Enter the 6 digit code sent to your email" size='lg' classNames={{
                                        base: [
                                            'w-full',
                                            'flex',
                                            'items-center',
                                            'justify-center'
                                        ],
                                        segmentWrapper: 'gap-x-3',
                                        segment: [
                                            'w-14',
                                            'h-14'
                                        ],
                                        errorMessage: [
                                            'font-normal',
                                            'text-[#FF5630]',
                                        ],
                                        helperWrapper: [
                                            'w-full',
                                            'px-12',
                                            'hidden'
                                        ],
                                        description: [
                                            'font-normal',
                                            'text-left'
                                        ]
                                    }}
                                        isInvalid={formik.touched.otp && Boolean(formik.errors.otp)}
                                        {...formik.getFieldProps('otp')} />
                                    {formik.touched.otp && formik.errors.otp ? <div className='text-xs text-[#FF5630] font-medium px-12 pt-2'>{formik.errors.otp}</div> : <div className='text-xs text-[#A1A1AA] font-normal px-12 pt-2'>Enter the 6 digit code sent to your email</div>}
                                </div>
                                <div className='mt-5'>
                                    <Input type='email' name='email' label='Email' variant='bordered'
                                        isInvalid={formik.touched.email && Boolean(formik.errors.email)}
                                        {...formik.getFieldProps('email')}
                                    />
                                    {formik.touched.email && formik.errors.email ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.email}</div> : null}
                                </div>
                                <div className='mt-5'>
                                    <Input
                                        aria-label="toggle password visibility"
                                        name='newpassword'
                                        endContent={isVisible ? (
                                            <RiEyeFill className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                        ) : (
                                            <LuEyeClosed className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                        )}
                                        label="New password"
                                        type={isVisible ? "text" : "password"}
                                        variant="bordered"
                                        placeholder='6 alphanumeic characters'
                                        isInvalid={formik.touched.newpassword && Boolean(formik.errors.newpassword)}
                                        {...formik.getFieldProps('newpassword')}
                                    />
                                    {formik.touched.newpassword && formik.errors.newpassword ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.newpassword}</div> : null}
                                </div>
                                {/* confirm password */}
                                <div className='mt-5'>
                                    <Input
                                        aria-label="toggle password visibility"
                                        name='confirmpassword'
                                        endContent={isVisible ? (
                                            <RiEyeFill className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                        ) : (
                                            <LuEyeClosed className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                        )}
                                        label="Confirm new password"
                                        type={isVisible ? "text" : "password"}
                                        variant="bordered"
                                        placeholder='6 alphanumeic characters'
                                        isInvalid={formik.touched.confirmpassword && Boolean(formik.errors.confirmpassword)}
                                        {...formik.getFieldProps('confirmpassword')}
                                    />
                                    {formik.touched.confirmpassword && formik.errors.confirmpassword ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.confirmpassword}</div> : null}
                                </div>
                                <div className='mt-6'>
                                    <Button type='submit' isLoading={Loading} className='bg-[#18181b] font-semibold text-white hover:bg-[#27272a] hover:shadow-lg w-full focus:outline-none'>Update password</Button>
                                </div>
                            </form>
                            <div className='flex justify-center mt-6'>
                                <p className='text-sm text-[#1C252E] mr-1'>Don’t have a code?</p>
                                <Link className='text-[#00A76F] text-sm font-medium hover:text-[#00A76F] hover:underline flex items-center gap-1' to={'/resetpassword'}>Resend</Link>
                            </div>
                            <div className='flex justify-center mt-6'>
                                <Link className='text-[#1C252E] text-sm font-medium hover:text-[#1C252E] hover:underline flex items-center gap-1' to={'/signin'}><GoChevronLeft />Return to sign in</Link>
                            </div>
                        </div>
                    </div>
                </Box>

            </main >
        </>
    )
}

export default UpdatePass