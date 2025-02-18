import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const COLORS = ['#6366f1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
let url = import.meta.env.VITE_ADMIN_URL;

function CategoryDistributionChart() {
    const [Category, setCategory] = useState([]);

    const authToken = JSON.parse(localStorage.getItem('token'));
    const fetchCategoryData = async () => {
        try {
            const res = await axios.get(`${url}report/categorysell`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            // Transform the data for the chart
            const transformedData = res.data.data.map(item => ({
                name: item._id, // Category name
                value: item.total, // Total sales
            }));
            setCategory(transformedData);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 lg:col-span-2"
        >
            <h2 className="text-lg font-medium mb-4 text-gray-100">Top 5 Category Sales</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={Category}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {Category.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(31,42,55,0.8)',
                                borderColor: '#4B5563',
                            }}
                            itemStyle={{ color: '#E5E7EB' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export default CategoryDistributionChart;
