import React from "react";
import { useCalculatorContext } from "../../../context/CalculatorContextProvider";
/*
========================================
active drag on each item

*/
const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData("item_key", nodeType);
  event.dataTransfer.effectAllowed = "move";
};
/*
========================================
components to render all calc items

*/
const CalculatorComponents = () => {
  const { itemsData } = useCalculatorContext();
  return (
    <div className="text-gray-100 flex flex-col py-4">
      {itemsData?.map(({ key, label, icon }) => (
        <div key={key} className="p-1" onDragStart={(e) => onDragStart(e, key)}>
          <div
            draggable
            className="rounded flex items-center justify-between gap-2 p-2 cursor-grab 
          hover:bg-gray-800 transition-all"
          >
            {label}
            {icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalculatorComponents;
