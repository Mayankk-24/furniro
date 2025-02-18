import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import React from 'react'


const userDemographicsData = [
  { name: '18-24', value: 20 },
  { name: '25-34', value: 30 },
  { name: '35-44', value: 25 },
  { name: '45-54', value: 15 },
  { name: '55+', value: 10 },
];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

function UserDemographicsChart() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 lg:col-span-2'>
        <h2 className='text-lg font-medium mb-4 text-gray-100'>User Demographics</h2>

        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={userDemographicsData} cx={'50%'} cy={'50%'} outerRadius={80} fill='#8884d8' dataKey='value'
                label={({ name, percent }) => {
                  return (
                    `${name} ${(percent * 100).toFixed(0)}%`
                  );
                }}>
                {userDemographicsData.map((entry, index) => {
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

export default UserDemographicsChart