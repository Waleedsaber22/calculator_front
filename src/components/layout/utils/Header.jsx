import { Avatar } from "antd";
import React from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { useLayoutContext } from "../../../context/LayoutContextProvider";

const Header = () => {
  const { showSidebar, setShowSidebar, sidebarWidth, sidebarClassName } =
    useLayoutContext();
  return (
    <div className="flex justify-between items-center bg-white h-[50px]">
      <div
        className={`${
          showSidebar ? sidebarWidth : "w-[45px]"
        } ${sidebarClassName} flex items-center justify-between bg-gray-100 rounded-lg p-2`}
      >
        <Avatar
          src={"/icon.svg"}
          size={"large"}
          className={`${sidebarClassName} ${
            showSidebar ? "opacity-100" : "opacity-0"
          }`}
        />
        {showSidebar ? (
          <AiOutlineMenuFold
            className="text-2xl text-gray-600 cursor-pointer shrink-0"
            onClick={() => setShowSidebar(false)}
          />
        ) : (
          <AiOutlineMenuUnfold
            className="text-2xl text-gray-600 cursor-pointer shrink-0"
            onClick={() => setShowSidebar(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
