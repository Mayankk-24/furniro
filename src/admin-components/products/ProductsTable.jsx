import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { Button, Tooltip } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const PRODUCTS_PER_PAGE = 5; // Number of products per page
let url = import.meta.env.VITE_ADMIN_URL;
function ProductsTable() {
  const [ProductData, setProductData] = useState([]);
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(ProductData);
  const [currentPage, setCurrentPage] = useState(1);
  const authToken = JSON.parse(localStorage.getItem("token"));

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchItem(term);
    const filtered = ProductData.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const handleInsert = () => {
    navigate("insert");
  };

  const handleUpdate = (id) => {
    navigate(`update/${id}`);
  };
  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const myFun = async () => {
    try {
      const res = await axios.get(`${url}product/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // console.log(res.data.data);
      setProductData(res.data.data);
      setFilteredProducts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    myFun(); // Initial fetch
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${url}product/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(res.data);
      toast.success("Product deleted successfully");

      // Update ProductData
      const updatedProductData = ProductData.filter(
        (product) => product._id !== id
      );
      setProductData(updatedProductData);

      // Update filteredProducts dynamically
      setFilteredProducts(
        updatedProductData.filter(
          (product) =>
            product?.title.toLowerCase().includes(searchItem.toLowerCase()) ||
            product?.category.toLowerCase().includes(searchItem.toLowerCase())
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    // Keep filteredProducts in sync with searchItem changes
    setFilteredProducts(
      ProductData.filter(
        (product) =>
          product?.title.toLowerCase().includes(searchItem.toLowerCase()) ||
          product?.category.toLowerCase().includes(searchItem.toLowerCase())
      )
    );
  }, [ProductData, searchItem]); // Watch ProductData and searchItem

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">
            Product List
          </h2>
          <div>
            <div className="relative flex items-center gap-5">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleSearch}
                value={searchItem}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <Button
                radius="sm"
                color="success"
                variant="shadow"
                className="outline-none focus:outline-none"
                onClick={handleInsert}
              >
                Insert
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {currentProducts.map((product, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                    <img
                      src={product?.image[0]}
                      alt="Product img"
                      className="size-10 rounded-full"
                    />
                    {product.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                    {product.stock || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                    {product.totalSell || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <Tooltip content="Update" color="secondary">
                      <button
                        className="text-indigo-400 bg-transparent border-1 border-gray-700 hover:text-indigo-300 mr-2"
                        onClick={() => handleUpdate(product?._id)}
                      >
                        <Edit size={20} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete" color="danger">
                      <button
                        className="text-red-400 bg-transparent  border-1 border-gray-700 hover:text-red-300"
                        onClick={() => handleDelete(product?._id)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </Tooltip>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            variant="light"
            color="primary"
            className={`focus:outline-none ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </Button>
          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            variant="light"
            color="primary"
            className={`focus:outline-none ${
              currentPage === totalPages
                ? " opacity-50 cursor-not-allowed"
                : " "
            }`}
          >
            Next
          </Button>
        </div>
      </motion.div>
    </>
  );
}

export default ProductsTable;
