import React from "react";
import Logo from "./logo";
import RightSideBar from "./rightsidebar";

const Navbar = () => {
  return (
    <div className="w-full flex justify-around shadow-sm items-center py-4">
      <Logo />
      <RightSideBar />
    </div>
  );
};

export default Navbar;
