import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

import React, { useEffect, useState } from 'react'
import AdminHeader from '../admin-components/common/AdminHeader'
import StatCard from '../admin-components/common/StatCard'
import ProductsTable from '../admin-components/products/ProductsTable'
import CategoryDistributionChart from '../admin-components/overview/CategoryDistributionChart'
import SalesTrendChart from '../admin-components/products/SalesTrendChart'
import axios from 'axios'
import SalesOverviewChart from '../admin-components/overview/SalesOverviewChart'
import ProductSalesChart from '../admin-components/overview/ProductSalesChart'

let url = import.meta.env.VITE_ADMIN_URL;
function ProductsPage() {

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
      <div className='flex-1 overflow-auto relative z-10'>
        <AdminHeader title="Products" />

        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
          {/* stats */}

          <motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}>
            <StatCard name="Total Products" icon={Package} value={Sales?.totalProduct || 0} color='#6366F1' />
            <StatCard name="Top Selling" icon={TrendingUp} value='89' color='#10B981' />
            <StatCard name="Low Stock" icon={AlertTriangle} value='23' color='#F59E0B' />
            <StatCard name="Total Revenue" icon={DollarSign} value={Sales?.revenue || 0} color='#EF4444' isCurrency={true} />
          </motion.div>

          {/* ProductTable */}
          <ProductsTable />
          {/* Charts */}
          <div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
            {/* <SalesTrendChart /> */}
            <SalesOverviewChart />
            <ProductSalesChart />
            <CategoryDistributionChart />
          </div>
        </main>
      </div>
    </>
  )
}

export default ProductsPage