import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart, Cell, Legend } from 'recharts'
import { motion } from 'framer-motion'
import { COLORS } from './SalesChannelChart';
import axios from 'axios';

let url = import.meta.env.VITE_ADMIN_URL;
function ProductSalesChart() {
    const [ProductSell, setProductSell] = useState([]);

  const authToken = JSON.parse(localStorage.getItem('token'));
    const myFun = async () => {
        try {
            const res = await axios.get(`${url}report/productsell`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setProductSell(res.data.data);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        myFun();
    }, [])

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'>
                <h2 className='text-lg font-medium mb-4 text-gray-100'>Top 5 Selling Products</h2>

                <div className='h-80'>
                    <ResponsiveContainer>
                        <BarChart data={ProductSell}>
                            <CartesianGrid strokeDasharray="3 3" stroke='#4B5563' />
                            <XAxis dataKey='name' stroke='#9CA3AF' interval={0}
                                tick={{ angle: -15, textAnchor: 'middle', dy: 10 }} />
                            <YAxis stroke='#9CA3AF' />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31,42,55,0.8)',
                                    borderColor: '#4B5563'
                                }}
                                itemStyle={{ color: '#E5E7EB' }} />
                            <Legend />
                            <Bar dataKey={'quantity'} fill='#8884d8'>
                                {ProductSell?.map((entry, index) => {
                                    return (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    );
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </>
    )
}

export default ProductSalesChart