import React, { useState, useEffect, createContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LuChevronRight } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { PiLineVerticalThin } from 'react-icons/pi'
import { Rating } from '@mui/material'
import { FaFacebook } from 'react-icons/fa'
import { AiFillTwitterCircle } from 'react-icons/ai'
import { BsLinkedin } from 'react-icons/bs'
import { Avatar } from '@nextui-org/react'
import axios from 'axios'
import ProductCard from './ProductCard'
import Footer from '../common/Footer'
import { toast } from 'sonner'
import useCompareStore from '../../manage/compareStore'
import FeedBack from './FeedBack'
import auth from '@/utils/Auth'
import addCartsStore from '@/manage/addCartsStore'

let url = import.meta.env.VITE_PUBLIC_URL;
function ProductInfo({ cid, pid }) {
    const [ProductDetail, setProductDetail] = useState([]);
    const [value, setValue] = useState(1);
    const [SelectedSize, setSelectedSize] = useState([]);
    const [SelectedColor, setSelectedColor] = useState('');
    const [ratingValue, setRatingValue] = useState(0);
    const [activeTab, setActiveTab] = useState("description");

    const tabs = [
        { id: "description", label: "Description" },
        { id: "reviews", label: `Reviews [${ProductDetail?.RatingData?.length || 0}]` },
    ];

    const { id } = useParams();
    const { addCart, carts } = addCartsStore();

    const handleAddToCart = async (CartId, ProductName) => {
        // toast.custom((t) => handleToast(t, 'red'))

        const authData = await auth();
        try {
            const res = await axios.post(`${url}cart/add/${CartId}`, {
                color: SelectedColor,
                size: SelectedSize,
                quantity: value,
            }, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                }
            });
            console.log("data posted", res.data);
            if (res.status === 200) {
                toast.success("Product added to cart successfully!", { duration: 3000 })
                const addCartList = {
                    id: CartId,
                    ProductName: ProductName,
                }
                const isAlreadyInCart = carts.some(cart => cart.id === CartId);
                if (!isAlreadyInCart) {
                    addCart(addCartList);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    const [ImageDetails, setImageDetails] = useState([])
    const myFun = async () => {
        try {
            let res = await axios.get(`${url}product/singleProduct/${id}`)
            console.log(res.data.data)
            setProductDetail(res.data.data);
            setImageDetails(res.data.data?.product.image[0]);
            setRatingValue(res.data.data?.review || 0);
            setSelectedSize(res.data.data?.SizeData[0]?.[0] || " ");
            setSelectedColor(res.data.data?.ColorData[0]?.[0] || " ");
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        myFun();
    }, [])

    const handleCompare = (id) => {
        console.log(id)
        let cmp = JSON.parse(localStorage.getItem('cmp1')) || [];
        localStorage.setItem('cmp1', JSON.stringify([...cmp, id]));
    }


    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const RelatedID = ProductDetail?.product?._id;
    const showCards = async () => {
        try {
            const res = await axios.get(`${url}product/related/${RelatedID}`);
            setProducts(res.data.data);
            setVisibleProducts(res.data.data.slice(0, 4));
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        showCards();
    }, [ProductDetail])

    const handleShowMore = () => {
        if (showMore) {
            setVisibleProducts(products.slice(0, 4));
        } else {
            setVisibleProducts(products);
        }
        setShowMore(!showMore);
    };

    return (
        <>
            <div className="container px-20 py-8 flex items-center" style={{ backgroundColor: '#F9F1E7' }}>
                <Link to={'/'} className='text-base font-medium' style={{ color: '#9F9F9F' }}>Home</Link>
                <LuChevronRight className='mx-6' size={'18px'} color='black' />
                <Link to={'/shop'} className=' text-base font-medium' style={{ color: '#9F9F9F' }} >Shop</Link>
                <LuChevronRight className='ml-6 mr-2' size={'18px'} color='black' />
                <PiLineVerticalThin size={'28px'} color='#9F9F9F' className='mr-3' />
                <span className='text-base font-normal text-black'>{ProductDetail?.product?.title}</span>
            </div>

            <div className="container px-24 py-10 flex border-b-2">
                <div id='left-sec' className='flex gap-9'>
                    <div className='flex flex-col gap-5'>
                        {/* {
                            ProductDetail?.product?.image && ProductDetail?.product?.image?.map((item, index) => {
                                if (item == ImageDetails) return null;
                                return (
                                    <div className='rounded-xl flex items-center justify-center bg-[#F9F1E7] h-[80px] w-[76px]' key={index}>
                                        <img src={item} alt="#" className='object-cover h-full w-full rounded-lg ' onClick={() => setImageDetails(item)} />
                                    </div>
                                );
                            })
                        } */}
                        <div className='rounded-xl flex items-center justify-center bg-[#F9F1E7] h-[80px] w-[76px]'>
                            <img src={ImageDetails} alt="#" className='object-cover h-full w-full rounded-lg '
                            />
                        </div>

                        <div className='rounded-xl flex items-center justify-center bg-[#F9F1E7] h-[80px] w-[76px]'>
                            <img src={ImageDetails} alt="#" className='object-cover h-full w-full rounded-lg '
                            />
                        </div>

                        <div className='rounded-xl flex items-center justify-center bg-[#F9F1E7] h-[80px] w-[76px]'>
                            <img src={ImageDetails} alt="#" className='object-cover h-full w-full rounded-lg '
                            />
                        </div>

                        <div className='rounded-xl flex items-center justify-center bg-[#F9F1E7] h-[80px] w-[76px]'>
                            <img src={ImageDetails} alt="#" className='object-cover h-full w-full rounded-lg '
                            />
                        </div>
                    </div>
                    <div className='w-[423px] h-[500px] bg-[#F9F1E7] rounded-xl flex items-center justify-center'>
                        <img src={ImageDetails} alt="Loading...." className='object-cover h-full w-full rounded-xl' />
                    </div>
                </div>

                <div id="right" className='pl-28'>
                    <div>
                        <h2 className="text-[42px] font-normal text-black">{ProductDetail?.product?.title}</h2>
                        <p className='text-2xl font-medium text-[#9F9F9F]'>Rs. {ProductDetail?.product?.price}</p>
                        <div className='flex items-center'>
                            <Rating name="size-medium" value={ratingValue} precision={0.5} className='my-4' onChange={(e) => setRatingValue(parseInt(e.target.value))} />
                            <PiLineVerticalThin size={'28px'} color='#9F9F9F' className='mr-3' />
                            <span>{ProductDetail?.RatingData?.length || 0} customer reviews</span>
                        </div>
                        <p className='text-sm font-normal text-black mb-4'>{ProductDetail?.product?.description}</p>
                    </div>
                    <div>
                        <div>
                            <h5 className='text-[#9F9F9F] text-sm font-normal mb-3'>Size</h5>
                            <div className='flex gap-4 mb-5'>
                                {
                                    ProductDetail?.SizeData && ProductDetail?.SizeData[0].map((itemValue, index) => {

                                        return (
                                            <div className='' key={index}>
                                                <button className={`${SelectedSize === itemValue ? "text-white bg-primary"
                                                    : "text-black bg-[#F9F1E7]"
                                                    } h-fit w-fit rounded-md flex items-center justify-center focus:outline-none`} onClick={() => setSelectedSize(itemValue)}>{itemValue}</button>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <h5 className='text-[#9F9F9F] text-sm font-normal mb-3'>Color</h5>
                            <div className='flex gap-4 mb-5'>
                                {
                                    ProductDetail?.ColorData && ProductDetail?.ColorData[0].map((clrValue, index) => {
                                        return (
                                            <button className={`rounded-full p-[20px] focus:outline-none ${SelectedColor === clrValue ? 'scale-125 shadow-lg ' : ''}`}
                                                style={{ backgroundColor: `${clrValue === '#FFFFFF' ? "#000000" : clrValue}` }} key={index} onClick={() => setSelectedColor(clrValue)}></button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className='mt-7 flex items-center gap-5 border-b-2 pb-11 mb-10'>
                        <div className="flex items-center border-2 w-fit rounded-lg">
                            {/* Decrement Button */}
                            <button
                                onClick={() => setValue((prev) => prev - 1)}
                                className={`bg-white text-gray-600 rounded-l-md px-4 py-2 hover:bg-white focus:outline-none ${value === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={value === 0}
                            >
                                -
                            </button>

                            {/* Input Box */}
                            <input
                                type="text"
                                value={value}
                                readOnly
                                className="text-center w-12 border-gray-200 focus:outline-none"
                            />

                            {/* Increment Button */}
                            <button
                                onClick={() => setValue((prev) => prev + 1)}
                                className={`bg-white text-gray-600 rounded-r-md px-4 py-2 hover:bg-white focus:outline-none ${value === 10 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={value === 10}
                            >
                                +
                            </button>
                        </div>
                        <button className='rounded-xl bg-transparent px-10 py-3' style={{ border: '2px solid black' }} onClick={() => handleAddToCart(ProductDetail?.product?._id, ProductDetail?.product?.title)} >Add To Cart</button>
                        <button className='rounded-xl bg-transparent px-10 py-3' style={{ border: '2px solid black' }} onClick={() => {
                            handleCompare(ProductDetail?.product?._id)
                        }}>+ Compare</button>
                    </div>

                    <div className='flex mb-2'>
                        <div className='pr-6'>
                            <ul className='flex flex-col gap-4'>
                                <li className='font-normal text-base text-[#9F9F9F]'>SKU</li>
                                <li className='font-normal text-base text-[#9F9F9F]'>Category</li>
                                <li className='font-normal text-base text-[#9F9F9F]'>Tags</li>
                                <li className='font-normal text-base text-[#9F9F9F]'>Share</li>
                            </ul>
                        </div>
                        <div>
                            <ul className='flex flex-col gap-4'>
                                <li className='font-normal text-base text-[#9F9F9F]'>:  {ProductDetail?.product?.sku}</li>
                                <li className='font-normal text-base text-[#9F9F9F]'>:  {ProductDetail?.product?.category?.name}</li>
                                <li className='font-normal text-base text-[#9F9F9F]'>:  Sofa, Chair, Home, Shop</li>
                                <li className='flex items-center gap-4 text-[#9F9F9F]'>:
                                    <FaFacebook size={20} color='black' />
                                    <BsLinkedin size={20} color='black' />
                                    <AiFillTwitterCircle size={22} color='black' />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div >

            <div className="container px-20 border-b-2">
                <div className=" mx-auto p-6">
                    {/* Tabs Header */}
                    <div className=" border-gray-200">
                        <nav className="flex space-x-4 justify-center">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`text-lg bg-transparent focus:outline-none font-medium py-2 px-4 ${activeTab === tab.id
                                        ? "text-black border-b-2 "
                                        : "text-gray-500"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tabs Content */}
                    <div className="mt-6">
                        {activeTab === "description" && (
                            <>
                                <div className='mb-8 px-20'>
                                    <p className="text-[#9F9F9F] text-base text-justify ">
                                        {ProductDetail?.DescriptionData?.[0]?.details && ProductDetail?.DescriptionData[0]?.details}
                                    </p>
                                    {/* <p className="text-[#9F9F9F] text-base text-justify mt-4">
                                        Weighing in under 7 pounds, the Kilburn is a lightweight piece of
                                        vintage-styled engineering. Setting the bar as one of the loudest
                                        speakers in its class, the Kilburn is a compact, stout-hearted
                                        hero with a well-balanced audio that boasts a clear midrange and
                                        extended highs for a sound that is both articulate and
                                        pronounced.
                                    </p> */}
                                </div>
                                {/* Images Section */}
                                <div className="grid grid-cols-1 place-items-center md:grid-cols-2 mt-6">
                                    <div className="bg-[#F9F1E7] flex items-center  rounded-lg w-[605px] h-[348px] ">
                                        <img
                                            src={ProductDetail?.DescriptionData?.[0]?.images && ProductDetail?.DescriptionData[0].images}
                                            alt="Product"
                                            className="rounded-lg object-cover h-[348px] w-full"
                                        />
                                    </div>
                                    <div className="bg-[#F9F1E7] rounded-lg w-[605px] h-[348px] flex items-center">
                                        <img
                                            src={ProductDetail?.DescriptionData?.[0]?.images && ProductDetail?.DescriptionData[0].images}
                                            alt="Product"
                                            className="rounded-lg object-cover h-[348px] w-full"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab === "reviews" && (
                            <div className='grid grid-cols-2 gap-x-10'>
                                {
                                    ProductDetail?.RatingData && ProductDetail?.RatingData.map((item, index) => {
                                        return (
                                            <div className='flex mb-6  border-b-2 py-3' key={index}>
                                                <div>
                                                    <div><Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" size='lg' /></div>
                                                </div>
                                                <div className='flex flex-col justify-center pl-4'>
                                                    <h3>{item.username}</h3>
                                                    <Rating name="size-medium" readOnly defaultValue={item.rating} precision={0.5} className='my-2' />
                                                    <p>{item.review}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container border-b-2 py-20 ">
                <div className='mb-10'>
                    <h2 className='text-3xl font-medium text-center' style={{ color: '#3A3A3A' }}>Related Products</h2>
                </div>
                <div>
                    {visibleProducts && visibleProducts.length > 0 ? (
                        <div className="container px-20 grid grid-cols-4 gap-x-10 gap-y-10">
                            {visibleProducts.map((item) => (
                                <ProductCard
                                    key={item._id}
                                    id={item._id}
                                    img={item.image}
                                    title={item.title}
                                    des={item.description}
                                    price={item.OriginalPrice}
                                    disprice={item.DiscountedPrice}
                                    discount={item.discount}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 rounded-lg  mx-36">
                            <img src="/Assets/7740133_3737258.jpg" alt="" className='h-36 w-36 mb-5' />
                            <h1 className="text-gray-700 text-lg font-semibold mb-2">
                                No related products found
                            </h1>
                            <p className="text-gray-500">Try adjusting your filters or search again.</p>
                        </div>
                    )}
                </div>


                {
                    showMore === true ? (
                        <div className="container pt-10 text-center">
                            <button className='rounded-none border-2 border-primary bg-white px-12 text-primary font-semibold text-base focus:outline-none' onClick={handleShowMore} >Show less</button>
                        </div>
                    ) : (<div className="container pt-10 text-center">
                        <button className='rounded-none border-2 border-primary bg-white px-12 text-primary font-semibold text-base focus:outline-none' onClick={handleShowMore}>Show more</button>
                    </div>)
                }
            </div>
            <FeedBack id={ProductDetail?.product?._id} />
            <div className="container  mt-5">
                <Footer />
            </div>
        </>
    )
}

export default ProductInfo