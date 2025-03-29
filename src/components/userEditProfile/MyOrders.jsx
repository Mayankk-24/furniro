import auth from "@/utils/Auth";
import { Button } from "@heroui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { HandHelping } from "lucide-react";
import { useEffect, useState } from "react";
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
    .then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          console.log("Deleting order");
        }, 3000);
        swalWithBootstrapButtons.fire({
          title: "Cancelled!",
          text: "Your order has been cancelled.",
          icon: "success",
        });
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
let url = import.meta.env.VITE_PUBLIC_URL;
function MyOrders() {
  const [Orders, setOrders] = useState([])
  const getOrders = async () => {
    const authData = await auth();
    try {
      const res = await axios.get(`${url}account/getuserpurchases`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
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
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            className="bg-white shadow-lg rounded-2xl p-4 mb-4 border-l-4 border-blue-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Order ID: {order.id}</p>
                <p className="text-sm text-gray-500">Date: {order.date}</p>
                <p className="text-sm text-gray-700">Items: {order.items}</p>
              </div>
              <div className="text-right space-y-2">
                <p
                  className={`text-sm font-medium ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Shipped"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </p>
                <p className="text-lg font-bold">{order.total}</p>

                {/* Cancel Order Button */}
                <Button
                  variant="outline"
                  color="danger"
                  className="focus:outline-none border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                  onPress={() => handleCancelOrder(order.id)}
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default MyOrders;
