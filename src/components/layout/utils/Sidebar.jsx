import React from "react";
import CalculatorNodes from "../../calculator/utils/CalculatorNodes";
import { useLayoutContext } from "../../../context/LayoutContextProvider";

const Sidebar = () => {
  const { sidebarWidth, showSidebar, setShowSidebar, sidebarClassName } =
    useLayoutContext();
  return (
    <div
      className={`shrink-0 overflow-auto overflow-x-clip h-full ${sidebarClassName} ${
        showSidebar ? sidebarWidth : "w-0"
      } bg-gray-900`}
    >
      <CalculatorNodes />
    </div>
  );
};

export default Sidebar;
