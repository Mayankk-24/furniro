import { motion } from "framer-motion";

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
function MyOrders() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className='text-gray-600 text-xl font-semibold px-4 py-5'>My Orders</h2>
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
                            <div className="text-right">
                                <p className={`text-sm font-medium ${order.status === "Delivered"
                                    ? "text-green-600"
                                    : order.status === "Shipped"
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}>{order.status}</p>
                                <p className="text-lg font-bold">{order.total}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export default MyOrders;