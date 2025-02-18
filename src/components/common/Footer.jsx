import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <>
            <footer className='mx-10 md:mx-20 py-10 flex border-b-2'>
                <div id='left' className='mr-32'>
                    <h3 className='font-bold text-2xl text-black mb-10'>Funiro.</h3>
                    <p style={{ color: '#9F9F9F' }} className='font-normal text-base'>400 University Drive Suite 200 Coral <br /> Gables, <br />
                        FL 33134 USA</p>
                </div>
                <div id='right' className='flex flex-col md:flex-row gap-5 md:gap-24'>
                    <div className='mr-20'>
                        <h3 className='text-base font-medium mb-8' style={{ color: '#9F9F9F' }}>Links</h3>
                        <ul className='leading-10'>
                            <li className='mb-2'><Link to={'/'} className='text-black text-base font-medium' >Home</Link></li>
                            <li className='mb-2'><Link to={'/shop'} className='text-black text-base font-medium'>Shop</Link></li>
                            <li className='mb-2'><Link to={'/blog'} className='text-black text-base font-medium'>Blog</Link></li>
                            <li className='mb-2'><Link to={'/contact'} className='text-black text-base font-medium'>Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-base font-medium mb-8' style={{ color: '#9F9F9F' }}>Helps</h3>
                        <ul className='leading-10'>
                            <li className='mb-2'><a className='text-black text-base font-medium hover:text-black'>Payment Options</a></li>
                            <li className='mb-2'><a className='text-black text-base font-medium hover:text-black'>Returns</a></li>
                            <li className='mb-2'><a className='text-black text-base font-medium hover:text-black'>Privacy Policies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-base font-medium mb-8' style={{ color: '#9F9F9F' }}>Newsletter</h3>
                        <div className='flex'>
                            <input type="text" placeholder="Enter your email address" className="w-full h-10
                            pr-10
                            text-base
                            border-b-2 border-black
                            focus:outline-none
                            focus:border-black-500
                            "/>
                            <button className='font-medium text-sm text-black underline decoration-auto decoration-solid outline-none border-none bg-white' style={{ textUnderlineOffset: '14px', textDecorationThickness: '1.5px' }}>SUBSCRIBE</button>
                        </div>
                    </div>
                </div>
            </footer>
            <div className='px-20 py-7 text-base font-medium text-black'>2023 furino. All rights reverved</div>
        </>
    )
}

export default Footer