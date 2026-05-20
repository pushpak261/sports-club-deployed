import './App.css';

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import Navbar from "./component/common/Navbar";
import Footer from "./component/common/Footer";
import { CartProvider } from './component/context/CartContext';

// === PERFORMANCE: Code-split routes with React.lazy ===
// Each page is loaded only when the user navigates to it
const HomePage = lazy(() => import("./component/pages/HomePage"));
const ProductDetailsPage = lazy(() => import("./component/pages/ProductDetailsPage"));
const CategoryListPage = lazy(() => import("./component/pages/CategoryListPage"));
const CategoryProductsPage = lazy(() => import("./component/pages/CategoryProductPage"));
const CartPage = lazy(() => import("./component/pages/CartPage"));
const RegisterPage = lazy(() => import("./component/pages/RegisterPage"));
const LoginPage = lazy(() => import("./component/pages/LoginPage"));
const ProfilePage = lazy(() => import("./component/pages/ProfilePage"));
const AddressPage = lazy(() => import("./component/pages/AddressPage"));
const AdminPage = lazy(() => import("./component/admin/AdminPage"));
const AdminCategoryPage = lazy(() => import("./component/admin/AdminCategoryPage"));
const AdminAddCategory = lazy(() => import("./component/admin/AdminAddCategory"));
const AdminEditCategory = lazy(() => import("./component/admin/AdminEditCategory"));
const AdminProductPage = lazy(() => import("./component/admin/AdminProductPage"));
const AdminAddProductPage = lazy(() => import("./component/admin/AdminAddProductPage"));
const AdminEditProductPage = lazy(() => import("./component/admin/AdminEditProductPage"));
const AdminOrderPage = lazy(() => import("./component/admin/AdminOrderPage"));
const AdminOrderDetailsPage = lazy(() => import("./component/admin/AdminOrderDetailsPage"));
const OrderConfirmationPage = lazy(() => import("./component/future features/OrderConfirmationPage"));

// Loading spinner for Suspense fallback
const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #e8832a',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

const App = () => {
    const location = useLocation();

    return (
        <div>
            {/* Hide Navbar on Address and Edit Address Pages */}
            {location.pathname !== '/add-address' && location.pathname !== '/edit-address' && <Navbar />}
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    {/* Our Routes */}
                    <Route exact path='/' element={<HomePage />} />
                    <Route path='/product/:productId' element={<ProductDetailsPage />} />
                    <Route path='/categories' element={<CategoryListPage />} />
                    <Route path='/category/:categoryId' element={<CategoryProductsPage />} />
                    <Route path='/cart' element={<CartPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/profile' element={<ProtectedRoute element={<ProfilePage />} />} />
                    <Route path='/add-address' element={<ProtectedRoute element={<AddressPage />} />} />
                    <Route path='/edit-address' element={<ProtectedRoute element={<AddressPage />} />} />
                    <Route path='/admin' element={<AdminRoute element={<AdminPage />} />} />
                    <Route path='/admin/categories' element={<AdminRoute element={<AdminCategoryPage />} />} />
                    <Route path='/admin/add-category' element={<AdminRoute element={<AdminAddCategory />} />} />
                    <Route path='/admin/edit-category/:categoryId' element={<AdminRoute element={<AdminEditCategory />} />} />
                    <Route path='/admin/products' element={<AdminRoute element={<AdminProductPage />} />} />
                    <Route path='/admin/add-product' element={<AdminRoute element={<AdminAddProductPage />} />} />
                    <Route path='/admin/edit-product/:productId' element={<AdminRoute element={<AdminEditProductPage />} />} />
                    <Route path='/admin/orders' element={<AdminRoute element={<AdminOrderPage />} />} />
                    <Route path='/admin/order-details/:itemId' element={<AdminRoute element={<AdminOrderDetailsPage />} />} />
                    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                </Routes>
            </Suspense>
            <Footer />
        </div>
    );
}

const Main = () => (
    <BrowserRouter>
        <CartProvider>
            <App />
        </CartProvider>
    </BrowserRouter>
);

export default Main;
