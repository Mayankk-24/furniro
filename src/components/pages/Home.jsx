import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../products/ProductCard'
import { FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineHorizontalRule } from 'react-icons/md';
import { SlArrowRight } from 'react-icons/sl';
import axios from 'axios';
import Footer from '../common/Footer';
import EmblaCarousel from '@/carousel/EmblaCarousel';

let url = import.meta.env.VITE_PUBLIC_URL;
function Home() {
  const OPTIONS = { dragFree: true, loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());


  const catProducts = [
    { id: 1, name: 'Dining', img: '/Assets/image 106.png' },
    { id: 2, name: 'Living', img: '/Assets/image 100.png' },
    { id: 3, name: 'Bedroom', img: '/Assets/image 101.png' },
  ]

  // api call state, effect []
  const [products, setProducts] = useState([]);
  const showCards = async () => {
    try {
      const res = await axios.get(`${url}card/all`);
      setProducts(res.data.data);
      console.log(res.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    showCards();
  }, [])

  return (
    <>
      <div className="w-full bg-cover bg-no-repeat" style={{ height: '716px', backgroundImage: 'url("/Assets/scandinavian-interior-mockup-wall-decal-background 1.png")' }}>
        <div className='relative pr-10 h-fit'>
          <div className='bg-bg-box rounded-lg p-10 right-14 top-52 absolute' style={{ width: '643px', height: 'fit-content' }}>
            <h5 className='text-base tracking-widest text-black font-semibold my-2'>New Arrival</h5>
            <h2 className='text-5xl font-bold text-primary leading-tight mb-2'>Discover Our<br />New Collection</h2>
            <p className='text-lg font-medium text-black mb-11'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.</p>
            <Link to={'/shop'} className='text-white hover:text-white bg-primary  px-16 py-5 text-base font-bold rounded-none'>BUY NOW</Link>
          </div>
        </div>
      </div>

      <div className="container text-center py-10">
        <h2 className='text-3xl font-bold'>Browse The Range</h2>
        <p className='text-xl font-normal text-gray-500 mt-1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className="container px-28">
        <div className='flex gap-x-3 justify-between'>
          {
            catProducts.map((product, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center rounded-lg overflow-hidden"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={product.img}
                      alt="product"
                      className="object-cover hover:scale-105 transition-transform rounded-lg"
                      width="410px"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mt-3" style={{ color: "rgba(51, 51, 51, 1)" }}>
                    {product.name}
                  </h3>
                </div>

              )
            })
          }
        </div>
      </div>

      <div className="container text-center py-10 mt-3">
        <h2 className='text-3xl font-bold' style={{ color: '#3A3A3A' }}>Our Products</h2>
      </div>

      <div className="container px-20 grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 lg:gap-x-10 lg:gap-y-10">

        {/** state map-> props */
          products.map((item, index) => {
            return (
              <ProductCard key={index}
                Cid={item._id}
                img={item.image}
                title={item.title}
                des={item.description}
                price={item.OriginalPrice}
                disprice={item.DiscountedPrice}
                discount={item.discount} />
            )
          })
        }
      </div>

      <div className="container py-10 text-center">
        <button className='rounded-none border-2 border-primary bg-white px-12 text-primary font-semibold text-base'>Show More</button>
      </div>

      <div className="container flex items-center py-11" style={{ backgroundColor: '#FCF8F3', height: '670px' }}>
        <div className='w-1/2 p-20'>
          <h2 className='text-font-pri text-5xl leading-tight font-bold'>50+ Beautiful rooms<br />
            inspiration</h2>
          <p style={{ color: '#616161' }} className='font-medium text-lg mt-1 mb-6'>Our designer already made a lot of beautiful <br />   prototipe of rooms that inspire you</p>
          <button className='bg-primary rounded-none text-white px-10'>Explore More</button>
        </div>
        {/* <div className='h-full w-fit relative mr-6'>
          <img src="/Assets/Rectangle 24.png" alt="#" />
          <div className='absolute bottom-5 left-5 flex items-end'>
            <div className='bg-white bg-opacity-70 py-5 px-4 flex flex-col justify-center' style={{ width: '217px', height: '130px' }}>
              <p className='text-base font-medium mb-2' style={{ color: '#616161' }}>01 <MdOutlineHorizontalRule style={{ display: 'inline' }} /><MdOutlineHorizontalRule style={{ display: 'inline' }} />  Bed Room</p>
              <h3 className='text-3xl font-semibold text-font-pri '>Inner Peace</h3>
            </div>
            <div className='h-12 w-12 bg-primary text-white flex items-center justify-center'><FaArrowRightLong size={'22px'} />
            </div>
          </div>
        </div> */}
        {/* <div className='h-full'>
          <div className='flex relative items-center' style={{ maxWidth: '450px', width: '100%', overflow: 'hidden' }}>
            <div className='h-12 w-12 rounded-full bg-white shadow-md absolute right-10 flex items-center justify-center '><SlArrowRight color='#B88E2F' size={'18px'} /></div>
            <img src="/Assets/Rectangle 25.png" alt="#" className='h-fit mr-6' />
            <img src="/Assets/25a06a33769af9bf5fe8f8ed81ce75d8.png" alt="" className='object-cover' style={{ height: '486px', maxWidth: '100%' }} />
          </div>
          <div className='flex items-center gap-5 mt-10'>
            <div className='p-1 border border-primary rounded-full'><div className='bg-primary h-2.5 w-2.5 rounded-full'></div></div>
            <div className='rounded-full h-2.5 w-2.5' style={{ backgroundColor: '#D8D8D8' }}></div>
            <div className='rounded-full h-2.5 w-2.5' style={{ backgroundColor: '#D8D8D8' }}></div>
            <div className='rounded-full h-2.5 w-2.5' style={{ backgroundColor: '#D8D8D8' }}></div>
          </div>
        </div> */}
        <div>
          <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </div>
      </div>

      <div className="container py-12">
        <div className='text-center relative top-6'>
          <h4 className='font-semibold text-xl mb-1' style={{ color: '#616161' }}>Share your setup with</h4>
          <h2 className='text-font-pri font-bold text-4xl'>#FuniroFurniture</h2>
        </div>
        <div id='main-div'>
          <div id='upper-sec' className='grid grid-cols-3' >
            <div id='left' className='grid grid-cols-2 items-end h-fit'>
              <div style={{ width: '274px', height: '382px' }} className='transform -translate-x-48'><img src="/Assets/1da1dc5c1c4cd5091a6369784c3b3366.png" alt="" className='h-full ' /></div>
              <div style={{ width: '451px', height: '312px' }} className='transform -translate-x-36'><img src="/Assets/Rectangle 38.png" alt="" className='h-full w-full ' /></div>
            </div>
            <div id='middle' className='flex justify-center items-center'>
              <div className='relative right-1.5 top-1/3' style={{ width: '330px' }}><img src="/Assets/Rectangle 40.png" alt="" className='w-full' /></div>
            </div>
            <div id='right' className='grid grid-cols-2 col-end-4 items-end'>
              <div style={{ width: '290px', height: '348px' }} className='transform -translate-x-16'><img src="/Assets/Rectangle 43.png" alt="" /></div>
              <div><img src="/Assets/Rectangle 45.png" alt="" /></div>
            </div>
          </div>
          <div id="lower-sec" className='flex justify-between'>
            <div id="left" className='flex items-start h-fit relative transform -translate-y-8'>
              <div style={{ height: '323px', width: '381px' }} className='absolute -left-48'><img src="/Assets/2f4aae4edaceced4645de9ad49216504.png" alt="" className='h-full object-cover w-full left-0 ' /></div>
              <div className='transform translate-x-52 ml-2'><img src="/Assets/Rectangle 39.png" alt="" /></div>
            </div>
            <div id="right" className='flex mt-6' style={{ width: '570px' }}>
              <div style={{ width: '178px', height: '242px' }} className='mr-6'><img src="/Assets/Rectangle 41.png" alt="" />
              </div>
              <div><img src="/Assets/Rectangle 44.png" alt="" className='object-cover' /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container border-t-2 mt-5">
        <Footer />
      </div>
    </>
  )
}

export default Home