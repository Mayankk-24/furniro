import { motion } from 'framer-motion'
import { UserCheck, UserPlus, UserIcon, UserX } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AdminHeader from '../admin-components/common/AdminHeader'
import StatCard from '../admin-components/common/StatCard'
import UserTable from '../admin-components/users/UserTable'
import UserGrowthChart from '../admin-components/users/UserGrowthChart'
import UserDemographicsChart from '../admin-components/users/UserDemographicsChart'
import UserActivityHeatmap from '../admin-components/users/UserActivityHeatmap'
import axios from 'axios'

const userStats = {
    totalUsers: 152845,
    newUserToday: 243,
    activeUsers: 98520,
    churnRate: "2.4%"
};
let url = import.meta.env.VITE_ADMIN_URL;
function UsersPage() {

    const [Sales, setSales] = useState();

    const authToken = JSON.parse(localStorage.getItem('token'));
    const myFun = async () => {
        try {
            const res = await axios.get(`${url}report/sales`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);
            setSales(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        myFun();
    }, [])
    return (
        <>
            <div className='flex-1 overflow-auto relative z-10 '>
                <AdminHeader title="Users" />

                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    {/* stats */}

                    <motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}>
                        <StatCard name="Total Users" icon={UserIcon} value={Sales?.user || 0} color='#6366F1' />
                        <StatCard name="New Users Today" icon={UserPlus} value={0} color='#10B981' />
                        <StatCard name="Active Users" icon={UserCheck} value={Sales?.activeUser || 0} color='#F59E0B' />
                        <StatCard name="Churn Rate" icon={UserX} value={Sales?.inactiveUser || 0} color='#EF4444' />
                    </motion.div>
                    <UserTable />

                    {/* user charts */}

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
                        <UserGrowthChart />
                        <UserActivityHeatmap />
                        <UserDemographicsChart />
                    </div>
                </main>
            </div>
        </>
    )
}

export default UsersPage