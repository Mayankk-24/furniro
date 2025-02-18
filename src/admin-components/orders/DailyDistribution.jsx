import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import React, { useEffect, useState } from 'react'
import axios from 'axios';


const orderStatusData = [
  { name: 'Pending', value: 30 },
  { name: 'Processing', value: 45 },
  { name: 'Shipped', value: 60 },
  { name: 'Delivered', value: 120 },
];
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA'];
let url = import.meta.env.VITE_ADMIN_URL;
function DailyDistribution() {
  const [orderStatusData, setorderStatusData] = useState([]);
  const authToken = JSON.parse(localStorage.getItem('token'));

  const myFun = async () => {
    try {
      const res = await axios.get(`${url}order/orderreport`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const transformedData = res.data.data.map(item => ({
        name: item.label,
        value: item.value,
      }));
      setorderStatusData(transformedData);
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
        transition={{ delay: 0.3 }}
        className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 lg:col-span-1'>
        <h2 className='text-xl font-semibold mb-4 text-gray-100'>Order Status Distribution</h2>


        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={orderStatusData} cx={'50%'} cy={'50%'} outerRadius={80} fill='#8884d8' dataKey='value'
                label={({ name, percent }) => {
                  return (
                    `${name} ${(percent * 100).toFixed(0)}%`
                  );
                }}>
                {orderStatusData.map((entry, index) => {
                  return (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  );
                })}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31,42,55,0.8)',
                  borderColor: '#4B5563'
                }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  )
}

export default DailyDistribution