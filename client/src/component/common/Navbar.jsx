// import React, {useState} from "react";
// import '../../style/navbar.css';
// import { NavLink, useNavigate } from "react-router-dom";
// import ApiService from "../../service/ApiService";
//
//
// const Navbar = () =>{
//
//     const [searchValue, setSearchValue] = useState("");
//     const navigate = useNavigate();
//
//     const isAdmin = ApiService.isAdmin();
//     const isAuthenticated = ApiService.isAuthenticated();
//
//     const handleSearchChange =(e) => {
//         setSearchValue(e.target.value);
//     }
//
//     const handleSearchSubmit = async (e) =>{
//         e.preventDefault();
//         navigate(`/?search=${searchValue}`)
//     }
//
//     const handleLogout = () => {
//         const confirm = window.confirm("Are you sure you want to logout? ");
//         if(confirm){
//             ApiService.logout();
//             setTimeout(()=>{
//                 navigate('/login')
//             }, 500);
//         }
//     }
//
//     return(
//         <nav className="navbar">
//             <div className="navbar-brand">
//                 <NavLink to="/" > <img src="./logo.png" alt="Sports Club" /></NavLink>
//             </div>
//             {/* SEARCH FORM */}
//             <form className="navbar-search" onSubmit={handleSearchSubmit}>
//                 <input type="text"
//                        placeholder="Search products"
//                        value={searchValue}
//                        onChange={handleSearchChange} />
//                 <button type="submit">Search</button>
//             </form>
//
//             <div className="navbar-link">
//                 <NavLink to="/" >Home</NavLink>
//                 <NavLink to="/categories" >Categories</NavLink>
//                 {isAuthenticated && <NavLink to="/profile" >My Account</NavLink>}
//                 {isAdmin && <NavLink to="/admin" >Admin</NavLink>}
//                 {!isAuthenticated && <NavLink to="/login" >Login</NavLink>}
//                 {isAuthenticated &&<NavLink onClick={handleLogout} >Logout</NavLink>}
//                 <NavLink to="/cart">Cart</NavLink>
//             </div>
//         </nav>
//     );
//
// };
// export default Navbar;
//
//



//Latest Clear Car when user logged out

import React, { useState } from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../../component/context/CartContext"; // Import the useCart hook

const Navbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const { dispatch } = useCart(); // Access dispatch from the cart context
    const isAdmin = ApiService.isAdmin();
    const isAuthenticated = ApiService.isAuthenticated();

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        navigate(`/?search=${searchValue}`);
    };

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (confirm) {
            ApiService.logout();

            // Clear the cart and reset user ID
            dispatch({ type: 'CLEAR_CART' }); // Clear the cart on logout
            localStorage.removeItem('userId'); // Remove user ID from local storage if saved

            setTimeout(() => {
                navigate('/login');
            }, 500);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/" >
                    <img src="./logo.png" alt="Sports Club" />
                </NavLink>
            </div>
            {/* SEARCH FORM */}
            <form className="navbar-search" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search products"
                    value={searchValue}
                    onChange={handleSearchChange}
                />
                <button type="submit">Search</button>
            </form>

            <div className="navbar-link">
                <NavLink to="/" >Home</NavLink>
                <NavLink to="/categories" >Categories</NavLink>
                {isAuthenticated && <NavLink to="/profile" >My Account</NavLink>}
                {isAdmin && <NavLink to="/admin" >Admin</NavLink>}
                {!isAuthenticated && <NavLink to="/login" >Login</NavLink>}
                {isAuthenticated && <NavLink onClick={handleLogout} >Logout</NavLink>}
                <NavLink to="/cart">Cart</NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
