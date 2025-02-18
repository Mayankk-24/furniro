import React, { useState } from 'react'
import SettingSection from './SettingSection'
import { Lock } from 'lucide-react'
import ToggleSwitch from './ToggleSwitch'
import { Link } from 'react-router-dom'

function Security() {
    const [twoFactor, setTwoFactor] = useState(false)
    return (
        <>
            <SettingSection icon={Lock} title={'Security'}>
                <ToggleSwitch label={"Two-Factor Authentication"}
                    isOn={twoFactor}
                    onToggle={() => setTwoFactor(!twoFactor)} />

                <div className='mt-4'>
                    <Link className='text-white hover:text-white font-bold' to={'changepass'}>
                        <button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 focus:outline-none'>Change Password</button>
                    </Link>
                </div>
            </SettingSection>


        </>
    )
}

export default Security