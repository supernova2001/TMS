import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/profile.css";

const Profile = () => {
    const defaultUser = {
        id: "12345",
        name: "Loading...",
        email: "Loading..."
    };

    const [user, setUser] = useState(defaultUser);
    const [loggedIn, setLoggedIn] = useState(true); // For debugging

    useEffect(() => {
        if (loggedIn) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch('http://localhost:4000/user/profile', {
                        // still setting this up to connect to API
                    });
                    if (response.status !== 200) throw new Error('Failed to fetch user data');
                    const data = await response.json();
                    setUser(data);
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            };

            fetchUserData();
        }
    }, [loggedIn]);

    const handlePasswordReset = async () => {
        try {
            // still setting this up to connect to API
        } catch (error) {
            console.error("Failed to request password reset: ", error);
        }
    };

    if (!loggedIn) {
        return (
            <section className="profile__container">
                <div className="profile__data">
                    <h2>Your Profile</h2>
                    <p  className="enabled-text">Please log in to access your profile.</p>
                    <div className="navigation-buttons">
                        <Link to="/login" className="btn login__btn"><button className="btn">Login</button></Link>
                        <Link to="/register" className="btn register__btn"><button className="btn">Register</button></Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="profile__container">
            <div className="profile__data">
                <h2>Your Profile</h2>
                <div className="user__info">
                    <p><strong>Name:</strong> {user ? user.name : 'Loading...'}</p>
                    <p><strong>Email:</strong> {user ? user.email : 'Loading...'}</p>
                </div>
                <button className="btn reset__btn" onClick={handlePasswordReset}>Reset Password</button>
            </div>
        </section>
    );
};

export default Profile;