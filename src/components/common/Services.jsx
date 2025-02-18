import React from 'react'
import { MdOutlineSupportAgent } from 'react-icons/md';
import { TbRosetteDiscountCheck } from 'react-icons/tb';
import { GrTrophy } from 'react-icons/gr';
import { LiaShippingFastSolid } from 'react-icons/lia';
function Services() {
    const services = [
        { id: 1, head: "High Quality", des: 'crafted from top materials', icon: <GrTrophy size={60} /> },
        { id: 2, head: "Warranty Protection", des: 'Over 2 years', icon: <TbRosetteDiscountCheck size={60} /> },
        { id: 3, head: "Free Shipping", des: 'Order over 150 $', icon: <LiaShippingFastSolid size={60} /> },
        { id: 4, head: "24 / 7 Support", des: 'Dedicated support', icon: <MdOutlineSupportAgent size={60} /> },
    ];
    return (
        <>
            <div className='py-7 px-5 md:py-16 md:px-12 bg-[#FAF3EA] w-full'>
                <div className='grid grid-cols-2 lg:flex lg:items-center lg:justify-between '>
                    {
                        services.map((service, row) => {
                            return (
                                <div className='flex items-center ' key={row}>
                                    <span className='mr-5'>{service.icon}</span>
                                    <div className='mr-14'>
                                        <h2 className='font-semibold text-2xl text-black'>{service.head}</h2>
                                        <p style={{ color: '#898989' }} className='font-medium text-xl'>{service.des}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Services