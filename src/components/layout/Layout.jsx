import React from "react";
import LayoutContextProvider from "../../context/LayoutContextProvider";

const Layout = ({ children }) => {
  return <LayoutContextProvider>{children}</LayoutContextProvider>;
};

export default Layout;
