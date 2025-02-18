import { Button } from '@nextui-org/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import CustomChipInput from '../../chip/CustomChipInput'; // Ensure this component is implemented correctly

let url = import.meta.env.VITE_ADMIN_URL;

function ProductUpdate() {
    const authToken = JSON.parse(localStorage.getItem('token'));
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [initialValues, setInitialValues] = useState({
        sku: '',
        OriginalPrice: '',
        discount: '',
        title: '',
        description: '',
        details: '',
        category: '',
        colors: [],
        sizes: [],
        stock: '',
        image: null,
    });

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${url}report/sales`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setCategories(res.data.categoryProduct || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    // Fetch product details
    const fetchProductDetails = async () => {
        try {
            const res = await axios.get(`${url}product/singleProduct/${id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const product = res.data.data[0];
            const productData = product.product;

            setInitialValues({
                sku: productData.sku || '',
                OriginalPrice: product.OriginalPrice || '',
                discount: product.discount || '',
                title: productData.title || '',
                description: productData.description || '',
                details: product.DescriptionData[0]?.details || '',
                category: productData.category?.name || '',
                colors: product?.ColorData[0]?.map(color => color) || [],
                sizes: product.SizeData[0]?.map(size => size) || [],
                stock: product.stock || '',
                image: productData.image[0], // Reset file input
            });
        } catch (error) {
            console.error('Failed to fetch product details:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProductDetails();
    }, []);

    useEffect(() => {
    }, [initialValues])

    const validate = (values) => {
        const errors = {};
        if (!values.sku) errors.sku = 'SKU is required';
        if (!values.OriginalPrice || values.OriginalPrice <= 0)
            errors.OriginalPrice = 'Original Price must be greater than zero';
        if (!values.discount) errors.discount = 'Discount is required';
        if (!values.stock || values.stock < 0) errors.stock = 'Stock cannot be negative';
        if (!values.title) errors.title = 'Title is required';
        if (!values.category) errors.category = 'Category is required';
        if (!values.colors.length) errors.colors = 'At least one color is required';
        if (!values.sizes.length) errors.sizes = 'At least one size is required';
        return errors;
    };

    const onSubmit = async (values, { resetForm }) => {
        console.log(values)
        try {
            //   const formData = new FormData();
            //   Object.keys(values).forEach((key) => {
            //     if (key === 'colors' || key === 'sizes') {
            //       formData.append(key, JSON.stringify(values[key]));
            //     } else if (key === 'image' && values.image) {
            //       formData.append(key, values.image);
            //     } else {
            //       formData.append(key, values[key]);
            //     }
            //   });

            //   await axios.post(`${url}product/update/${id}`, formData, {
            //     headers: { 'Content-Type': 'multipart/form-data' },
            //   });

            const res = await axios.put(`${url}product/change/${id}`, values, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);
            toast.success('Product updated successfully!');
            // resetForm();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(error.response?.data?.message || 'Failed to update product.');
        }
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validate={validate}
                    onSubmit={onSubmit}
                >
                    {({ setFieldValue, isSubmitting, values }) => (
                        <Form className="space-y-6 p-8 max-w-xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 rounded-md">
                            <h2 className="text-xl font-semibold mb-4 text-gray-100">Product Update Form</h2>

                            {/* Product Image Field */}
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-200">
                                    Product Image
                                </label>
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFieldValue('image', e.target.files[0])}
                                    className="mt-2 p-3 block w-full bg-gray-900 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
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
                                    className="mt-2 p-3 block w-full bg-gray-900 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Original Price Field */}
                            <div>
                                <label htmlFor="OriginalPrice" className="block text-sm font-medium text-gray-200">
                                    Original Price
                                </label>
                                <Field
                                    id="OriginalPrice"
                                    name="OriginalPrice"
                                    type="number"
                                    className="mt-2 p-3 block w-full bg-gray-900 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="OriginalPrice" component="div" className="text-red-500 text-xs mt-1" />
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
                                    className="mt-2 p-3 block w-full bg-gray-900 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="discount" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Stock Field */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-200">
                                    Stock
                                </label>
                                <Field
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    className="mt-2 p-3 block w-full bg-gray-900 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="stock" component="div" className="text-red-500 text-xs mt-1" />
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
                                    className="mt-2 p-3 block w-full bg-gray-900 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Additional Description Field */}
                            <div>
                                <label htmlFor="details" className="block text-sm font-medium text-gray-200">
                                    Additional Description
                                </label>
                                <Field
                                    id="details"
                                    name="details"
                                    as="textarea"
                                    className="mt-2 p-3 block w-full bg-gray-900 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="details" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Category Field */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-200">
                                    Category
                                </label>
                                <Field
                                    id="category"
                                    name="category"
                                    as="select"
                                    className="mt-2 p-3 block w-full bg-gray-900 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>
                                        Select Category
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="category" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Colors Field */}
                            <div>
                                <label htmlFor="colors" className="block text-sm font-medium text-gray-200">
                                    Colors
                                </label>
                                <CustomChipInput
                                    value={values.colors}
                                    onChange={(newChips) => setFieldValue('colors', newChips)}
                                    placeholder="Enter colors..."
                                />
                            </div>

                            {/* Sizes Field */}
                            <div>
                                <label htmlFor="sizes" className="block text-sm font-medium text-gray-200">
                                    Sizes
                                </label>
                                <CustomChipInput
                                    value={values.sizes}
                                    onChange={(newChips) => setFieldValue('sizes', newChips)}
                                    placeholder="Enter sizes..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center">
                                <Button
                                    className='px-10 focus:outline-none' radius='sm' variant='shadow' color='primary' type='submit'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Product'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </main>
        </div>
    );
}

export default ProductUpdate;
