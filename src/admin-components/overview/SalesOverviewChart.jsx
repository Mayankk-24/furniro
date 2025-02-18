import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import moment from 'moment';

let url = import.meta.env.VITE_ADMIN_URL;
function SalesOverviewChart() {
    const [Sales, setSales] = useState([]);

    const authToken = JSON.parse(localStorage.getItem('token'));
    const fetchSalesData = async () => {
        try {
            const res = await axios.get(`${url}report/last5month`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);

            // Transform API data to include month names
            const transformedData = res.data.data.map(item => ({
                month: item._id, // Format month name
                sales: item.total,
            }));

            setSales(transformedData);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        >
            <h2 className="text-lg font-medium mb-4 text-gray-100">Sales Overview</h2>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Sales}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(31,42,55,0.8)',
                                borderColor: '#4B5563',
                            }}
                            itemStyle={{ color: '#E5E7EB' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#6366F1"
                            strokeWidth={3}
                            dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export default SalesOverviewChart;
