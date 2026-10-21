import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import TechRider from "./pages/TechRider";
import Contacts from "./pages/Contacts";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/admin" && <Navbar />}
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home />} />
        <Route path="/tech-rider" element={<TechRider />} />
        <Route path="/order" element={<Contacts />} />
      </Routes>
    </>
  );
}

export default App;
