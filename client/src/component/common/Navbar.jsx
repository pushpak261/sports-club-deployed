import React, { useState, useEffect, useCallback, useRef } from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../../component/context/CartContext";

const Navbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const debounceTimer = useRef(null);

    const { dispatch } = useCart();

    // Re-check auth state on every route change
    const [isAdmin, setIsAdmin] = useState(ApiService.isAdmin());
    const [isAuthenticated, setIsAuthenticated] = useState(ApiService.isAuthenticated());

    useEffect(() => {
        setIsAdmin(ApiService.isAdmin());
        setIsAuthenticated(ApiService.isAuthenticated());
    }, [location.pathname]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    // === PERFORMANCE: Debounced search (400ms) ===
    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        // Clear any pending debounce
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            navigate(`/?search=${searchValue}`);
        }, 300);
    }, [searchValue, navigate]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (confirm) {
            ApiService.logout();
            dispatch({ type: 'CLEAR_CART' });
            localStorage.removeItem('userId');
            setIsAdmin(false);
            setIsAuthenticated(false);
            navigate('/login');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/" >
                    <img src="./logo.png" alt="Sports Club" loading="lazy" />
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

export default React.memo(Navbar);
