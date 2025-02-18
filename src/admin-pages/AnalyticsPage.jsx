import React from 'react'
import AdminHeader from '../admin-components/common/AdminHeader'
import OverviewCards from '../admin-components/analytics/OverviewCards'
import RevenueChart from '../admin-components/analytics/RevenueChart'
import ChannelPerformance from '../admin-components/analytics/ChannelPerformance'
import ProductPerformance from '../admin-components/analytics/ProductPerformance'
import UserRetention from '../admin-components/analytics/UserRetention'
import CustomerSegmentation from '../admin-components/analytics/CustomerSegmentation'
import AIPoweredInsights from '../admin-components/analytics/AIPoweredInsights'
// import Header from '../components/common/Header'
// // import { motion } from 'framer-motion'
// import OverviewCards from '../components/analytics/OverviewCards'
// import RevenueChart from '../components/analytics/RevenueChart'
// import ChannelPerformance from '../components/analytics/ChannelPerformance'
// import ProductPerformance from '../components/analytics/ProductPerformance'
// import UserRetention from '../components/analytics/UserRetention'
// import CustomerSegmentation from '../components/analytics/CustomerSegmentation'
// import AIPoweredInsights from '../components/analytics/AIPoweredInsights'

function AnalyticsPage() {
  return (
    <>
      <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
        <AdminHeader title='Analytics Dashboard' />

        <main className='max-w-7xl mx-auto py-6 lg:px-8'>
          <OverviewCards />
          <RevenueChart />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
            <ChannelPerformance />
            <ProductPerformance />
            <UserRetention />
            <CustomerSegmentation />
          </div>
          <AIPoweredInsights />
        </main>
      </div>
    </>
  )
}

export default AnalyticsPage