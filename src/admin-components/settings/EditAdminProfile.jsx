import AdminHeader from '../common/AdminHeader'
import ProfileUpload from '@/components/common/ProfileUpload'
import React, { useEffect } from 'react'
import { Button, Input } from '@heroui/react'
import { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import axios from 'axios';
import auth from '@/utils/Auth';
import { toast } from 'sonner';

let url = import.meta.env.VITE_ADMIN_URL
function EditAdminProfile() {
    const [loading, setLoading] = useState(false);
    const [initialValues, setinitialValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        mobile: '',
        address: '',
        image: null,
        zipcode: '',
        city: '',
        state: '',
        country: '',
    });
    const getAdmin = async () => {
        const authToken = await auth();
        try {
            const res = await axios.get(`${url}single`, {
                'headers': {
                    'Authorization': `Bearer ${authToken.token}`
                }
            });
            console.log(res.data);
            setinitialValues({
                firstname: res.data.data.firstname || "",
                lastname: res.data.data.lastname || "",
                email: res.data.data.email || "",
                mobile: res.data.data.mobile || "",
                address: res.data.data.address || "",
                image: res.data.data.image || null,
                zipcode: res.data.data.zipcode || "",
                city: res.data.data.city || "",
                state: res.data.data.state || "",
                country: res.data.data.country || "",
            });
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAdmin();
    }, [])

    const validationSchema = Yup.object({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email. Please include an "@" in the email address.').required('Email is required'),
        mobile: Yup.string().required('Phone is required').matches(/^\d{10}$/, 'Please enter a valid 10 digit mobile number'),
        address: Yup.string().required('Address is required'),
        zipcode: Yup.string().required('Zipcode is required').length(6),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
    })

    const imageSet = (data) => {
        formik.setValues({
            ...formik.values,
            image: data
        })
    }

    const onSubmit = async (values) => {
        console.log(values);
        const authToken = await auth();
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });
        setLoading(true);
        try {
            const res = await axios.put(`${url}update`, formData, {
                'headers': {
                    'Authorization': `Bearer ${authToken.token}`
                }
            });
            console.log(res.data);
            if (res.status === 200) {
                toast.success('Profile updated successfully');
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
        enableReinitialize: true
    });

    return (
        <>
            <div className='flex-1 overflow-auto relative z-10'>
                <AdminHeader title={'Edit profile'} />
                <div className='px-5 pt-2 '>
                    <Link to={'/admin/settings'} className='flex  items-center gap-x-2 w-fit text-white hover:text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:underline'><BsArrowLeft color='white' size={20} className='hover:-translate-x-1 transition duration-200 delay-100 ease-in-out' />Go back</Link>
                </div>
                <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
                    <div className='bg-gray-900 shadow-lg rounded-lg border-2 border-gray-700'>
                        <div className='pt-5'>
                            <ProfileUpload
                                setimage={imageSet}
                            />
                        </div>
                        <div>
                            <form action="#" className='max-w-3xl mx-auto rounded-lg p-5 md:p-10' onSubmit={formik.handleSubmit}>
                                <div className='flex items-center gap-x-3'>
                                    <div className='w-full'>
                                        <Input
                                            label="First name"
                                            name="firstname"
                                            type="text"
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper: [
                                                    'group-data-[focus=true]:border-white'
                                                ],
                                                label: [
                                                    'text-gray-300',
                                                    'group-data-[filled-within=true]:text-white'
                                                ],
                                            }}
                                            {...formik.getFieldProps('firstname')}
                                            isInvalid={formik.touched.firstname && Boolean(formik.errors.firstname)}
                                        />
                                        {formik.touched.firstname && formik.errors.firstname ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.firstname}</div>) : null}
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            label="Last name"
                                            name="lastname"
                                            type="text"
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper: [
                                                    'group-data-[focus=true]:border-white'
                                                ],
                                                label: [
                                                    'text-gray-300',
                                                    'group-data-[filled-within=true]:text-white'
                                                ],
                                            }}
                                            {...formik.getFieldProps('lastname')}
                                            isInvalid={formik.touched.lastname && Boolean(formik.errors.lastname)}
                                        />
                                        {formik.touched.lastname && formik.errors.lastname ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.lastname}</div>) : null}
                                    </div>
                                </div>
                                <div className='mt-5'>
                                    <Input label="Email" type="email" name='email' variant="bordered"
                                        classNames={{
                                            inputWrapper: [
                                                'group-data-[focus=true]:border-white'
                                            ],
                                            label: [
                                                'text-gray-300',
                                                'group-data-[filled-within=true]:text-white'
                                            ],
                                        }}
                                        {...formik.getFieldProps('email')}
                                        isInvalid={formik.touched.email && Boolean(formik.errors.email)}
                                    />
                                    {formik.touched.email && formik.errors.email ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.email}</div>) : null}
                                </div>
                                <div className='mt-5'>
                                    <Input label="Phone" type="text" name='mobile'
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: [
                                                'group-data-[focus=true]:border-white'
                                            ],
                                            label: [
                                                'text-gray-300',
                                                'group-data-[filled-within=true]:text-white'
                                            ],
                                        }}
                                        {...formik.getFieldProps('mobile')}
                                        isInvalid={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                    />
                                    {formik.touched.mobile && formik.errors.mobile ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.mobile}</div>) : null}
                                </div>
                                <div className='mt-5'>
                                    <Input label="Address" type="text" name='address' placeholder='230, Brooklyn New york'
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: [
                                                'group-data-[focus=true]:border-white'
                                            ],
                                            label: [
                                                'text-gray-300',
                                                'group-data-[filled-within=true]:text-white'
                                            ],
                                        }}
                                        {...formik.getFieldProps('address')}
                                        isInvalid={formik.touched.address && Boolean(formik.errors.address)}
                                    />
                                    {formik.touched.address && formik.errors.address ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.address}</div>) : null}
                                </div>
                                <div className='mt-5'>
                                    <Input label="Zipcode" type="text" name='zipcode'
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: [
                                                'group-data-[focus=true]:border-white'
                                            ],
                                            label: [
                                                'text-gray-300',
                                                'group-data-[filled-within=true]:text-white'
                                            ],
                                        }}
                                        {...formik.getFieldProps('zipcode')}
                                        isInvalid={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
                                    />
                                    {formik.touched.zipcode && formik.errors.zipcode ? (<div className='text-xs
                                text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.zipcode}</div>) : null}
                                </div>
                                <div className='flex items-center gap-x-3 mt-5'>
                                    <div className='w-full'>
                                        <Input
                                            label="City"
                                            name="city"
                                            type="text"
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper: [
                                                    'group-data-[focus=true]:border-white'
                                                ],
                                                label: [
                                                    'text-gray-300',
                                                    'group-data-[filled-within=true]:text-white'
                                                ],
                                            }}
                                            {...formik.getFieldProps('city')}
                                            isInvalid={formik.touched.city && Boolean(formik.errors.city)}
                                        />
                                        {formik.touched.city && formik.errors.city ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.city}</div>) : null}
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            label="State"
                                            name="state"
                                            type="text"
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper: [
                                                    'group-data-[focus=true]:border-white'
                                                ],
                                                label: [
                                                    'text-gray-300',
                                                    'group-data-[filled-within=true]:text-white'
                                                ],
                                            }}
                                            {...formik.getFieldProps('state')}
                                            isInvalid={formik.touched.state && Boolean(formik.errors.state)}
                                        />
                                        {formik.touched.state && formik.errors.state ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.state}</div>) : null}
                                    </div>
                                </div>
                                <div className='mt-5'>
                                    <Input label="Country" type="text" name='country'
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: [
                                                'group-data-[focus=true]:border-white'
                                            ],
                                            label: [
                                                'text-gray-300',
                                                'group-data-[filled-within=true]:text-white'
                                            ],
                                        }}
                                        {...formik.getFieldProps('country')}
                                        isInvalid={formik.touched.country && Boolean(formik.errors.country)}
                                    />
                                    {formik.touched.country && formik.errors.country ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.country}</div>) : null}
                                </div>
                                <div className='mt-5 flex justify-center'>
                                    <Button type='submit' isLoading={loading} color='primary' variant='shadow' className=' font-semibold text-white hover:shadow-lg w-1/2 focus:outline-none' radius='sm'>Save changes</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default EditAdminProfile