import React from "react";
import { Route, Routes } from "react-router-dom";
import OverviewPage from "./OverviewPage";
import ProductsPage from "./ProductsPage";
import Slidebar from "../admin-components/common/Slidebar";
import UsersPage from "./UsersPage";
import SalesPage from "./SalesPage";
import OrdersPage from "./OrdersPage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";
import ProductInsert from "../admin-components/products/ProductInsert";
import ProductUpdate from "../admin-components/products/ProductUpdate";
import UserInsert from "../admin-components/users/UserInsert";
import UserUpdate from "../admin-components/users/UserUpdate";
import EditAdminProfile from "@/admin-components/settings/EditAdminProfile";
import ChangePass from "@/admin-components/settings/ChangePass";

function AdminPages() {
  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        {/* BG */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80"></div>
          <div className="absolute inset-0 backdrop-blur-sm"></div>
        </div>

        <Slidebar />
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="products/" element={<ProductsPage />}></Route>
          <Route path="products/insert" element={<ProductInsert />} />
          <Route path="products/update/:id" element={<ProductUpdate />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/insert" element={<UserInsert />} />
          <Route path="users/update/:id" element={<UserUpdate />} />
          {/* <Route path="sales" element={<SalesPage />} /> */}
          <Route path="orders" element={<OrdersPage />} />
          {/* <Route path="analytics" element={<AnalyticsPage />} /> */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/editadmin" element={<EditAdminProfile />} />
          <Route path="settings/changepass" element={<ChangePass />} />
        </Routes>
      </div>
    </>
  );
}

export default AdminPages;
