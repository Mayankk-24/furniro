import React from 'react'
import AdminHeader from '../admin-components/common/AdminHeader'
import Profile from '../admin-components/settings/Profile'
import Notifications from '../admin-components/settings/Notifications'
import Security from '../admin-components/settings/Security'
import ConnectedAccounts from '../admin-components/settings/ConnectedAccounts'
import DangerZone from '../admin-components/settings/DangerZone'

function SettingsPage() {
  return (
    <>
        <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <AdminHeader title='Settings' />
            <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
                <Profile />
                <Notifications />
                <Security />
                <ConnectedAccounts />
                <DangerZone />
            </main>
        </div>
    </>
  )
}

export default SettingsPage