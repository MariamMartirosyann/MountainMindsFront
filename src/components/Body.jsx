import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import Footer from "./Footer";

function Body() {
  return (
    <div  data-theme="dark">
      <Navbar />
      <Outlet  />
      <Footer/>
    </div>
  );
}

export default Body;
