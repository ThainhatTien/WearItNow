import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../page/Home";
import Category from "../page/Category";
import PrivateRoute from "./PrivateRoute";
import Product from "../page/Product";
import AboutUs from "../page/AboutUs";
import UserDashboard from "../page/UserDashboard";
import ProductDetail from "../page/ProductDetail";
import Checkout from "../page/PayProduct";
import LoadingBarComponent from "../components/LoadingBarComponent";
import LoginForm from "../page/LoginForm";
import RegisterForm from "../page/RegisterForm";
import ForgotPassword from "../page/ForgotPassword";
import PrivacyPolicy from "../page/PrivacyPolicy";
import Recruitment from "../page/Recruitment";
import ReturnAndExchangePolicy from "../page/ReturnAndExchangePolicy";
import WarrantyPolicy from "../page/WarrantyPolicy";

function RoutesMain() {
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  const startLoading = () => {
    setProgress(10); // Start loading
  };

  const finishLoading = () => {
    setProgress(100); // Complete loading
    setTimeout(() => setProgress(0), 500); // Reset progress after 500ms
  };

  useEffect(() => {
    startLoading(); // Start loading when location changes
    const timer = setTimeout(finishLoading, 1000); // Simulate loading time
    return () => clearTimeout(timer); // Clean up timer when component unmounts
  }, [location]);

  return (
    <>
      <LoadingBarComponent progress={progress} />
      <Routes location={location} key={location.key}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          path="/category/:slug"
          element={
            <PrivateRoute isAuthenticated={true} element={<Category />} />
          }
        />
        <Route
          path="product/:name/:encodedId"
          element={
            <PrivateRoute isAuthenticated={true} element={<ProductDetail />} />
          }
        />
        <Route
          path="/:slugcategory/:slugsubcategory/:encodedId"
          element={
            <PrivateRoute isAuthenticated={true} element={<Product />} />
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute isAuthenticated={true} element={<Product />} />
          }
        />
        <Route
          path="/payproduct"
          element={
            <PrivateRoute isAuthenticated={true} element={<Checkout />} />
          }
        />
        <Route
          path="/userdashboard"
          element={
            <PrivateRoute isAuthenticated={true} element={<UserDashboard />} />
          }
        />
        {/* Static pages */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route
          path="/return-and-exchange-policy"
          element={<ReturnAndExchangePolicy />}
        />
        <Route path="/warranty-policy" element={<WarrantyPolicy />} />
      </Routes>
    </>
  );
}

export default RoutesMain;
