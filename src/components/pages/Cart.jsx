import React, { useEffect, useState, useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
import { LuChevronRight } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Services from "../common/Services";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@nextui-org/react";
import auth from "@/utils/Auth";
import addCartsStore from "@/manage/addCartsStore";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  CardBody,
  Divider,
  CardFooter,
  Button,
  ButtonGroup,
} from "@heroui/react";
import { MdDelete } from "react-icons/md";
import { FiMinus, FiPlus } from "react-icons/fi";
import { FaMinus } from "react-icons/fa";
import { motion } from "framer-motion";
import ParticlesBackground from "@/particles/ParticlesBackground";
import HeroCard from "../common/HeroCard";

const url = import.meta.env.VITE_PUBLIC_URL;
function Cart() {
  const [cart, setCart] = useState([]);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { removeCart } = addCartsStore();
  const [Quantity, setQuantity] = useState(0);
  const [Discount, setDiscount] = useState([]);

  const fetchCart = async () => {
    const authData = await auth();
    try {
      const response = await axios.get(`${url}order/single`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      console.log(response.data.order);
      setCart(response.data.order);
      const quantities = response.data.order.map((item) => item.quantity);
      setQuantity(quantities);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  const fetchDis = async () => {
    const authData = await auth();
    try {
      const response = await axios.get(`${url}discount/coupans`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setDiscount(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDis();
  }, []);

  const handleDelete = async (id, productId, p_name) => {
    const authData = await auth();
    try {
      const response = await axios.delete(`${url}order/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      const updatedCart = cart.filter((item) => item?._id !== id);
      setCart(updatedCart);
      removeCart(p_name);
      toast.success("Cart deleted successfully", { duration: 3000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete cart");
    }
  };

  const handleCheckout = (id) => {
    if (!id) {
      navigate("/checkout");
    } else {
      console.log("Item already in checkout list");
      navigate("/checkout");
    }
  };

  const handleQuantityChange = async (index, type, id) => {
    let newQuantity = Quantity[index];

    if (type === "increment" && newQuantity < 15) {
      newQuantity += 1;
    } else if (type === "decrement" && newQuantity > 0) {
      newQuantity -= 1;
    } else {
      return;
    }
    const authToken = await auth();
    try {
      const res = await axios.patch(
        `${url}cart/update/${id}?quantity=${newQuantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken.token}`,
          },
        }
      );
      if (res.status === 200) {
        setQuantity((prevQuantities) => {
          const updatedQuantities = [...prevQuantities];
          updatedQuantities[index] = newQuantity;
          return updatedQuantities;
        });
        fetchCart();
        toast.success("Quantity updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  };

  const handleApply = async (id) => {
    const authToken = await auth();
    try {
      const res = await axios.post(`${url}discount/apply/${id}`, {},{
        headers: {
          Authorization: `Bearer ${authToken.token}`,
        },
      });
      if (res.status === 200) {
        toast.success("Discount applied successfully");
        fetchCart();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <HeroCard name={"Cart"} />

      <div className="py-14 px-16">
        <div className="flex flex-col gap-y-5 md:flex-row justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full md:w-3/4 mr-9"
          >
            <Table
              aria-label="Example static collection table"
              classNames={{
                th: "bg-[#F9F1E7] text-black",
                wrapper: ["overflow-x-auto"],
              }}
            >
              <TableHeader>
                <TableColumn></TableColumn>
                <TableColumn>Product</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Subtotal</TableColumn>
                <TableColumn></TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="/Assets/ic-cart.svg"
                      alt="Empty Cart"
                      className="h-36 w-36"
                    />
                    <h2 className="text-[#919EAB] text-2xl font-medium mb-4">
                      Cart is empty!
                    </h2>
                    <p className="text-[#919EAB] text-sm font-medium mb-4">
                      Looks like you have no items in your shopping cart.
                    </p>
                  </div>
                }
              >
                {cart.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={item.image}
                        alt=""
                        className="size-20 rounded-lg"
                      />
                    </TableCell>
                    <TableCell className="text-[#9F9F9F] font-normal">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-[#9F9F9F] font-normal">
                      Rs. {item.price}
                    </TableCell>
                    <TableCell>
                      <ButtonGroup>
                        <Button
                          isIconOnly
                          size="sm"
                          className="bg-transparent border-1 focus:outline-none"
                          variant="bordered"
                          onPress={() =>
                            handleQuantityChange(
                              index,
                              "decrement",
                              item?.productId
                            )
                          }
                          isDisabled={Quantity[index] == 0}
                        >
                          <FiMinus size={16} />
                        </Button>
                        <div className="bg-[#919eab14] w-fit py-1.5 px-3">
                          {Quantity[index]}
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          className="bg-transparent border-1 focus:outline-none"
                          variant="bordered"
                          onPress={() =>
                            handleQuantityChange(
                              index,
                              "increment",
                              item?.productId
                            )
                          }
                          isDisabled={Quantity[index] == 15}
                        >
                          <FiPlus size={16} />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                    <TableCell>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <button
                        className="p-1 rounded-full bg-transparent hover:bg-gray-200/30 transition-background focus:outline-none"
                        onClick={() =>
                          handleDelete(item?._id, item?.productId, item?.name)
                        }
                      >
                        <img
                          src="/Assets/Delete.svg"
                          alt=""
                          className="size-5"
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="w-[393px] bg-[#F9F1E7] h-fit px-10 shadow-md pb-3">
              <CardHeader className="flex justify-center">
                <h2 className="text-black text-[32px] font-semibold text-center">
                  Cart Totals
                </h2>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-medium text-base text-black">Subtotal</h4>
                  <h2 className="text-[#9F9F9F] text-base">
                    Rs.{" "}
                    {cart &&
                      cart
                        ?.reduce(
                          (total, item) => total + item.subtotal * item.quantity,
                          0
                        )
                        .toLocaleString("en-IN")}
                  </h2>
                </div>
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-medium text-base text-black">Discount</h4>
                  <h2 className="text-[#9F9F9F] text-base">Rs. 0</h2>
                </div>
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-medium text-base text-black">Shipping</h4>
                  <h2 className="text-[#9F9F9F] text-base">Free</h2>
                </div>
                <Divider />
                <div className="flex items-center justify-between pt-2">
                  <h4 className="font-medium text-base text-black">Total</h4>
                  <h2 className="text-primary text-xl font-medium">
                    Rs.{" "}
                    {cart &&
                      cart
                        ?.reduce(
                          (total, item) => total + item.subtotal * item.quantity,
                          0
                        )
                        .toLocaleString("en-IN")}
                  </h2>
                </div>
                <div className="flex items-center justify-between pt-8">
                  <div className="flex justify-between items-center w-full border border-gray-600/50 hover:border-black py-2 px-3.5 rounded-lg">
                    <span className="text-[#1c252e] font-medium">
                      {Discount[0]?.name || "No Discount Available"}
                    </span>
                    <button
                      className="py-1 px-2 bg-transparent text-[#00A76F] hover:bg-[#00a76f17] transition-background duration-300 font-medium focus:outline-none"
                      onClick={() => handleApply(Discount[0]?._id)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
            <div className="flex justify-center mt-5">
              <button
                className="text-black  w-full px-12 py-3 bg-transparent hover:bg-gray-200/50 transition-background  border-1 rounded-lg border-black"
                onClick={() => handleCheckout(cart._id)}
              >
                Check Out
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Services />
      <Footer />
    </>
  );
}

export default Cart;
