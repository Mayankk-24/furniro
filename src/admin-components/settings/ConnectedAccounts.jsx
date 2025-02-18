import React,{useState} from 'react'
import SettingSection from './SettingSection'
import { HelpCircle, Plus } from 'lucide-react';

function ConnectedAccounts() {
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      name: "Google",
      connected: true,
      icon: "/google.png",
    },
    {
      id: 2,
      name: "Facebook",
      connected: false,
      icon: "/facebook.svg",
    },
    {
      id: 3,
      name: "Twitter",
      connected: true,
      icon: "/x.png",
    },
  ]);
  return (
    <>
      <SettingSection icon={HelpCircle} title={'Connected Accounts'}>
        {connectedAccounts.map((accounts) => (
          <div key={accounts.id} className='flex items-center justify-between py-3'>
            <div className='flex gap-1'>
              <img src={accounts.icon} alt='accounts' className='size-6 object-cover rounded-full mr-2' />
              <span className='text-gray-300'>{accounts.name}</span>
            </div>
            <button className={`px-3 py-1 rounded ${
              accounts.connected ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
            } transition duration-200`}
            onClick={()=>{
              setConnectedAccounts(
                connectedAccounts.map((acc) => {
                  if(acc.id === accounts.id){
                    return ({...acc, connected: !acc.connected});
                  }
                  return acc;
                })
              )
            }}>
              {accounts.connected ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
        <button className='mt-4 flex items-center text-indigo-400 hover:text-indigo-300 transition duration-200 bg-transparent'>
          <Plus size={18} className='mr-2' /> Add Account
        </button>
      </SettingSection>
    </>
  )
}

export default ConnectedAccounts