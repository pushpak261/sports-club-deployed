import React from "react";
import '../../style/footer.css';
import { NavLink } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <ul>
                    <li>
                        <NavLink to="/about-us">About Us</NavLink>  {/* Links to About Us page */}
                    </li>
                    <li>
                        <NavLink to="/contact">Contact Us</NavLink> {/* Links to Contact Us page */}
                    </li>
                    <li>
                        <NavLink to="/terms">Terms & Conditions</NavLink> {/* Links to Terms page */}
                    </li>
                    <li>
                        <NavLink to="/privacy">Privacy Policy</NavLink> {/* Links to Privacy Policy page */}
                    </li>
                    <li>
                        <NavLink to="/faqs">FAQs</NavLink> {/* Links to FAQs page */}
                    </li>
                </ul>
            </div>
            <div className="footer-info">
                <p>&copy; 2024 Sports Club. All rights reserved.</p>
            </div>
        </footer>
    );
};
export default Footer;
