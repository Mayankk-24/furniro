import auth from '@/utils/Auth';
import { Button, Input } from '@heroui/react'
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { LuEyeClosed } from 'react-icons/lu'
import { RiEyeFill } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';
import AdminHeader from '../common/AdminHeader';
import { BsArrowLeft } from 'react-icons/bs';
import ProfileUpload from '@/components/common/ProfileUpload';

let url = import.meta.env.VITE_ADMIN_URL;
function ChangePass() {
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);


    const [initialValues, setinitialValues] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const validationSchema = Yup.object({
        oldPassword: Yup.string()
            .required('Old password is required')
            .matches(/^[a-zA-Z0-9]{6}$/, 'Password must be exactly 6 alphanumeric characters.'),
        newPassword: Yup.string()
            .required('New Password is required!')
            .matches(/^[a-zA-Z0-9]{6}$/, 'Password must be exactly 6 alphanumeric characters.'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords dose not match')
            .required('Confirm Password is required'),
    })

    const navigate = useNavigate();
    const onSubmit = async (values, { resetForm }) => {
        console.log(values);
        const authData = await auth();
        setLoading(true);

        try {
            const res = await axios.put(`${url}changePass`, values, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                }
            });

            console.log(res.data);
            if (res.status === 200) {
                toast.success('Password changed successfully');
                // resetForm({ values: { oldPassword: '', newPassword: '', confirmPassword: '' } });
                navigate('/signin');
                setLoading(false);
            }
            resetForm();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
            setLoading(false);
        }
    };
    ;
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });
    return (
        <>
            <div className='flex-1 overflow-auto relative z-10'>
                <AdminHeader title={'Change password'} />
                <div className='px-5 pt-2 '>
                    <Link to={'/admin/settings'} className='flex  items-center gap-x-2 w-fit text-white hover:text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:underline'><BsArrowLeft color='white' size={20} className='hover:-translate-x-1 transition duration-200 delay-100 ease-in-out' />Go back</Link>
                </div>
                <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
                    <div className='bg-gray-900 shadow-lg rounded-lg border-2 border-gray-700'>
                        <form action="#" className='max-w-3xl mx-auto rounded-lg p-5 md:px-5' onSubmit={formik.handleSubmit}>
                            <div className='mt-5'>
                                <Input
                                    aria-label="toggle password visibility"
                                    name='oldPassword'
                                    endContent={isVisible ? (
                                        <RiEyeFill className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                    ) : (
                                        <LuEyeClosed className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                    )}
                                    classNames={{
                                        inputWrapper: [
                                            'group-data-[focus=true]:border-white'
                                        ],
                                        label: [
                                            'text-gray-300',
                                            'group-data-[filled-within=true]:text-white'
                                        ],
                                    }}
                                    label="Old password"
                                    type={isVisible ? "text" : "password"}
                                    variant="bordered"
                                    placeholder='6 alphanumeic characters'
                                    isInvalid={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                    {...formik.getFieldProps('oldPassword')}
                                />
                                {formik.touched.oldPassword && formik.errors.oldPassword ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.oldPassword}</div> : null}
                            </div>
                            <div className='mt-5'>
                                <Input
                                    aria-label="toggle password visibility"
                                    name='newPassword'
                                    endContent={isVisible ? (
                                        <RiEyeFill className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                    ) : (
                                        <LuEyeClosed className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                    )}
                                    classNames={{
                                        inputWrapper: [
                                            'group-data-[focus=true]:border-white'
                                        ],
                                        label: [
                                            'text-gray-300',
                                            'group-data-[filled-within=true]:text-white'
                                        ],
                                    }}
                                    label="New password"
                                    type={isVisible ? "text" : "password"}
                                    variant="bordered"
                                    placeholder='6 alphanumeic characters'
                                    isInvalid={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                    {...formik.getFieldProps('newPassword')}
                                />
                                {formik.touched.newPassword && formik.errors.newPassword ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.newPassword}</div> : null}
                            </div>
                            <div className='mt-5'>
                                <Input
                                    aria-label="toggle password visibility"
                                    name='confirmPassword'
                                    endContent={isVisible ? (
                                        <RiEyeFill className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                    ) : (
                                        <LuEyeClosed className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                                    )}
                                    classNames={{
                                        inputWrapper: [
                                            'group-data-[focus=true]:border-white'
                                        ],
                                        label: [
                                            'text-gray-300',
                                            'group-data-[filled-within=true]:text-white'
                                        ],
                                    }}
                                    label="Confirm new password"
                                    type={isVisible ? "text" : "password"}
                                    variant="bordered"
                                    placeholder='6 alphanumeic characters'
                                    isInvalid={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    {...formik.getFieldProps('confirmPassword')}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className='text-xs text-[#FF5630] font-medium px-2 pt-2'>{formik.errors.confirmPassword}</div> : null}
                            </div>
                            <div className='mt-5 flex justify-center'>
                                <Button type='submit' isLoading={loading} className='w-1/2 focus:outline-none font-semibold' color='primary' variant='shadow' radius='sm'>Update password</Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
            {/* <h2 className='text-gray-600 text-xl font-semibold px-4 py-5'>Change password</h2> */}

        </>
    )
}

export default ChangePass