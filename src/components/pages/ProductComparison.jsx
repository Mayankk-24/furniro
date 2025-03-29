import { Rating } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import { RiArrowDownWideFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import Footer from "../common/Footer";
import Services from "../common/Services";
import axios from "axios";
import HeroCard from "../common/HeroCard";

let url = import.meta.env.VITE_PUBLIC_URL;
function ProductComparison() {
  const [Cmp, setCmp] = useState([]);
  // const CmpProduct = [
  //     { id: 1, img: '/Assets/917ac944454e358f73d0af67e1f1b74e.png', title: 'Asgaard Sofa', price: 'Rs. 250,000.00', review: '4.7', rating: <Rating defaultValue={4.5} precision={0.5} />, count: '204' },
  //     { id: 2, img: '/Assets/c9e9224b3002d53824688ecee9c882c5.png', title: 'Outdoor Sofa Set', price: 'Rs. 224,000.00', review: '4.2', rating: <Rating defaultValue={4.5} precision={0.5} />, count: '145' },
  // ];
  const cmp = JSON.parse(localStorage.getItem("cmp1"));
  console.log(cmp);
  const myFun = async () => {
    const res = await axios.get(`${url}product/all`);
    console.info(res.data.data);
    setCmp(res.data.data);
  };

  useEffect(() => {
    myFun();
  }, []);

  return (
    <>
      <HeroCard name={"Product Comparison"} subname={"Comparison"} />

      <div className="container flex px-20 py-10">
        <div className="pt-5">
          <h2 className="text-3xl text-black font-medium mb-4">
            Go to Product <br /> page for more <br />
            Products
          </h2>
          <h5 className="text-[#727272] text-xl font-medium underline underline-offset-4 ">
            View More
          </h5>
        </div>
        <div className="flex gap-10 ml-24">
          {Cmp?.filter((item) => cmp.includes(item._id)).map((item, index) => {
            return (
              <div key={index}>
                <div className="bg-[#F9F1E7] w-[280px] h-[177px] rounded-lg">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
                <h2 className="text-black font-medium text-2xl mt-4">
                  {item.title}
                </h2>
                <h2 className="text-lg font-medium text-black mt-0.5">
                  Rs. {item.price}
                </h2>
                <div className=" flex items-center">
                  <span className="text-lg font-medium text-black mr-2">
                    {item.review}
                  </span>
                  <div>
                    <Rating defaultValue={item.review} precision={0.5} />
                  </div>
                  <div className='text-sm text-[#9F9F9F] font-normal before:content-[" "] before:mx-4 before:text-gray-400 before:inline-block before:h-12 before:border-l-2 flex items-center'>
                    207 Review
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pt-10">
          <div className="ml-24">
            <h2 className="text-black text-2xl font-semibold mb-4 ">
              Add A Product
            </h2>
            <Link
              to={"/shop"}
              className="bg-primary text-white font-semibold flex items-center justify-between px-3 py-3 rounded-lg hover:text-white"
            >
              Choose a Product{" "}
              <RiArrowDownWideFill className="ml-10" size={25} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-10 border-t-2 pr-80 pb-24">
        {/* <div className='px-12 flex '>
                    <div className='border-r-2 pt-10 pr-16'>
                        <h2 className='text-black text-[28px] font-medium mb-5'>
                            General
                        </h2>
                        <div className="space-y-5 text-black text-xl">
                            <div>Sales Package</div>
                            <div>Model Number</div>
                            <div>Secondary Material</div>
                            <div>Configuration</div>
                            <div>Upholstery Material</div>
                            <div>Upholstery Color</div>
                        </div>
                    </div>
                    <div className="space-y-5 border-r-2 text-black text-xl pt-[103px] px-16">
                        <div>1 sectional sofa</div>
                        <div>TFCBLIGRBL6SRHS</div>
                        <div>Solid Wood</div>
                        <div>L-shaped</div>
                        <div>Fabric + Cotton</div>
                        <div>Bright Grey & Lion</div>
                    </div>
                    <div className="space-y-5 border-r-2 text-black text-xl pt-[103px] px-16">
                        <div>1 Three Seater, 2 Single <br /> Seater</div>
                        <div>DTUBLIGRBL568</div>
                        <div>Solid Wood</div>
                        <div>L-shaped</div>
                        <div>Fabric + Cotton</div>
                        <div>Bright Grey & Lion</div>
                    </div>
                </div> */}

        {/* <div className='px-12 flex '>
                    <div className='border-r-2 pt-10 pr-[40.5px]'>
                        <h2 className='text-black text-[28px] font-medium mb-5'>
                            Product
                        </h2>
                        <div className="space-y-5 text-black text-xl">
                            <div>Filling Material</div>
                            <div>Finish Type</div>
                            <div>Adjustable Headrest</div>
                            <div>Maximum Load <br /> Capacity</div>
                            <div>Origin of Manufacture</div>
                        </div>
                    </div>
                    <div className="space-y-5 border-r-2 text-black text-xl pt-[103px] px-[63.8px]">
                        <div>Foam</div>
                        <div>Bright Grey & Lion</div>
                        <div>No</div>
                        <div>280 KG</div>
                        <div>India</div>
                    </div>
                    <div className="space-y-5 border-r-2 text-black text-xl pt-[103px] pr-[113.5px] pl-16">
                        <div>Matte</div>
                        <div>Bright Grey & Lion</div>
                        <div>Yes</div>
                        <div>300 KG</div>
                        <div>India</div>
                    </div>
                </div> */}

        {/* <div className='px-12 flex '>
                    <div className='border-r-2 pt-14 pr-[93.5px]'>
                        <h2 className='text-black text-[28px] font-medium mb-5'>
                            Dimensions
                        </h2>
                        <div className="space-y-5 text-black text-xl">
                            <div>Width</div>
                            <div>Height</div>
                            <div>Depth</div>
                            <div>Weight</div>
                            <div>Seat Height</div>
                            <div>Leg Height</div>
                        </div>
                    </div>
                    <div className="space-y-5 border-r-2 text-black text-xl pt-[120px] pl-16 pr-[136px]">
                        <div>265.32 cm</div>
                        <div>76 cm</div>
                        <div>167.76 cm</div>
                        <div>45 KG</div>
                        <div>41.52 cm</div>
                        <div>5.46 cm</div>
                    </div>
                    <div className="space-y-5 border-r-2 text-black text-xl pt-[120px] pr-[186px] pl-16">
                        <div>265.32 cm</div>
                        <div>76 cm</div>
                        <div>167.76 cm</div>
                        <div>65 KG</div>
                        <div>41.52 cm</div>
                        <div>5.46 cm</div>
                    </div>
                </div> */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* First Column: Labels */}
            <div className="border-r-2 pt-8 pl-12">
              <h2 className="text-black text-[28px] inline-block font-medium mb-7">
                General
              </h2>
              <div className="space-y-5  text-black text-xl pr-4">
                <div>Sales Package</div>
                <div>Model Number</div>
                <div>Secondary Material</div>
                <div>Configuration</div>
                <div>Upholstery Material</div>
                <div>Upholstery Color</div>
              </div>
            </div>
            {/* Second Column: First set of data */}
            <div className="space-y-5 border-r-2 text-black text-xl pr-4 pl-12 pt-[103px]">
              <div>1 sectional sofa</div>
              <div>TFCBLIGRBL6SRHS</div>
              <div>Solid Wood</div>
              <div>L-shaped</div>
              <div>Fabric + Cotton</div>
              <div>Bright Grey & Lion</div>
            </div>
            {/* Third Column: Second set of data */}
            <div className="space-y-5 border-r-2 text-black text-xl pr-4 pl-12 pt-[103px] text-wrap">
              <div className="">1 Three Seater, 2 Single Seater</div>
              <div>DTUBLIGRBL568</div>
              <div>Solid Wood</div>
              <div>L-shaped</div>
              <div>Fabric + Cotton</div>
              <div>Bright Grey & Lion</div>
            </div>
          </div>
        </div>

        {/* Product Section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* First Column: Labels */}
            <div className="border-r-2 pt-16 pl-12">
              <h2 className="text-black text-[28px] font-medium mb-5">
                Product
              </h2>
              <div className="space-y-5  text-black text-xl pr-4">
                <div>Filling Material</div>
                <div>Finish Type</div>
                <div>Adjustable Headrest</div>
                <div>Maximum Load Capacity</div>
                <div>Origin of Manufacture</div>
              </div>
            </div>
            {/* Second Column: First set of data */}
            <div className="space-y-5 border-r-2 text-black text-xl pr-4 pl-12 pt-[126px]">
              <div>Foam</div>
              <div>Bright Grey & Lion</div>
              <div>No</div>
              <div>280 KG</div>
              <div>India</div>
            </div>
            {/* Third Column: Second set of data */}
            <div className="space-y-5 border-r-2 text-black text-xl pr-4 pl-12 pt-[126px]">
              <div>Matte</div>
              <div>Bright Grey & Lion</div>
              <div>Yes</div>
              <div>300 KG</div>
              <div>India</div>
            </div>
          </div>
        </div>

        {/* Dimensions Section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* First Column: Labels */}
            <div className="border-r-2 pt-16 pl-12">
              <h2 className="text-black text-[28px] font-medium mb-5">
                Dimensions
              </h2>
              <div className="space-y-5  text-black text-xl pr-4">
                <div>Width</div>
                <div>Height</div>
                <div>Depth</div>
                <div>Weight</div>
                <div>Seat Height</div>
                <div>Leg Height</div>
              </div>
            </div>
            {/* Second Column: First set of data */}
            <div className="space-y-5 border-r-2 text-black text-xl pr-4 pl-12 pt-[126px]">
              <div>265.32 cm</div>
              <div>76 cm</div>
              <div>167.76 cm</div>
              <div>45 KG</div>
              <div>41.52 cm</div>
              <div>5.46 cm</div>
            </div>
            {/* Third Column: Second set of data */}
            <div className="space-y-5 border-r-2 text-black text-xl pr-4 pl-12 pt-[126px]">
              <div>265.32 cm</div>
              <div>76 cm</div>
              <div>167.76 cm</div>
              <div>65 KG</div>
              <div>41.52 cm</div>
              <div>5.46 cm</div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border-r-2 pt-16 pl-12">
              <h2 className="text-black text-[28px] font-medium mb-5">
                Warranty
              </h2>
              <div className="space-y-12  text-black text-xl pr-4">
                <div>Warranty Summary</div>
                <div>
                  Warranty Service <br />
                  Type
                </div>
                <div className="pt-[57px]">Covered in Warranty</div>
                <div>
                  Not Covered in <br /> Warranty
                </div>
                <div className="pt-28">Domestic Warranty</div>
              </div>
            </div>
            <div className="space-y-5 border-r-2 text-black text-xl pr-4 pl-12 pt-[126px]">
              <div>1 Year Manufacturing Warranty</div>
              <div>
                For Warranty Claims or <br /> Any Product Related <br /> Issues
                Please Email at operations@trevifurnitu <br /> re.com
              </div>
              <div>Warranty Against Manufacturing Defect</div>
              <div>
                The Warranty Does Not <br /> Cover Damages Due To <br /> Usage
                Of The Product <br />
                Beyond Its Intended Use <br /> And Wear & Tear In The Natural
                Course Of Product Usage.
              </div>
              <div className="pb-10">1 Year</div>
              <button className="text-xl text-white bg-primary rounded-none focus:outline-none px-11">
                Add To Cart
              </button>
            </div>
            <div className="space-y-5 border-r-2 text-black text-xl pr-4 pl-12 pt-[126px]">
              <div>1.2 Year Manufacturing Warranty</div>
              <div>
                For Warranty Claims or <br /> Any Product Related Issues Please
                Email at support@xyz.com
              </div>
              <div>
                Warranty of the product is limited to manufacturing defects
                only.
              </div>
              <div>
                The Warranty Does Not <br /> Cover Damages Due To <br /> Usage
                Of The Product <br />
                Beyond Its Intended Use <br /> And Wear & Tear In The Natural
                Course Of Product Usage.
              </div>
              <div className="pb-10">3 Months</div>
              <button className="text-xl text-white bg-primary rounded-none focus:outline-none px-11">
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <Services />
      <Footer />
    </>
  );
}

export default ProductComparison;
