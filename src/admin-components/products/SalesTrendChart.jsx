import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
];

function SalesTrendChart() {
    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'>
                <h2 className='text-xl font-semibold mb-4 text-gray-100'>Sales Trend </h2>

                <div style={{width:'100%',height:'300px'}}>
                    <ResponsiveContainer>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke='#4B5563' />
                            <XAxis dataKey={"month"} stroke='#9ca3af' />
                            <YAxis stroke='#9ca3af' />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31,42,55,0.8)',
                                    borderColor: '#4B5563'
                                }}
                                itemStyle={{ color: '#E5E7EB' }} />
                            <Line type='monotone'
                                dataKey='sales'
                                stroke='#6366F1'
                                strokeWidth={3}
                                dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8, strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </>
    )
}

export default SalesTrendChart