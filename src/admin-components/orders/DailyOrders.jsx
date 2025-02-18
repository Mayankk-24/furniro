import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import axios from 'axios';

// const dailyOrdersData = [
//     { date: '07/01', orders: 45 },
//     { date: '07/02', orders: 52 },
//     { date: '07/03', orders: 49 },
//     { date: '07/04', orders: 60 },
//     { date: '07/05', orders: 55 },
//     { date: '0706', orders: 58 },
//     { date: '07/07', orders: 62 },
// ];


let url = import.meta.env.VITE_ADMIN_URL;
function DailyOrders() {
    const [data, setData] = useState([]);
    const authToken = JSON.parse(localStorage.getItem('token'));


    const myFun = async () => {
        try {
            const res = await axios.get(`${url}order/ordersell`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);

            const transformedData = res.data.data.map(item => ({
                month: item._id, // Format month name
                sales: item.total,
            }));
            setData(transformedData);
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
                <h2 className='text-xl font-semibold mb-4 text-gray-100'>Daily Orders</h2>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke='#374151' />
                            <XAxis dataKey={"month"} stroke='#9ca3af' />
                            <YAxis stroke='#9ca3af' />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31,42,55,0.8)',
                                    borderColor: '#4B5563'
                                }}
                                itemStyle={{ color: '#E5E7EB' }} />
                            <Legend />
                            <Line type='monotone'
                                dataKey='sales'
                                stroke='#8B5CF6'
                                strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

        </>
    )
}

export default DailyOrders