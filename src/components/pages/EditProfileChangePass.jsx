import auth from '@/utils/Auth';
import { Button, Input } from '@heroui/react'
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { LuEyeClosed } from 'react-icons/lu'
import { RiEyeFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

let url = import.meta.env.VITE_PUBLIC_URL;
function EditProfileChangePass() {
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
            const res = await axios.put(`${url}account/changepass`, values, {
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
            <h2 className='text-gray-600 text-xl font-semibold px-4 py-5'>Change password</h2>
            <form action="#" className='max-w-3xl mx-auto rounded-lg p-5 md:p-10 shadow-lg backdrop-blur-md border-2' onSubmit={formik.handleSubmit}>
                <div className='mt-5'>
                    <Input
                        aria-label="toggle password visibility"
                        name='oldPassword'
                        endContent={isVisible ? (
                            <RiEyeFill className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                        ) : (
                            <LuEyeClosed className="text-2xl text-default-400 cursor-pointer" onClick={() => setIsVisible(!isVisible)} />
                        )}
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
                    <Button type='submit' isLoading={loading} className='bg-[#18181b] font-semibold text-white hover:bg-[#27272a] hover:shadow-lg w-1/2 focus:outline-none' radius='sm'>Update password</Button>
                </div>
            </form>
        </>
    )
}

export default EditProfileChangePass