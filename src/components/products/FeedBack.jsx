import { Button, Input, Textarea } from '@heroui/react'
import { Rating } from '@mui/material'
import axios from 'axios';
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'sonner';
import * as Yup from 'yup';

let url = import.meta.env.VITE_PUBLIC_URL;
function FeedBack({ id }) {
    const [Loading, setLoading] = useState(false)
    const initialValues = {
        username: '',
        email: '',
        review: '',
        rating: 0
    };
    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        review: Yup.string().required('Review is required'),
    })
    const onSubmit = async (values, { resetForm }) => {
        console.log(values);
        setLoading(true);
        try {
            const res = await axios.post(`${url}userreview/add/${id}`, values);
            console.log(res.data);
            if (res.status == 200) {
                toast.success("Review Added Successfully");
                setLoading(false);
                resetForm();
                window.location.reload();
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    })
    return (
        <>
            <h1 className='text-3xl text-gray-800 font-semibold mb-4 text-center pt-10'>FeedBack</h1>
            <div className='flex flex-col md:flex-row border-b-2'>
                <div className='w-full md:w-1/2 py-5 px-14'>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col space-y-4">
                            <div>
                                <h3 className='text-gray-600 font-normal'>Product Rating</h3>
                                <Rating precision={0.5} name='rating'
                                    value={Number(formik.values.rating) || 0}
                                    onChange={(e, val) => {
                                        // console.log(e, val);
                                        formik.setFieldValue('rating', val);
                                    }}
                                />

                            </div>
                            <div>
                                <Input type='text' variant='bordered' label='Name' name='username' placeholder='John Doe'
                                    {...formik.getFieldProps('username')}
                                />
                                {formik.touched.username && formik.errors.username ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.username}</div>) : null}
                            </div>
                            <div>
                                <Input type='email' variant='bordered' label='Email' name='email' placeholder='johndoe@example.com'
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.email}</div>) : null}
                            </div>
                            <div>
                                <Textarea label="Description" placeholder="Enter your description" name='review' variant='bordered'
                                    {...formik.getFieldProps('review')}
                                />
                                {formik.touched.review && formik.errors.review ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.review}</div>): null}
                            </div>
                            <div>
                                <Button isLoading={Loading} type='submit' className="bg-[#18181b] hover:bg-[#3f3f46] hover:shadow-md text-white font-bold py-2 px-4 rounded-md focus:outline-none transition-colors duration-200 ease-in-out w-56">Submit</Button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='w-full md:w-1/2'>
                    <img src="/Assets/5385893.jpg" alt="#" className='w-full h-full object-cover' />
                </div>
            </div>
        </>
    )
}

export default FeedBack