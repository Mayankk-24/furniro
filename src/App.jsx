import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Home from "./components/pages/Home";
import Shop from "./components/pages/Shop";
import ProductInfo from "./components/products/ProductInfo";
import { Toaster } from "sonner";
import { createContext, useState } from "react";
import ProductComparison from "./components/pages/ProductComparison";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/Checkout";
import Contact from "./components/pages/Contact";
import Blog from "./components/pages/Blog";
import AdminPages from "./admin-pages/AdminPages";
import SingUpPage from "./components/pages/SingUpPage";
import SignIn from "./components/pages/SignIn";
import ResetPassword from "./components/pages/ResetPassword";
import UpdatePass from "./components/pages/UpdatePass";
import Auth from "./Auth";
import Error404 from "./components/pages/Error404";
import Thankyou from "./components/pages/Thankyou";
import EditUserProfile from "./components/userEditProfile/EditUserProfile";

let ProductId = createContext();
function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Home without auth route */}
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
        </Route>

        {/* Auth routes */}
        <Route element={<Auth />}>
          <Route path="/" element={<Header />}>
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/product" element={<ProductInfo />} />
            <Route path="/shop/product/:id" element={<ProductInfo />} />
            <Route path="/compare" element={<ProductComparison />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
          </Route>
          <Route path="/admin/*" element={<AdminPages />} />
          <Route path="/edituser" element={<EditUserProfile />} />
        </Route>
        <Route path="/signup" element={<SingUpPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/updatepassword" element={<UpdatePass />} />
        <Route path="/*" element={<Error404 />} />
        <Route path="/thanks" element={<Thankyou />} />
      </Routes>
    </>
  );
}

export default App;
export { ProductId };
