import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { TbLockX } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import auth from "@/utils/Auth";
import addCartsStore from "@/manage/addCartsStore";
import { Skeleton } from "@heroui/react";

let url = import.meta.env.VITE_PUBLIC_URL;
function AddToCart({ onClose }) {
  const { removeCart } = addCartsStore();
  const [AddedProducts, setAddedProducts] = useState([]);
  const [Loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // console.log(p_id);
  const apiAddProduct = async () => {
    try {
      const authData = await auth();
      const res = await axios.get(`${url}cart/single`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setAddedProducts(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    apiAddProduct();
  }, []);

  const handleDelete = async (d_id, p_name) => {
    const authData = await auth();
    const res = await axios.delete(`${url}cart/delete/${d_id}`, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });
    console.log(res.data);
    if (res.status === 200) {
      const updatedProduct = AddedProducts.filter(
        (item) => item?.productId !== d_id
      );
      setAddedProducts(updatedProduct);
      removeCart(p_name);
      toast.info("Product Deleted successfully");
    }
  };

  const handleCart = (cartId) => {
    if (!cartId) {
      navigate(`/cart`);
    } else {
      console.log("id already exist");
      navigate(`/cart`);
    }
  };

  return (
    <>
      <div className="h-[746px] w-[417px] bg-white absolute top-0 right-0 z-50 border border-gray-300 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className=" m-7 justify-between border-b-3 pb-5 w-3/4">
            <h2 className="text-black font-semibold text-2xl">Shopping Cart</h2>
          </div>
          <TbLockX
            size={19}
            color="#9F9F9F"
            className="mr-7 -translate-y-3"
            onClick={onClose}
          />
        </div>
        {Loading ? (
          <div className="overflow-auto h-[500px] pb-10">
            {
              // [1, 2, 3].map((_, index) => {
              //     return (
              //         <div key={index} className='flex items-center px-6 mb-6'>
              //             <div className='h-[105px] w-[105px]'>
              //                 <Skeleton className="rounded-lg size-full" />
              //             </div>
              //             <div className="w-[60%] ml-8 flex flex-col gap-2">
              //                 <Skeleton className="h-3 w-3/5 rounded-lg" />
              //                 <Skeleton className="h-3 w-4/5 rounded-lg" />
              //             </div>
              //         </div>
              //     );
              // })
              Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center px-6 mb-6">
                  <div className="h-[105px] w-[105px]">
                    <Skeleton className="rounded-lg size-full" />
                  </div>
                  <div className="w-[60%] ml-8 flex flex-col gap-2">
                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                  </div>
                </div>
              ))
            }
          </div>
        ) : AddedProducts && AddedProducts.length > 0 ? (
          <div className="overflow-auto h-[500px] pb-10">
            {AddedProducts &&
              AddedProducts?.map((product, index) => {
                return (
                  <div key={index} className="flex items-center px-6 mb-6">
                    <div className="h-[105px] w-[105px] rounded-lg bg-[#B88E2F38]">
                      <img
                        src={product.image}
                        alt=""
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="w-[60%] flex items-center justify-between ml-8">
                      <div className="mr-10">
                        <h2 className="text-base text-black font-normal">
                          {product.name}
                        </h2>
                        <div className="flex items-center mt-3">
                          <span className="text-base">{product.quantity}</span>
                          <RxCross2 className="mx-5" />
                          <p className="text-sm font-medium text-primary">
                            Rs. {product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <IoCloseCircle
                          size={28}
                          color="#9F9F9F"
                          onClick={() =>
                            handleDelete(product?.productId, product.name)
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-28">
            <img src="/Assets/ic-cart.svg" alt="#" className="h-36 w-36" />
            <div>
              <h2 className="text-center text-[#919EAB] text-2xl font-medium mb-4">
                Cart is empty!
              </h2>
              <p className="text-center text-[#919EAB] text-sm font-medium mb-4">
                Look like you have no items in your shopping cart.
              </p>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 z-10 bg-white">
          <div className="flex items-center p-7 justify-between mr-16">
            <h2 className="text-base text-black">Subtotal</h2>
            <span className="text-base font-semibold text-primary">
              Rs.{" "}
              {AddedProducts &&
                AddedProducts?.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ).toLocaleString()}
            </span>
          </div>
          <div className="border-t-2 p-5 flex items-center gap-5">
            <button
              className="bg-white text-black rounded-[50px] hover:text-black  border-2 py-2 px-8 text-sm border-black "
              onClick={() => AddedProducts.map((item) => handleCart(item._id))}
            >
              Cart
            </button>
            <Link to={"/checkout"}>
              <button className="bg-white text-black rounded-[50px] hover:text-black  border-2 text-sm py-2 px-6 border-black">
                Checkout
              </button>
            </Link>
            <Link
              className="bg-white text-black hover:text-black rounded-[50px] py-2 px-3 border-2 text-sm  border-black"
              to={"/compare"}
            >
              Comparison
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddToCart;
