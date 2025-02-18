import React, { useEffect, useState } from 'react'
import SettingSection from './SettingSection'
import { User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import auth from '@/utils/Auth';
import { toast } from 'sonner';

let url = import.meta.env.VITE_ADMIN_URL
function Profile() {
  const [Admin, setAdmin] = useState();
  const navigate = useNavigate();
  const getAdmin = async () => {
    const authToken = await auth();
    try {
      const res = await axios.get(`${url}single`, {
        'headers': {
          'Authorization': `Bearer ${authToken.token}`
        }
      });
      console.log(res.data);
      setAdmin(res.data.data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAdmin();
  }, [])

  const handleLogout = async () => {
    const authToken = await auth();
    try {
      const res = await axios.put(`${url}logout`, {}, {
        'headers': {
          'Authorization': `Bearer ${authToken.token}`
        }
      });
      console.log(res.data);
      if (res.status === 200) {
        toast.success('Successfully logout');
        navigate('/signin');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <SettingSection icon={User} title={'Profile'}>
        <div className='flex flex-col sm:flex-row items-center mb-6'>
          <img src={Admin?.image} alt="profile" className='rounded-full w-20 h-20 object-cover mr-4' />
          <div>
            <h3 className='text-lg font-semibold text-gray-100'>{Admin?.firstname || 'admin not found'} {Admin?.lastname}</h3>
            <p className='text-gray-400'>{Admin?.email}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Link className='text-white hover:text-white font-bold' to={'editadmin'}>
            <button className='bg-indigo-600 hover:bg-indigo-700 focus:outline-none text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'>
              Edit Profile
            </button>
          </Link>
          <button className='bg-red-600 focus:outline-none hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto' onClick={handleLogout}>Logout</button>
        </div>
      </SettingSection>
    </>
  )
}

export default Profile