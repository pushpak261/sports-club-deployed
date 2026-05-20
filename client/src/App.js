//
// import './App.css';
//
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import {ProtectedRoute, AdminRoute} from "./service/Guard";
// import Navbar from "./component/common/Navbar";
// import Footer from "./component/common/Footer";
// import {CartProvider} from './component/context/CartContext'
// import HomePage from "./component/pages/HomePage";
// import ProductDetailsPage from "./component/pages/ProductDetailsPage";
// import CategoryListPage from "./component/pages/CategoryListPage";
// import CategoryProductsPage from "./component/pages/CategoryProductPage";
// import CartPage from "./component/pages/CartPage";
// import RegisterPage from "./component/pages/RegisterPage";
// import LoginPage from "./component/pages/LoginPage";
// import ProfilePage from "./component/pages/ProfilePage";
// import AddressPage from "./component/pages/AddressPage";
// import AdminPage from "./component/admin/AdminPage";
// import AdminCategoryPage from "./component/admin/AdminCategoryPage";
// import AdminAddCategory from "./component/admin/AdminAddCategory";
// import AdminEditCategory from "./component/admin/AdminEditCategory";
// import AdminProductPage from "./component/admin/AdminProductPage";
// import AdminAddProductPage from "./component/admin/AdminAddProductPage";
// import AdminEditProductPage from "./component/admin/AdminEditProductPage";
// import AdminOrderPage from "./component/admin/AdminOrderPage";
// import AdminOrderDetailsPage from "./component/admin/AdminOrderDetailsPage";
// import OrderConfirmationPage from "./component/future features/OrderConfirmationPage";
//
// function App() {
//   return (
//       <BrowserRouter>
//         <CartProvider>
//           <Navbar/>
//           <Routes>
//               {/*Our Routes*/}
//               <Route exact path = '/' element={<HomePage/>}/>
//               <Route path = '/product/:productId' element={<ProductDetailsPage/>} />
//               <Route path = '/categories' element={<CategoryListPage/>}/>
//               <Route path = '/category/:categoryId' element={<CategoryProductsPage/>} />
//               <Route path = '/cart' element={<CartPage/>}/>
//               <Route path = '/register' element={<RegisterPage/>}/>
//               <Route path = '/login' element={<LoginPage/>}/>
//
//               {/*<Route path = '/profile' element={<ProfilePage/>}/>*/}
//
//               <Route path = '/profile' element={<ProtectedRoute element={<ProfilePage/>} />} />
//               <Route path = '/add-address' element={<ProtectedRoute element={<AddressPage/>} />} />
//               <Route path = '/edit-address' element={<ProtectedRoute element={<AddressPage/>} />} />
//
//               <Route path = '/admin' element={<AdminRoute element={<AdminPage/>} />} />
//               <Route path = '/admin/categories' element={<AdminRoute element={<AdminCategoryPage/>} />} />
//               <Route path = '/admin/add-category' element={<AdminRoute element={<AdminAddCategory/>} />} />
//               <Route path = '/admin/edit-category/:categoryId' element={<AdminRoute element={<AdminEditCategory/>} />} />
//
//               <Route path = '/admin/products' element={<AdminRoute element={<AdminProductPage/>} />} />
//               <Route path = '/admin/add-product' element={<AdminRoute element={<AdminAddProductPage/>} />} />
//               <Route path = '/admin/edit-product/:productId' element={<AdminRoute element={<AdminEditProductPage/>} />} />
//
//               <Route path = '/admin/orders' element={<AdminRoute element={<AdminOrderPage/>} />} />
//               <Route path='/admin/order-details/:itemId' element={<AdminRoute element={<AdminOrderDetailsPage/>} />} />
//
//               <Route path="/order-confirmation" element={<OrderConfirmationPage />} /> {/* Order Confirmation Route */}
//
//
//
//
//
//           </Routes>
//           <Footer/>
//         </CartProvider>
//       </BrowserRouter>
//
//   );
// }
//
// export default App;







//Hiding Map Component When Address Page is Opened.

import './App.css';

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import Navbar from "./component/common/Navbar";
import Footer from "./component/common/Footer";
import { CartProvider } from './component/context/CartContext';
import HomePage from "./component/pages/HomePage";
import ProductDetailsPage from "./component/pages/ProductDetailsPage";
import CategoryListPage from "./component/pages/CategoryListPage";
import CategoryProductsPage from "./component/pages/CategoryProductPage";
import CartPage from "./component/pages/CartPage";
import RegisterPage from "./component/pages/RegisterPage";
import LoginPage from "./component/pages/LoginPage";
import ProfilePage from "./component/pages/ProfilePage";
import AddressPage from "./component/pages/AddressPage";
import AdminPage from "./component/admin/AdminPage";
import AdminCategoryPage from "./component/admin/AdminCategoryPage";
import AdminAddCategory from "./component/admin/AdminAddCategory";
import AdminEditCategory from "./component/admin/AdminEditCategory";
import AdminProductPage from "./component/admin/AdminProductPage";
import AdminAddProductPage from "./component/admin/AdminAddProductPage";
import AdminEditProductPage from "./component/admin/AdminEditProductPage";
import AdminOrderPage from "./component/admin/AdminOrderPage";
import AdminOrderDetailsPage from "./component/admin/AdminOrderDetailsPage";
import OrderConfirmationPage from "./component/future features/OrderConfirmationPage";


const App = () => {
    const location = useLocation();

    return (
        <div>
            {/* Hide Navbar on Address and Edit Address Pages */}
            {location.pathname !== '/add-address' && location.pathname !== '/edit-address' && <Navbar />}
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
            <Footer />
        </div>
    );
}

// Wrap your App component with Router in your main entry point
const Main = () => (
    <BrowserRouter>
        <CartProvider>
            <App />
        </CartProvider>
    </BrowserRouter>
);

export default Main;






