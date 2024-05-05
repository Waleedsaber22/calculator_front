import React, { createContext, useContext, useState } from "react";
import { FaDivide } from "react-icons/fa6";
import { MdAdd, MdInput, MdOutput } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
const CalculatorContext = createContext(null);
const itemsData = [
  {
    key: "in",
    label: "Input",
    icon: <MdInput className="rotate-90" />,
  },
  {
    key: "out",
    label: "Output",
    icon: <MdOutput className="-rotate-90" />,
  },
  {
    key: "add",
    label: "Add",
    icon: <MdAdd />,
  },
  {
    key: "sub",
    label: "Subtract",
    icon: <RiSubtractFill />,
  },
  {
    key: "mul",
    label: "Multiply",
    icon: <RxCross2 />,
  },
  {
    key: "div",
    label: "Divide",
    icon: <FaDivide />,
  },
];
/*
========================================
calculator context to provide all items and it's props across calculator page

*/
const CalculatorContextProvider = ({ children }) => {
  return (
    <CalculatorContext.Provider value={{ itemsData }}>
      {children}
    </CalculatorContext.Provider>
  );
};

export default CalculatorContextProvider;
export const useCalculatorContext = () => useContext(CalculatorContext);
