import React, { useEffect, useState } from 'react'
import AdminHeader from '../admin-components/common/AdminHeader'
// import StatCard from '../components/common/StatCard'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, DollarSign, ShoppingBag } from 'lucide-react';
import StatCard from '../admin-components/common/StatCard';
import DailyOrders from '../admin-components/orders/DailyOrders';
import DailyDistribution from '../admin-components/orders/DailyDistribution';
import OrdersTable from '../admin-components/orders/OrdersTable';
import axios from 'axios';
// import DailyOrders from '../components/orders/DailyOrders';
// import DailyDistribution from '../components/orders/DailyDistribution';
// import OrdersTable from '../components/orders/OrdersTable';

// const orderStats = {
//     totalOrders: "1,234",
//     pendingOrders: "56",
//     completedOrders: "1,178",
//     totalRevenue: "$98,765",
// };
let url = import.meta.env.VITE_ADMIN_URL;
function OrdersPage() {
    const [orderStats, setorderStats] = useState();

    const authToken = JSON.parse(localStorage.getItem('token'));
    const myFun = async () => {
        try {
            const res = await axios.get(`${url}report/sales`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(res.data);
            setorderStats(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        myFun();
    }, [])

    return (
        <>
            <div className='flex-1 relative z-10 overflow-auto'>
                <AdminHeader title={'Orders'} />

                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

                    {/* orders*/}

                    <motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}>
                        <StatCard name="Total Orders" icon={ShoppingBag} value={orderStats?.totalOrder || 0} color='#6366F1' />
                        <StatCard name="Pending Orders" icon={Clock} value={orderStats?.pendingOrder || 0} color='#F59E0B' />
                        <StatCard name="Completed Orders" icon={CheckCircle} value={orderStats?.completedOrder || 0} color='#10B981' />
                        <StatCard name="Total Revenue" icon={DollarSign} value={orderStats?.revenue || 0} color='#EF4444' />
                    </motion.div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                        <DailyOrders />
                        <DailyDistribution />
                    </div>

                    <OrdersTable />
                </main>
            </div>
        </>
    )
}

export default OrdersPage