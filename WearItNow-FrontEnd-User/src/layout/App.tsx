import React, { useEffect } from 'react';
import "../styles/App.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import RoutesMain from "../routers/RouterMain";
import ErrorBoundary from "../error/ErrorBoundary";
import CustomToast from "../components/CustomToast";
import { CartProvider } from "../context/CartContext";
import Navigation from "../components/Navigation";
import ScrollToTop from '../components/ScrollToTop';

function App() {
    return (
        <ErrorBoundary>
                <CartProvider>
                    <Header />
                    <Navigation />
                    <ScrollToTop />
                    <div style={{ paddingTop: '73px' }}>
                        <RoutesMain />
                    </div>
                    <Footer />
                    <CustomToast />
                </CartProvider>
        </ErrorBoundary>
    );
}

export default App;
