import React from "react";
import CalculatorComponents from "../../calculator/utils/CalculatorComponents";
import { useLayoutContext } from "../../../context/LayoutContextProvider";

const Sidebar = () => {
  const { sidebarWidth, showSidebar, setShowSidebar, sidebarClassName } =
    useLayoutContext();
  return (
    <div
      style={{
        width: showSidebar ? "300px" : "0px",
      }}
      className={`shrink-0 overflow-auto overflow-x-clip h-full ${sidebarClassName} ${
        showSidebar ? "" : ""
      } bg-gray-900`}
    >
      <CalculatorComponents />
    </div>
  );
};

export default Sidebar;
