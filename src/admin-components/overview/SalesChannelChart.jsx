import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import React from 'react'


const SALES_CHANNEL_DATA = [
    { name: 'Website', value: 45600 },
    { name: 'Mobile App', value: 38200 },
    { name: 'Marketplace', value: 29800 },
    { name: 'Social Media', value: 18700 },
];
export const COLORS = ['#6366f1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
function SalesChannelChart({ categoryData }) {
    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border lg:col-span-2 border-gray-700'>
                <h2 className='text-lg font-medium mb-4 text-gray-100'>Category Distribution</h2>
                <div className='h-80'>
                    <ResponsiveContainer>
                        <BarChart data={categoryData}>
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
                            <Bar dataKey={'totalProducts'} fill='#8884d8'>
                                {categoryData?.map((entry, index) => {
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

export default SalesChannelChart