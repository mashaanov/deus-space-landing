import React from "react";
import "./App.css";
import Navbar from "../src/components/Navbar.jsx";
import Carousel from "./components/Carousel.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main className="pt-8 md:pt-24">
        <Carousel />
      </main>
    </>
  );
}

export default App;
