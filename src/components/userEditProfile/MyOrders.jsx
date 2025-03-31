import auth from "@/utils/Auth";
import { Button } from "@heroui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { HandHelping } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

const orders = [
  {
    id: "ORD12345",
    date: "2025-02-28",
    status: "Delivered",
    total: "$120.00",
    items: 3,
  },
  {
    id: "ORD67890",
    date: "2025-02-25",
    status: "Shipped",
    total: "$80.50",
    items: 2,
  },
  {
    id: "ORD11223",
    date: "2025-02-20",
    status: "Processing",
    total: "$45.99",
    items: 1,
  },
];

let url = import.meta.env.VITE_PUBLIC_URL;
function MyOrders() {
  const [Orders, setOrders] = useState([]);
  const getOrders = async () => {
    const authData = await auth();
    try {
      const res = await axios.get(`${url}account/getuserpurchases`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  const handleCancelOrder = (orderId) => {
    console.log("Delete button clicked");
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-[#28A745] text-white outline-none focus:outline-none ml-3",
        cancelButton: "bg-[#DC3545] text-white outline-none focus:outline-none",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Do you really want to cancel order ${orderId}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        const authToken = await auth();
        if (result.isConfirmed) {
          try {
            const res = await axios.delete(`${url}billing/cancle/${orderId}`, {
              headers: {
                Authorization: `Bearer ${authToken.token}`,
              },
            });
            if (res.status == 200) {
              swalWithBootstrapButtons.fire({
                title: "Cancelled!",
                text: "Your order has been cancelled.",
                icon: "success",
              });
              const updatedOrder = Orders.filter(
                (item) => item.razorpayOrderId !== orderId
              );
              setOrders(updatedOrder);
            }
          } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary order is safe :)",
            icon: "error",
          });
        }
      });
  };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-gray-600 text-xl font-semibold px-4 py-5">
        My Orders
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {Orders.length > 0 ? (
          <div>
            {Orders.map((order, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-4 mb-4 border-l-4 border-blue-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">
                      Order ID: order_{order._id.slice(-9)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.orderdate).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      Items: {order.products.length}
                    </p>
                    <p className="text-sm text-gray-700">
                      Payment type: {order.orderType}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p
                      className={`text-sm font-medium ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Processing"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.status}
                    </p>
                    <p className="text-lg font-bold">₹{order.total}</p>

                    {/* Cancel Order Button */}
                    <Button
                      variant="outline"
                      color="danger"
                      className="focus:outline-none border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                      onPress={() => handleCancelOrder(order.razorpayOrderId)}
                    >
                      Cancel Order
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-52 border rounded-lg flex justify-center items-center"
          >
            <p className="text-lg font-bold text-gray-700">No Orders Found</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default MyOrders;
