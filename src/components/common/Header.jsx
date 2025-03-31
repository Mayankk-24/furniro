import React, { useContext, useState, useMemo, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { MdOutlineShoppingCart, MdOutlineWallet } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiAccountCircleLine, RiSearch2Line } from "react-icons/ri";
import AddToCart from "../products/AddToCart";
import Badge from "@mui/material/Badge";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import auth from "@/utils/Auth";
import addCartsStore from "@/manage/addCartsStore";
import { toast } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FaIndianRupeeSign } from "react-icons/fa6";
import Sidebar from "./Sidebar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import WithDrawModel from "./WithDrawModel";

let url = import.meta.env.VITE_PUBLIC_URL;
function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [heart, setHeart] = useState(false);
  const [ProfileData, setProfileData] = useState();
  const authToken = localStorage.getItem("token");
  const { carts } = addCartsStore();
  const navigate = useNavigate();
  const [Amount, setAmount] = useState();
  const {
    isOpen: isAddMoneyOpen,
    onOpen: openAddMoney,
    onOpenChange: toggleAddMoney,
  } = useDisclosure();
  const {
    isOpen: isWithdrawOpen,
    onOpen: openWithdraw,
    onOpenChange: toggleWithdraw,
  } = useDisclosure();

  const LinkNames = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const getProfileData = async () => {
    const authData = await auth();
    try {
      const res = await axios.get(`${url}account/profile`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setProfileData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const handleLogout = async () => {
    const authToken = await auth();
    try {
      const res = await axios.put(
        `${url}logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken.token}`,
          },
        }
      );
      console.log(res.data);
      if (res.status === 200) {
        toast.success("Successfully logout");
        navigate("/signin");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loadRazorpay = async () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadRazorpay();
  }, []);
  const onSubmit = async (value, { setSubmitting }) => {
    const authToken = await auth();
    setSubmitting(true);
    try {
      const res = await axios.put(`${url}account/addwallet`, value, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
        },
      });
      console.log(res.data);
      const orderId = res.data.paymentResponse?.id;
      const amount = res.data.paymentResponse?.amount;
      const options = {
        key: "rzp_test_pUXJB2ZJXV0sMk", // Replace with Razorpay Key
        amount: amount,
        currency: "INR",
        name: "furniro",
        image: "/Assets/Meubel House_Logos-05.png",
        description: "Purchase Order",
        order_id: orderId,
        handler: async function (response) {
          console.log(`Payment ID: ${response.razorpay_payment_id}`);
          console.log(`Order ID: ${response.razorpay_order_id}`);
          if (response.razorpay_payment_id) {
            await Swal.fire({
              title: "Success!",
              text: "Money added to your wallet successfully.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.reload(); // Refresh UI when user clicks OK
            });

            onOpenChange(false); // Now closing after showing the alert
          }

          setSubmitting(false);
        },
        prefill: {
          name: "User",
          email: "user@gmail.com",
          contact: "1234567890",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: { color: "#3399cc" },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
      });
      paymentObject.open();
      setSubmitting(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setSubmitting(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      wallet: "",
    },
    onSubmit,
    validationSchema: Yup.object({
      wallet: Yup.number()
        .min(1000, "add more than 1000 rupee")
        .required("Amount is required!"),
    }),
  });
  return (
    <>
      <div>
        {isCartOpen && <AddToCart onClose={() => setIsCartOpen(!isCartOpen)} />}
      </div>
      <div className="bg-white w-full py-4 px-5 md:px-12 flex items-center justify-between">
        <div id="left-sec" className="flex items-center hover:cursor-pointer">
          <img
            src="/Assets/Meubel House_Logos-05.png"
            alt="#"
            className="h-8 mr-2"
          />
          <h2 className="font-bold text-3xl text-black">Furniro</h2>
        </div>
        <div className="hidden md:flex justify-center gap-5 lg:gap-20">
          {LinkNames.map((link, index) => (
            <Link
              to={link.path}
              key={index}
              className="text-black hover:text-gray-500"
            >
              {link.name}
            </Link>
          ))}
        </div>
        {!authToken ? (
          <div>
            <Link to={"/signin"} className="text-white hover:text-white ">
              <button className="bg-blue-700 focus:outline-none text-white py-1">
                SignIn
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-5 lg:gap-14">
            {/* Profile */}
            <PopoverRoot>
              <PopoverTrigger asChild>
                <RiAccountCircleLine
                  size={24}
                  className="hover:cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent width={"340px"}>
                <PopoverArrow />
                <PopoverBody width={"340px"}>
                  <PopoverTitle fontWeight="medium" fontSize={"20px"}>
                    Your Profile
                  </PopoverTitle>
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <div className="size-14 bg-gray-700 rounded-full">
                        <img
                          src={ProfileData?.image}
                          alt="#"
                          className="size-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-gray-600 font-semibold text-base">
                          {ProfileData?.firstname || "user not found"}{" "}
                          {ProfileData?.lastname}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {ProfileData?.email || "email not found"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                      <Link
                        to={"/edituser"}
                        className="text-white hover:text-white outline-none"
                      >
                        <button className="bg-blue-600 hover:bg-blue-700 focus:outline-none outline-none text-white">
                          Settings
                        </button>
                      </Link>
                      <button
                        className="bg-red-600 hover:bg-red-700  focus:outline-none text-white"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            {/* Wallet */}
            <PopoverRoot>
              <PopoverTrigger asChild>
                <MdOutlineWallet size={24} className="cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 bg-white shadow-lg rounded-lg">
                <PopoverArrow />
                <PopoverBody>
                  <PopoverTitle className="text-lg font-semibold flex items-center gap-2">
                    Your Wallet
                  </PopoverTitle>

                  {/* Wallet Balance */}
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-300 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Available Balance</p>
                      <h3 className="text-xl font-bold text-blue-700 flex items-center">
                        <FaIndianRupeeSign size={14} className="mr-1" />
                        {ProfileData?.wallet || "0.00"}
                      </h3>
                    </div>
                    <Icon
                      icon="ph:wallet-bold"
                      className="text-blue-600"
                      width={30}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-green-600 text-white px-3 py-2 focus:outline-none rounded-md text-sm hover:bg-green-700"
                      onClick={openAddMoney}
                    >
                      Add Money
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-2 focus:outline-none rounded-md text-sm hover:bg-red-700"
                      onClick={openWithdraw}
                    >
                      Withdraw
                    </button>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
            {/* add wallet model */}
            <Modal
              isOpen={isAddMoneyOpen}
              onOpenChange={toggleAddMoney}
              size="xs"
              classNames={{
                closeButton: "focus:outline-none",
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex items-center gap-2">
                      Add Money{" "}
                      <Icon icon="emojione:money-bag" width="30" height="30" />
                    </ModalHeader>
                    <form action="#" onSubmit={formik.handleSubmit}>
                      <ModalBody className="gap-0">
                        <Input
                          label="Amount"
                          type="number"
                          name="wallet"
                          variant="bordered"
                          {...formik.getFieldProps("wallet")}
                          endContent={
                            <FaIndianRupeeSign size={14} className="mr-1" />
                          }
                          labelPlacement="outside"
                          placeholder="Enter Your Amount"
                          isInvalid={
                            formik.touched.wallet &&
                            Boolean(formik.errors.wallet)
                          }
                        />
                        {formik.touched.wallet && formik.errors.wallet && (
                          <div className="text-xs text-[#FF5630] font-medium px-2 pt-2">
                            {formik.errors.wallet}
                          </div>
                        )}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          type="submit"
                          color="primary"
                          className="focus:outline-none"
                          isLoading={formik.isSubmitting}
                        >
                          Proceed to pay
                        </Button>
                      </ModalFooter>
                    </form>
                  </>
                )}
              </ModalContent>
            </Modal>

            {/* withdraw wallet model */}
            <div className="hidden">
              {openWithdraw ? (
                <WithDrawModel
                  isOpen={isWithdrawOpen}
                  onOpenChange={toggleWithdraw}
                />
              ) : null}
            </div>

            {/* withdraw money wallet */}
            {heart ? (
              <FaHeart
                size={24}
                className="hover:cursor-pointer"
                onClick={() => setHeart(!heart)}
                color="red"
              />
            ) : (
              <FaRegHeart
                size={24}
                className="hover:cursor-pointer"
                onClick={() => setHeart(!heart)}
              />
            )}
            <Badge badgeContent={carts?.length || 0} color="error">
              <MdOutlineShoppingCart
                size={24}
                className="hover:cursor-pointer"
                onClick={() => setIsCartOpen(true)}
              />
            </Badge>
            <Sidebar />
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
}

export default Header;
