import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@nextui-org/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

let url = import.meta.env.VITE_ADMIN_URL;
function UserUpdate() {
    let { id } = useParams();
    const authToken = JSON.parse(localStorage.getItem('token'));

    const [InitialValues, setInitialValues] = useState(
        {
            firstname: '',
            lastname: '',
            mobile: '',
            email: '',
            address: '',
            zipcode: '',
            city: '',
            state: '',
            country: '',
        }
    );

    const myFun = async () => {
        try {
            const res = await axios.get(`${url}users/single/${id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data.data);
            const user = res.data.data;

            setInitialValues({
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                mobile: user.mobile || "",
                email: user.email || "",
                address: user.address || "",
                zipcode: user.zipcode || "",
                city: user.city || "",
                state: user.state || "",
                country: user.country || "",
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        myFun();
    }, [])

    useEffect(() => {
    }, [InitialValues])

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
    });

    const handleSubmit = async (values, { resetForm }) => {
        console.log('Form Values:', values);

        try {
            const res = await axios.put(`${url}users/update/${id}`, values, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);
            toast.success('User Successfully Updated!!');
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <div className='flex-1 overflow-auto z-10 relative'>
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <Formik
                        initialValues={InitialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ touched, errors, isSubmitting }) => (
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

                                <div className="flex justify-center">
                                    <Button className='px-10 outline-none focus:outline-none' radius='sm' variant='shadow' color='primary' type='submit' disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update"}</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </main>
            </div>
        </>
    )
}

export default UserUpdate