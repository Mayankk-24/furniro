import React, { useEffect, useState } from "react";
import { Button, Input, Table } from "@heroui/react";
import axios from "axios";
import auth from "@/utils/Auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [transactions, setTransactions] = useState([]);

    const url = import.meta.env.VITE_PUBLIC_URL;

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        const authData = await auth();
        try {
            const res = await axios.get(`${url}wallet/balance`, {
                headers: { Authorization: `Bearer ${authData.token}` },
            });
            setBalance(res.data.balance);
            setTransactions(res.data.transactions);
        } catch (error) {
            console.error(error);
        }
    };

    const addFunds = async () => {
        if (!amount || amount <= 0) {
            toast.error("Enter a valid amount.");
            return;
        }

        const authData = await auth();
        try {
            const res = await axios.post(
                `${url}wallet/add`,
                { amount },
                { headers: { Authorization: `Bearer ${authData.token}` } }
            );
            toast.success("Amount added successfully!");
            setBalance(res.data.newBalance);
            setTransactions(res.data.transactions);
            setAmount("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add funds.");
        }
    };

    const transaction = [
        { id: 1, type: "credit", description: "Salary Credited", amount: 5000, date: "2025-03-01T10:00:00Z" },
        { id: 2, type: "debit", description: "Grocery Shopping", amount: 1200, date: "2025-02-28T15:30:00Z" },
        { id: 3, type: "credit", description: "Freelance Payment", amount: 3000, date: "2025-02-25T12:45:00Z" },
        { id: 4, type: "debit", description: "Electricity Bill", amount: 800, date: "2025-02-20T09:10:00Z" },
        { id: 5, type: "credit", description: "Refund from Store", amount: 500, date: "2025-02-18T18:00:00Z" },
        { id: 6, type: "debit", description: "Online Subscription", amount: 399, date: "2025-02-15T20:20:00Z" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto p-6 mt-10 shadow-lg rounded-2xl border bg-white">
            <h2 className="text-gray-800 text-2xl font-semibold text-center">Wallet</h2>
            <p className="text-gray-600 mt-2 text-center">Your balance: <strong className="text-black text-lg">${balance}</strong></p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3 mt-5 justify-center items-center">
                <Input
                    label="Enter Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    variant="bordered"
                />
                <Button onPress={addFunds} className="bg-black text-white px-5">Add Funds</Button>
            </motion.div>

            <h3 className="mt-8 text-lg font-semibold text-center">Transaction History</h3>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-3">
                {/* <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction.map((txn, index) => (
                            <tr key={index}>
                                <td>{new Date(txn.date).toLocaleDateString()}</td>
                                <td>${txn.amount}</td>
                                <td>{txn.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}
            </motion.div>
        </motion.div>
    );
};

export default Wallet;
