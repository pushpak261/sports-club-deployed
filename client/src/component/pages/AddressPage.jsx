import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import MapComponent from "../future features/MapComponent";
import '../../style/addressPage.css';

const AddressPage = () => {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const [coordinates, setCoordinates] = useState(null);
    const [error, setError] = useState(null);
    const [geocodeStatus, setGeocodeStatus] = useState(null); // 'loading' | 'success' | 'error' | null
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/edit-address') {
            fetchUserInfo();
        }
    }, [location.pathname]);

    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo();
            if (response.user.address) {
                setAddress(response.user.address);
                fetchCoordinates(response.user.address);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Unable to fetch user information");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ApiService.saveAddress(address);
            navigate("/profile");
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Failed to save/update address");
        }
    };

    const handleShowOnMap = (e) => {
        e.preventDefault();
        fetchCoordinates(address);
    };

    const fetchCoordinates = async (addr) => {
        const { street, city, state, zipCode, country } = addr;

        if (!city && !state && !country) {
            setGeocodeStatus('error');
            setError("Please fill in at least a city to show on map.");
            return;
        }

        setGeocodeStatus('loading');
        setError(null);

        // Try progressively less specific queries until one matches
        const queries = [
            [street, city, state, zipCode, country],   // full address
            [city, state, zipCode, country],             // without street
            [city, state, country],                      // city + state + country
            [city, country],                             // just city + country
            [state, country],                            // state + country
        ]
            .map(parts => parts.filter(Boolean).join(', '))
            .filter(q => q.length > 0);

        for (const query of queries) {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
                    {
                        headers: {
                            'Accept': 'application/json',
                        }
                    }
                );
                const data = await response.json();

                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    setCoordinates({
                        lat: parseFloat(lat),
                        lng: parseFloat(lon)
                    });
                    setGeocodeStatus('success');
                    setError(null);
                    return; // found it, stop trying
                }
            } catch (err) {
                // try next query
            }
        }

        // All queries failed
        setGeocodeStatus('error');
        setError("Could not locate this address on the map.");
    };

    return (
        <>
            {/* Full-screen map background */}
            <div className="map-section">
                <MapComponent coordinates={coordinates} address={address} />
            </div>

            {/* Floating form card */}
            <div className="address-page">
                <h2>{location.pathname === '/edit-address' ? 'Edit Address' : "Add Address"}</h2>
                {error && <p className="error-message">{error}</p>}
                {geocodeStatus === 'loading' && <p className="geocode-loading">🔍 Finding address on map...</p>}

                <form onSubmit={handleSubmit}>
                    <label>
                        Street:
                        <input type="text" name="street" value={address.street} onChange={handleChange} required />
                    </label>
                    <label>
                        City:
                        <input type="text" name="city" value={address.city} onChange={handleChange} required />
                    </label>
                    <label>
                        State:
                        <input type="text" name="state" value={address.state} onChange={handleChange} required />
                    </label>
                    <label>
                        Zip Code:
                        <input type="text" name="zipCode" value={address.zipCode} onChange={handleChange} required />
                    </label>
                    <label>
                        Country:
                        <input type="text" name="country" value={address.country} onChange={handleChange} required />
                    </label>

                    <div className="address-buttons">
                        <button type="button" className="show-map-btn" onClick={handleShowOnMap}>
                            📍 Show on Map
                        </button>
                        <button type="submit">
                            {location.pathname === '/edit-address' ? 'Edit Address' : "Save Address"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddressPage;
