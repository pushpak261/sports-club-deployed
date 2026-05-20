import React from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminPage.css'


const AdminPage = () => {
    const navigate = useNavigate();

    return(
        <div className="admin-page">

            {/*Background Video*/}
            <video autoPlay loop muted className="background-video">
                <source src="/bgvideo.mp4" type="video/mp4"/>
                Your browser does not support the video tag.
            </video>

            <h1>Welcome Admin</h1>
            <button onClick={()=> navigate("/admin/categories")}>Manage Categories</button>
            <button onClick={()=> navigate("/admin/products")}>Manage Products</button>
            <button onClick={()=> navigate("/admin/orders")}>Manage Orders</button>
        </div>
    )
}

export default AdminPage;