import React, { useEffect } from 'react'
import ProfileUpload from '../common/ProfileUpload'
import { Button, Input } from '@heroui/react'
import { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import axios from 'axios';
import auth from '@/utils/Auth';
import { toast } from 'sonner';
import { RiEyeFill } from 'react-icons/ri';
import { LuEyeClosed } from 'react-icons/lu';
import EditProfileChangePass from './EditProfileChangePass';

let url = import.meta.env.VITE_PUBLIC_URL;
function EditUserProfile() {
    const [loading, setLoading] = useState(false);
    const [Select, setSelect] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    const toggle = (index) => {
        setSelect(index);
    }
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
        // formik.setValues({
        //     ...formik.values,
        //     image: data
        // })
        formik.setFieldValue('image', data);
    }

    const onSubmit = async (values) => {
        console.log(values);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });
        const authData = await auth();
        setLoading(true);
        try {
            const res = await axios.put(`${url}account/update`, formData, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
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

    const getProfileData = async () => {
        const authData = await auth();
        try {
            const res = await axios.get(`${url}account/profile`, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            });
            console.log(res.data.data);
            const data = res.data.data;
            setinitialValues({
                firstname: data.firstname || "",
                lastname: data.lastname || "",
                email: data.email || "",
                mobile: data.mobile || "",
                address: data.address || "",
                image: data.image || null,
                zipcode: data.zipcode || "",
                city: data.city || "",
                state: data.state || "",
                country: data.country || "",
            });
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProfileData();
    }, [])

    return (
        <>
            <div className='max-w-7xl mx-auto'>
                <div className='px-2 pt-2'>
                    <Link to={'/'} className='flex items-center gap-x-2 w-fit text-black hover:text-black transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:underline'><BsArrowLeft color='black' size={20} className='hover:-translate-x-1 transition duration-200 delay-100 ease-in-out' />Go back</Link>
                </div>
                <div className='p-2 md:p-5 border-b flex justify-center sm:justify-start'>
                    <h1 className='text-lg md:text-2xl font-semibold text-gray-900'>Edit your Profile</h1>
                </div>
                <div className='flex flex-col md:flex-row pb-10'>
                    <div className='w-full md:w-2/6 md:border-r'>
                        <div className='py-10 w-4/5 mx-auto'>
                            <ProfileUpload
                                setimage={imageSet}
                            />
                        </div>
                        <div className='w-4/5 mx-auto flex flex-col gap-y-3'>
                            <div className={`py-4 text-center text-black  ${Select == 1 ? 'bg-gray-900 text-white font-medium ' : 'hover:bg-gray-300/50 hover:text-black hover:cursor-pointer'} rounded-lg  transition duration-300 ease-in-out`} onClick={() => toggle(1)}>User Profile</div>
                            <div className={`py-4 text-center  ${Select == 2 ? 'bg-gray-900 text-white font-medium' : 'text-black hover:bg-gray-300/50 hover:cursor-pointer'} rounded-lg transition duration-300 ease-in-out`} onClick={() => toggle(2)}>Change Password</div>
                        </div>
                    </div>
                    <div className='w-full md:w-2/3 px-5'>
                        {
                            Select == 1 && (
                                <>
                                    <h2 className='text-gray-600 text-xl font-semibold px-4 py-5'>Account settings</h2>
                                    <form action="#" className='max-w-3xl mx-auto rounded-lg p-5 md:p-10 shadow-lg backdrop-blur-md border-2' onSubmit={formik.handleSubmit}>
                                        <div className='flex items-center gap-x-3'>
                                            <div className='w-full'>
                                                <Input
                                                    label="First name"
                                                    name="firstname"
                                                    type="text"
                                                    variant="bordered"
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
                                                    {...formik.getFieldProps('lastname')}
                                                    isInvalid={formik.touched.lastname && Boolean(formik.errors.lastname)}
                                                />
                                                {formik.touched.lastname && formik.errors.lastname ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.lastname}</div>) : null}
                                            </div>
                                        </div>
                                        <div className='mt-5'>
                                            <Input label="Email" type="email" name='email' variant="bordered"
                                                {...formik.getFieldProps('email')}
                                                isInvalid={formik.touched.email && Boolean(formik.errors.email)}
                                            />
                                            {formik.touched.email && formik.errors.email ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.email}</div>) : null}
                                        </div>
                                        <div className='mt-5'>
                                            <Input label="Phone" type="text" name='mobile' variant="bordered"
                                                {...formik.getFieldProps('mobile')}
                                                isInvalid={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                            />
                                            {formik.touched.mobile && formik.errors.mobile ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.mobile}</div>) : null}
                                        </div>
                                        <div className='mt-5'>
                                            <Input label="Address" type="text" name='address' placeholder='230, Brooklyn New york' variant="bordered"
                                                {...formik.getFieldProps('address')}
                                                isInvalid={formik.touched.address && Boolean(formik.errors.address)}
                                            />
                                            {formik.touched.address && formik.errors.address ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.address}</div>) : null}
                                        </div>
                                        <div className='mt-5'>
                                            <Input label="Zipcode" type="text" name='zipcode' variant="bordered"
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
                                                    {...formik.getFieldProps('state')}
                                                    isInvalid={formik.touched.state && Boolean(formik.errors.state)}
                                                />
                                                {formik.touched.state && formik.errors.state ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.state}</div>) : null}
                                            </div>
                                        </div>
                                        <div className='mt-5'>
                                            <Input label="Country" type="text" name='country' variant="bordered"
                                                {...formik.getFieldProps('country')}
                                                isInvalid={formik.touched.country && Boolean(formik.errors.country)}
                                            />
                                            {formik.touched.country && formik.errors.country ? (<div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.country}</div>) : null}
                                        </div>
                                        <div className='mt-5 flex justify-center'>
                                            <Button type='submit' isLoading={loading} className='bg-[#18181b] font-semibold text-white hover:bg-[#27272a] hover:shadow-lg w-1/2 focus:outline-none' radius='sm'>Save changes</Button>
                                        </div>
                                    </form>
                                </>
                            )
                        }
                        {
                            Select == 2 && (
                                <>
                                    <EditProfileChangePass />
                                </>

                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditUserProfile