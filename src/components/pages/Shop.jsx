import axios from 'axios'
import { React, useEffect, useState } from 'react'
import { BsViewList } from 'react-icons/bs'
import { HiViewGrid } from 'react-icons/hi'
import { LuChevronRight } from 'react-icons/lu'
import { PiLineVerticalThin, PiSlidersHorizontalLight } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import ProductCard from '../products/ProductCard'
import { Button, Card, Pagination, Skeleton } from '@nextui-org/react'
import Footer from '../common/Footer'
import Services from '../common/Services'
import { RiSearch2Line } from 'react-icons/ri'
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../ui/popover'
import { Input } from '@heroui/react'

let url = import.meta.env.VITE_PUBLIC_URL;
function Shop() {
    const [sortBy, setSortBy] = useState("default") // trnding, title, price
    const [size, setSize] = useState(16)
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchItem, setSearchItem] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);

    const showCards = async () => {
        try {
            let _sortby = sortBy === 'default' ? '' : `&sort=${sortBy}`;
            let _size = `&size=${size}`;
            const res = await axios.get(`${url}card/productcard?page=${currentPage}${_sortby}${_size}`);
            setProducts(res.data.data);
            setLoading(false);
            console.log(res.data.data);

            setTotal(res.data.total);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        showCards();
    }, [currentPage, sortBy, size])

    useEffect(() => {
        setCurrentPage(1)
    }, [size])

    const SkeletonContainer = () => (
        <Card className="w-[310px] h-[524px] space-y-5 p-4 rounded-md">
            <Skeleton className="rounded-lg h-1/2">
                <div className="h-full rounded-lg bg-default-300" />
            </Skeleton>
            <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
            </div>
        </Card>
    )

    const handleSearch = () => {
        const word = searchItem.toLowerCase();
        const filtered = products.filter((item) => item.title.toLowerCase().includes(word));
        setFilteredProducts(filtered);
    }

    return (
        <>
            <div className='w-full bg-cover' style={{ backgroundImage: 'url("/Assets/Rectangle 1.png")', height: '316px' }}>
                <div className='flex items-center justify-center h-full'>
                    <div>
                        <h2 className='text-center text-black text-5xl font-medium mb-4'>Shop</h2>
                        <div className='flex items-center'>
                            <Link to={'/'} className='text-black text-base font-medium' >Home</Link>
                            <LuChevronRight className='mx-2' size={'18px'} color='black' />
                            <span>Shop</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#F9F1E7' }} className='px-16 py-6 flex justify-between'>
                <div className='flex items-center gap-4'>
                    <PiSlidersHorizontalLight size={'25px'} color='black' />
                    <span className='text-black text-xl font-normal'>Filter</span>
                    <HiViewGrid size={'28px'} className='mx-3' />
                    <BsViewList size={'24px'} />
                    <PiLineVerticalThin size={'28px'} color='#9F9F9F' />
                    <p className='text-base text-black'>Showing 1-{size} of {total} results</p>
                </div>
                <div className='flex items-center'>
                    <PopoverRoot>
                        <PopoverTrigger asChild>
                            <RiSearch2Line size={24} className='mr-10' color='black' />
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>
                                <div className='flex items-center justify-center'>
                                    <Input placeholder='Search products' className='mr-2' value={searchItem} onChange={(e) => {
                                        setSearchItem(e.target.value)
                                        handleSearch()
                                    }
                                    } />
                                    {/* <Button variant='ghost' color='primary' onClick={handleSearch}>Search</Button> */}
                                </div>
                            </PopoverBody>
                        </PopoverContent>
                    </PopoverRoot>
                    <span className='text-xl text-black font-normal mr-5'>Show</span>
                    {/* <div className='bg-white text-gray-400 flex items-center justify-center mr-8' style={{ height: '55px', width: '55px' }}></div> */}
                    <select value={size} onChange={(e) => setSize(parseInt(e.target.value))} className='bg-white rounded focus:outline-none text-gray-400 flex items-center justify-center mr-8' style={{ height: '40px', width: '55px' }}>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={16}>16</option>
                    </select>
                    <span className='text-xl text-black font-normal mr-5'>Short By</span>
                    {/* <input type="text" placeholder='Default' style={{ width: '190px', height: '55px' }} className='px-4' /> */}
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '190px', height: '55px' }} className='px-4 rounded focus:outline-none'>
                        <option value="default" disabled>Default</option>
                        <option value="title">Name</option>
                        <option value="OriginalPrice">Price</option>
                        <option value="discount">Discount</option>
                        <option value="DiscountedPrice">DiscountPrice</option>
                    </select>
                </div>
            </div >

            <div>
                {
                    loading ? (
                        <div className="container px-20 py-16 grid grid-cols-4 gap-x-10 gap-y-10">
                            {Array.from({ length: 16 }, (_, i) => (
                                <SkeletonContainer key={i} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredProducts && filteredProducts.length > 0 ? (
                                <div className="container px-20 py-16 grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 lg:gap-x-10 lg:gap-y-10">
                                    {filteredProducts && filteredProducts.map((item, index) => (
                                        <ProductCard
                                            key={index}
                                            Cid={item._id}
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
                                <div className="container px-20 py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-8 lg:gap-x-10 lg:gap-y-10">
                                    {products && products.map((item, index) => (
                                        <ProductCard
                                            key={index}
                                            Cid={item._id}
                                            img={item.image}
                                            title={item.title}
                                            des={item.description}
                                            price={item.OriginalPrice}
                                            disprice={item.DiscountedPrice}
                                            discount={item.discount}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )
                }
            </div>


            <div className='flex gap-5 items-center justify-center mb-16'>
                <Button
                    size="md"
                    variant="flat"
                    color="#F9F1E7"
                    style={{ backgroundColor: '#F9F1E7' }}
                    onPress={() => setCurrentPage((prev) => prev > 1 ? prev - 1 : prev)}
                    isDisabled={currentPage === 1}
                    className="focus:outline-none outline-none"
                >Prev</Button>
                <Pagination showShadow color="#B88E2F" total={Math.ceil(total / size)} initialPage={1}
                    page={currentPage}
                    onChange={setCurrentPage} />
                <Button
                    size="md"
                    variant="flat"
                    color="#F9F1E7"
                    style={{ backgroundColor: '#F9F1E7' }}
                    onPress={() => setCurrentPage((prev) => (prev < (Math.ceil(total / size)) ? prev + 1 : prev))}
                    className="focus:outline-none outline-none"
                >Next</Button>
            </div>

            <Services />
            <div className="container mt-5">
                <Footer />
            </div>
        </>
    )
}

export default Shop