import { Outlet } from "react-router-dom";
import Header from "./Header";
import React from "react";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
