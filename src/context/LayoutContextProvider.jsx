import React, { createContext, useContext, useState } from "react";
const LayoutContext = createContext(null);
const LayoutContextProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  /*
========================================
layout context to control visibility of sidebar

*/
  return (
    <LayoutContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        sidebarWidth: showSidebar ? "300px" : "10px",
        sidebarClassName: "transition-all duration-500",
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContextProvider;
export const useLayoutContext = () => useContext(LayoutContext);