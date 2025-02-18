import { Button, Pagination } from '@nextui-org/react'
import React, { useState } from 'react'
import { BsPersonFill } from 'react-icons/bs'
import { FaTag } from 'react-icons/fa'
import { LuChevronRight } from 'react-icons/lu'
import { MdCalendarMonth } from 'react-icons/md'
import { RiSearch2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Services from '../common/Services'
import Footer from '../common/Footer'

function Blog() {
            const [currentPage, setCurrentPage] = useState(1);
    const BlogPost = [
        { id: 1, img: '/Assets/41417cd682c30a19eecaf20a549cee89.jpg', tag: 'Wood', title: 'Going all-in with millennial design' },
        { id: 2, img: '/Assets/96ed5dc3b3d01cf6cd369ef7aff2f296.jpg', tag: 'Handmade', title: 'Exploring new ways of decorating' },
        { id: 3, img: '/Assets/4190307dc6c7273c0bbf5086605997e4.jpg', tag: 'Wood', title: 'Handmade pieces that took time to make' },
    ];
    const RecentPosts = [
        { id: 1, img: '/Assets/8b94b8e3a17bbb18c564006d557e73b1.jpg', title: `Going all-in with millennial design` },
        { id: 2, img: '/Assets/309ac985861a262b8622e7528e08049f.jpg', title: 'Exploring new ways of decorating' },
        { id: 3, img: '/Assets/6615f4968338e0a7004a86529ecf85c9.jpg', title: 'Handmade pieces that took time to make' },
        { id: 4, img: '/Assets/cfbc72a9932875eeb20db551bb01abb3.jpg', title: 'Modern home in Milan' },
        { id: 5, img: '/Assets/7de5c930d1538360f43cbfa1d7f00337.jpg', title: 'Colorful office redesign' },
    ]
    return (
        <>
            <div className='w-full bg-cover' style={{ backgroundImage: 'url("/Assets/Rectangle 1.png")', height: '316px' }}>
                <div className='flex items-center justify-center h-full'>
                    <div>
                        <div className='flex justify-center mb-3'>
                            <img src="/Assets/Meubel House_Logos-05.png" alt="#" />
                        </div>
                        <h2 className='text-center text-black text-5xl font-medium mb-4'>Blog</h2>
                        <div className='flex items-center justify-center'>
                            <Link to={'/'} className='text-black text-base font-medium' >Home</Link>
                            <LuChevronRight className='mx-2' size={'18px'} color='black' />
                            <span>Blog</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='pt-16 pb-10 px-24 flex gap-20'>
                <div>
                    {
                        BlogPost.map((item, index) => {
                            return (
                                <div className='mb-10' key={index}>
                                    <div className='w-[817px] h-[500px] rounded-lg'>
                                        <img src={item.img} alt="" className='h-full w-full object-cover rounded-lg' />
                                    </div>
                                    <div className='flex items-center mt-4 gap-10'>
                                        <div className='flex items-center gap-2'>
                                            <BsPersonFill size={20} color="#9F9F9F" />
                                            <span className='text-[#9F9F9F]'>Admin</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <MdCalendarMonth size={20} color="#9F9F9F" />
                                            <span className='text-[#9F9F9F]'>14 Oct 2022</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <FaTag size={20} color="#9F9F9F" />
                                            <span className='text-[#9F9F9F]'>{item.tag}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className='text-3xl font-medium text-black my-5'>{item.title}</h2>
                                        <p className='text-[#9F9F9F] text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et <br /> dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere sollicitudin <br /> aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim sed faucibus <br />  turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit libero. <br /> Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque ornare aene <br /> an euismod elementum.</p>
                                        <h3 className='text-base text-black text-justify underline underline-offset-8 mt-7'>Read more</h3>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                <div className='w-full'>
                    <div className='py-10 px-10'>
                        <div className=' flex items-center relative'>
                            <input type="text" className='border-1 border-gray-400 rounded-lg py-2 w-full' />
                            <RiSearch2Line size={20} color='black' className='absolute right-3' />
                        </div>
                        <div className='py-10 px-10'>
                            <h2 className='text-2xl text-black font-medium'>Categories</h2>
                            <div className='flex flex-col gap-10 mt-10'>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-[#9F9F9F]'>Crafts</h2>
                                    <span className='text-[#9F9F9F]'>2</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-[#9F9F9F]'>Design</h2>
                                    <span className='text-[#9F9F9F]'>8</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-[#9F9F9F]'>Handmade</h2>
                                    <span className='text-[#9F9F9F]'>7</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-[#9F9F9F]'>Interior</h2>
                                    <span className='text-[#9F9F9F]'>1</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-[#9F9F9F]'>Wood</h2>
                                    <span className='text-[#9F9F9F]'>6</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-11 pl-20'>
                        <h2 className='text-2xl text-black font-medium mb-5'>Recent Posts</h2>
                        <div className='flex flex-col gap-10'>
                            {
                                RecentPosts.map((item, index) => {
                                    return (
                                        <div className='flex items-center gap-3' key={index}>
                                            <div className='w-20 h-20 rounded-lg'>
                                                <img src={item.img} alt="" className='object-cover h-full w-full rounded-lg' />
                                            </div>
                                            <div className='w-3/5'>
                                                <h2 className='text-black'>{item.title}</h2>
                                                <p className='text-xs text-[#9F9F9F]'>03 Aug 2022</p>
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex gap-5 justify-center pb-10'>
                <Pagination showShadow color="#B88E2F" total={3} initialPage={1}
                    page={currentPage}
                    onChange={setCurrentPage} />
                <Button
                    size="md"
                    variant="flat"
                    color="#F9F1E7"
                    style={{ backgroundColor: '#F9F1E7' }}
                    onPress={() => setCurrentPage((prev) => (prev < 3 ? prev + 1 : prev))}
                >Next</Button>
            </div>
            <Services />
            <Footer />
        </>
    )
}

export default Blog