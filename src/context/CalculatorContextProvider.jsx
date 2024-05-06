import { InputNumber } from "antd";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { FaDivide } from "react-icons/fa6";
import { MdAdd, MdInput, MdOutput } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useReactFlow } from "reactflow";
import evalGraph from "../components/calculator/actions/calculate";
const CalculatorContext = createContext(null);
const nodesData = [
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
  const [nodeValues, setNodeValues] = useState({});
  const { getNodes, getEdges } = useReactFlow();
  const createNewNode = useCallback(
    ({ id, key, label, icon, position, value }) => ({
      id,
      key,
      type: "custom",
      style: { padding: "0px" },
      position,
      label,
      icon,
      value,
      data: {
        label: (
          <div className="flex flex-col items-center justify-center">
            <div
              className={`text-white flex gap-2 items-center justify-center
           w-full p-2 rounded-t-lg ${
             key == "in"
               ? "bg-yellow-700"
               : key == "out"
               ? "bg-blue-700"
               : "bg-red-700"
           }`}
            >
              <div>{label}</div>
              <div>{icon}</div>
            </div>
            {["out", "in"].includes(key) ? (
              <InputNumber
                name={id}
                value={value}
                disabled={key == "out"}
                onChange={(val) => {
                  const outputValues = evalGraph(
                    getNodes()?.map((n) =>
                      n?.id == id ? { ...n, value: val } : n
                    ),
                    getEdges()
                  );
                  setNodeValues((nV) => ({
                    ...nV,
                    [id]: val,
                    ...(outputValues || {}),
                  }));
                }}
                placeholder={label}
                className={`!rounded-none !w-full ${
                  key == "out"
                    ? "allow-cursor-output !cursor-auto !text-gray-800 !text-center"
                    : ""
                }`}
              />
            ) : null}
          </div>
        ),
      },
    }),
    []
  );
  return (
    <CalculatorContext.Provider
      value={{ nodesData, nodeValues, setNodeValues, createNewNode }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export default CalculatorContextProvider;
export const useCalculatorContext = () => useContext(CalculatorContext);
