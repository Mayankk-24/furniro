import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@nextui-org/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'sonner';

let url = import.meta.env.VITE_ADMIN_URL;
function UserInsert() {
    const [showPassword, setShowPassword] = useState(false);
    const authToken = JSON.parse(localStorage.getItem('token'));
    
    const initialValues = {
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        address: '',
        zipcode: '',
        city: '',
        state: '',
        country: '',
        password: '',
    };

    const validationSchema = Yup.object({
        firstname: Yup.string().required('firstname is required'),
        lastname: Yup.string().required('lastname is required'),
        mobile: Yup.string()
            .required('Mobile number is required')
            .typeError('Mobile must be a number')
            .matches(/^\d{10}$/, 'Mobile number contains only 10 digits'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        address: Yup.string().required('Address is required'),
        zipcode: Yup.number().required('Zipcode is required').typeError('Zipcode must be a number'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        password: Yup.string()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6}$/, 'Password must be exactly 6 characters and alphanumeric')
            .required('Password is required'),

    });

    const handleSubmit = async (values, { resetForm }) => {
        console.log('Form Values:', values);

        try {
            const res = await axios.post(`${url}users/adduser`, values, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (res.status === 200) {
                toast.success('User inserted successfully!');
                resetForm();
            } else {
                toast.error(res.message || 'Error while inserting user.');
                console.log(res);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while inserting the user.');
            console.log(error.response?.data?.message);
        }
    };


    return (
        <>
            <div className='flex-1 overflow-auto z-10 relative'>
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ touched, errors, }) => (
                            <Form className="space-y-4 p-8 max-w-xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 rounded-md">
                                <h2 className='text-xl font-semibold mb-4 text-gray-100'>User Insert Form</h2>
                                <div className='flex items-center gap-3 w-full'>
                                    <div className='w-full'>
                                        <label>First name</label>
                                        <Field
                                            type="text"
                                            name="firstname"
                                            placeholder="Enter your firstname"
                                            className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.firstname && errors.firstname ? "border-red-500" : "border-gray-300"}`}
                                        />
                                        <ErrorMessage name="firstname" component="div" className="text-red-500 text-xs" />
                                    </div>
                                    <div className='w-full'>
                                        <label>Last name</label>
                                        <Field
                                            type="text"
                                            name="lastname"
                                            placeholder="Enter your lastname"
                                            className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.lastname && errors.lastname ? "border-red-500" : "border-gray-300"}`}
                                        />
                                        <ErrorMessage name="lastname" component="div" className="text-red-500 text-xs" />
                                    </div>
                                </div>

                                <div>
                                    <label>Mobile</label>
                                    <Field
                                        type="text"
                                        name="mobile"
                                        placeholder="Enter your mobile number"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.mobile && errors.mobile ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    <ErrorMessage name="mobile" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div>
                                    <label>Email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.email && errors.email ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div>
                                    <label>Address</label>
                                    <Field
                                        type="text"
                                        name="address"
                                        placeholder="Enter your address"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.address && errors.address ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    <ErrorMessage name="address" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div>
                                    <label>Zipcode</label>
                                    <Field
                                        type="text"
                                        name="zipcode"
                                        placeholder="Enter your zipcode"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.zipcode && errors.zipcode ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    <ErrorMessage name="zipcode" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div>
                                    <label>City</label>
                                    <Field
                                        type="text"
                                        name="city"
                                        placeholder="Enter your city"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.city && errors.city ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div>
                                    <label>State</label>
                                    <Field
                                        type="text"
                                        name="state"
                                        placeholder="Enter your state"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.state && errors.state ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    <ErrorMessage name="state" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div>
                                    <label>Country</label>
                                    <Field
                                        type="text"
                                        name="country"
                                        placeholder="Enter your country"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.country && errors.country ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    <ErrorMessage name="country" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div>
                                    <label>Password</label>
                                    <div className="relative">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.password && errors.password ? "border-red-500" : "border-gray-300"}`}
                                        />
                                        {showPassword ? <AiOutlineEyeInvisible onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-[9px] right-3 cursor-pointer text-gray-500" size={22} /> : <AiOutlineEye onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-[9px] right-3 cursor-pointer text-gray-500" size={22} />}
                                    </div>
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                                </div>
                                <div className="flex justify-center">
                                    <Button className='px-10 outline-none focus:outline-none' radius='sm' variant='shadow' color='primary' type='submit'>Insert</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </main>
            </div>
        </>
    )
}

export default UserInsert