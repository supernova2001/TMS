import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Hotel from "../pages/Hotel";
import Profile from "../pages/Profile";
import ExploreCities from "../pages/ExploreCities"
import About from "../pages/About";
import SearchHotels from "../pages/SearchHotels"
import SearchTransportation from "../pages/SearchTransportation"
import Itinerary from "../pages/Itinerary";
import PasswordRecoveryForm from "../pages/RecoverPassword";
import PasswordReset from "../pages/ResetPassword";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/hotel" element={<Hotel />} />
      <Route path="/profile" element={<Profile />} /> 
      <Route path="/explore" element={<ExploreCities />} />
      <Route path="/search-hotels" element={<SearchHotels />} />
      <Route path="/search-transportation" element={<SearchTransportation />} />
      <Route path="/itinerary" element={<Itinerary />} />
      <Route path="/recoverpassword" element={<PasswordRecoveryForm />} />
      <Route path="/reset-password/:token" element={<PasswordReset />} />
    </Routes>
  );
};

export default Router;
