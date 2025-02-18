import { motion } from 'framer-motion'
import { Users, Zap, ShoppingBag, BarChart2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AdminHeader from '../admin-components/common/AdminHeader'
import StatCard from '../admin-components/common/StatCard';
import SalesOverviewChart from '../admin-components/overview/SalesOverviewChart'
import CategoryDistributionChart from '../admin-components/overview/CategoryDistributionChart'
import SalesChannelChart from '../admin-components/overview/SalesChannelChart'
import axios from 'axios';
import ProductSalesChart from '../admin-components/overview/ProductSalesChart';
import auth from '@/utils/Auth';

let url = import.meta.env.VITE_ADMIN_URL;
function OverviewPage() {
  const [Sales, setSales] = useState();

  const myFun = async () => {
    const authData = await auth();

    try {
      const res = await axios.get(`${url}report/sales`, {
        headers: {
          'Authorization': `Bearer ${authData.token}`
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
        <AdminHeader title="Overview" />

        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
          {/* stats */}

          <motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}>
            <StatCard name="Total Sales" icon={Zap} value={(Sales?.revenue || 0).toLocaleString()} color='#6366F1' isCurrency={true} />
            <StatCard name="Total Users" icon={Users} value={Sales?.user || 0} color='#8B5CF6' />
            <StatCard name="Total Products" icon={ShoppingBag} value={Sales?.totalProduct || 0} color='#EC4899' />
            <StatCard name="Total Category" icon={BarChart2} value={Sales?.category || 0} color='#10B981' />
          </motion.div>

          {/* charts */}

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <SalesOverviewChart />
            <ProductSalesChart />
            <SalesChannelChart categoryData={Sales?.categoryProduct} />
            <CategoryDistributionChart />
          </div>
        </main>
      </div>
    </>
  )
}

export default OverviewPage