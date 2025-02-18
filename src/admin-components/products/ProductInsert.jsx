import { Button, Select, SelectItem } from '@nextui-org/react';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { MuiChipsInput } from 'mui-chips-input';
import React, { useEffect, useState } from 'react';
// import './productinsert.css'
import CustomChipInput from '../../chip/CustomChipInput';
import axios from 'axios';
import { toast } from 'sonner';

let url = import.meta.env.VITE_ADMIN_URL;
function ProductInsert() {
    const [Sales, setSales] = useState([]);

    const authToken = JSON.parse(localStorage.getItem('token'));
    const myFun = async () => {
        try {
            const res = await axios.get(`${url}report/sales`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);
            setSales(res.data.categoryProduct);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        myFun();
    }, [])

    const initialValues = {
        sku: '',
        OriginalPrice: '',
        discount: '',
        title: '',
        description: '',
        details: '',
        category: '',
        colors: [],
        sizes: [],
        image: [],
        stock: '' // Added for image upload
    };

    const validate = (values) => {
        const errors = {};
        if (!values.sku) {
            errors.sku = 'SKU is required';
        } else if (!/^[a-zA-Z0-9]{6}$/.test(values.sku)) {
            errors.sku = 'SKU must be a 6 character alphanumeric value';
        }
        if (!values.OriginalPrice) {
            errors.OriginalPrice = 'Original price is required';
        }
        if (!values.discount) {
            errors.discount = 'Discount is required';
        }
        if (!values.stock) {
            errors.stock = 'stock is required';
        }
        if (!values.title) {
            errors.title = 'Title is required';
        }
        if (!values.category) {
            errors.category = 'Category is required';
        }
        if (!values.colors || values.colors.length === 0) {
            errors.colors = 'At least one color is required';
        }
        if (!values.sizes || values.sizes.length === 0) {
            errors.sizes = 'Sizes are required';
        }
        if (!values.image) {
            errors.image = 'Image is required';
        }
        return errors;
    };

    const onSubmit = async (values, { resetForm }) => {
        console.log('Form values', values);

        try {
            const formData = new FormData();
            formData.append('sku', values.sku);
            formData.append('OriginalPrice', values.OriginalPrice);
            formData.append('discount', values.discount);
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('details', values.details);
            formData.append('category', values.category);
            formData.append('stock', values.stock);

            // Append colors and sizes as JSON strings
            formData.append('colors', JSON.stringify(values.colors));
            formData.append('sizes', JSON.stringify(values.sizes));

            // Append the image
            // if (values.image) {
            //     formData.append('image', values.image);
            // }
            values.image.forEach((file) => {
                formData.append('image', file); // Append each image to FormData
            });
            console.log(formData)
            // API call with FormData
            const res = await axios.post(`${url}product/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                },
            });
            console.log(res.data);
            toast.success('Product Insert Successfully!!');
            resetForm();
        } catch (error) {
            console.log(error);
            toast.error('Error inserting product');
        }
    };


    return (
        <>
            <div className='flex-1 overflow-auto relative z-10'>
                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <Formik
                        initialValues={initialValues}
                        validate={validate}
                        onSubmit={onSubmit}
                        enctype="multipart/form-data"
                    >
                        {({ touched, errors, setFieldValue, values, isSubmitting }) => (
                            <Form className="space-y-4 p-8 max-w-xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 rounded-md">
                                {/* Image Upload Field */}
                                <h2 className='text-xl font-semibold mb-4 text-gray-100'>Product Insert Form</h2>
                                {/* <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-200">
                                        Product Image
                                    </label>
                                    <input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            setFieldValue("image", event.target.files[0]);
                                            console.log(event)
                                        }}
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.image && errors.image ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorMessage name="image" component="div" className="text-red-500 text-xs" />
                                </div> */}
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-200">
                                        Product Images
                                    </label>
                                    <input
                                        id="images"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        multiple // Allows selecting multiple files
                                        onChange={(event) => {
                                            setFieldValue("image", Array.from(event.target.files)); // Convert FileList to Array
                                        }}
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.image && errors.image ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    <ErrorMessage name="image" component="div" className="text-red-500 text-xs" />
                                    {values.image && values.image.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-400">Selected Images:</p>
                                            <ul className="list-disc list-inside text-gray-300">
                                                {values.image.map((file, index) => (
                                                    <li key={index}>{file.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>


                                {/* Title Field */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-200">
                                        Title
                                    </label>
                                    <Field
                                        id="title"
                                        name="title"
                                        type="text"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.title && errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorMessage name="title" component="div" className="text-red-500 text-xs" />
                                </div>
                                {/* Original Price Field */}
                                <div>
                                    <label htmlFor="original_price" className="block text-sm font-medium text-gray-200">
                                        Original Price
                                    </label>
                                    <Field
                                        id="original_price"
                                        name="OriginalPrice"
                                        type="number"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.OriginalPrice && errors.OriginalPrice ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorMessage name="OriginalPrice" component="div" className="text-red-500 text-xs" />
                                </div>

                                {/* Discount Field */}
                                <div>
                                    <label htmlFor="discount" className="block text-sm font-medium text-gray-200">
                                        Discount
                                    </label>
                                    <Field
                                        id="discount"
                                        name="discount"
                                        type="text"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.discount && errors.discount ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorMessage name="discount" component="div" className="text-red-500 text-xs" />
                                </div>

                                <div>
                                    <label htmlFor="discount" className="block text-sm font-medium text-gray-200">
                                        Stock
                                    </label>
                                    <Field
                                        id="stock"
                                        name="stock"
                                        type="text"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.stock && errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorMessage name="stock" component="div" className="text-red-500 text-xs" />
                                </div>
                                {/* Description Field */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-200">
                                        Description
                                    </label>
                                    <Field
                                        id="description"
                                        name="description"
                                        as="textarea"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.description && errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorMessage name="description" component="div" className="text-red-500 text-xs" />
                                </div>

                                {/* SKU Field */}
                                <div>
                                    <label htmlFor="sku" className="block text-sm font-medium text-gray-200">
                                        SKU
                                    </label>
                                    <Field
                                        id="sku"
                                        name="sku"
                                        type="text"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.sku && errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorMessage name="sku" component="div" className="text-red-500 text-xs" />
                                </div>


                                {/* Additional Description Field */}
                                <div>
                                    <label htmlFor="additional_description" className="block text-sm font-medium text-gray-200">
                                        Additional Description
                                    </label>
                                    <Field
                                        id="additional_description"
                                        name="details"
                                        as="textarea"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.details && errors.details ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <ErrorMessage name="details" component="div" className="text-red-500 text-xs" />
                                </div>

                                {/* Category Field */}
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-200">
                                        Category
                                    </label>
                                    <Field
                                        id="category"
                                        name="category"
                                        as='select'
                                        type="text"
                                        className={`mt-1 p-2 block w-full bg-gray-900 text-white border rounded-md ${touched.category && errors.category ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="" disabled className='text-gray-500'>
                                            Select Category
                                        </option>
                                        {Sales.length > 0 ? (
                                            Sales.map((item, index) => {
                                                return (
                                                    <option key={index} className='text-white' value={item.name}>{item.name}</option>
                                                );
                                            })) : (<option >
                                                No categories available
                                            </option>)
                                        }
                                    </Field>
                                    <ErrorMessage name="category" component="div" className="text-red-500 text-xs" />
                                </div>

                                {/* Color Field */}
                                <div className='color'>
                                    <label htmlFor="color" className="block text-sm font-medium text-gray-200">
                                        Color
                                    </label>
                                    <Field
                                        id="colors"
                                        name="colors"
                                        type="text"
                                        className={`mt-2 p-2 block w-full bg-gray-900 text-white border rounded-md`}
                                    >
                                        {({ field, meta }) => (
                                            <>
                                                <CustomChipInput
                                                    value={field.value}
                                                    onChange={(newChips) => setFieldValue('colors', newChips)}
                                                    placeholder="Enter colors..."
                                                    className={`mt-2 p-2 block w-full bg-gray-900 text-white border rounded-md ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                {meta.touched && meta.error && (
                                                    <div className="text-red-500 text-xs mt-1">{meta.error}</div>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </div>

                                {/* Sizes Field */}
                                <div>
                                    <label htmlFor="sizes" className="block text-sm font-medium text-gray-200">
                                        Sizes
                                    </label>
                                    <Field
                                        id="sizes"
                                        name="sizes"
                                        type="text"
                                        className={`mt-2 p-2 block w-full bg-gray-900 text-white border rounded-md`}
                                    >
                                        {({ field, meta }) => (
                                            <>
                                                <CustomChipInput
                                                    value={field.value}
                                                    onChange={(newChips) => setFieldValue('sizes', newChips)}
                                                    placeholder="Enter sizes..."
                                                    className={`mt-2 p-2 block w-full bg-gray-900 text-white border rounded-md ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                {meta.touched && meta.error && (
                                                    <div className="text-red-500 text-xs mt-1">{meta.error}</div>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center">
                                    <Button className='px-10 focus:outline-none' radius='sm' variant='shadow' color='primary' type='submit'>
                                        {isSubmitting ? "Inserting..." : "Insert"}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </main>

                {/* <MuiChipsInput value={chips} onChange={handleChange} className='bg-white text-black' /> */}
                {/* <CustomChipInput
                    value={Color}
                    onChange={setColor}
                    placeholder="Enter colors..."
                /> */}
            </div>
        </>
    );
}

export default ProductInsert;
