import React from "react";
import { useCalculatorContext } from "../../../context/CalculatorContextProvider";
import { useReactFlow } from "reactflow";
import { InputNumber } from "antd";
import evalGraph from "./calculate";
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
const CalculatorNodes = () => {
  const { nodesData, setNodeValues, nodeValues, createNewNode } =
    useCalculatorContext();
  const { setNodes, getEdges, getNodes, zoomOut } = useReactFlow();

  return (
    <div className="text-gray-100 flex flex-col py-4">
      {nodesData?.map(({ key, label, icon }) => (
        <div
          key={key}
          onClick={() => {
            // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = {
              x: 0,
              y: 0,
            };
            const itemData = nodesData?.find(
              ({ key: itemKey }) => itemKey == key
            );
            const { label, icon } = itemData || {};
            setNodes((nodes) => {
              const id = `${key}_${
                nodes?.filter(({ id }) => id?.split("_")[0] == key)?.length + 1
              }`;
              const newNode = createNewNode({
                id,
                key,
                label,
                icon,
                value: nodeValues?.id,
                position,
              });
              return [...nodes, newNode];
            });
          }}
          className="p-1"
          onDragStart={(e) => onDragStart(e, key)}
        >
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

export default CalculatorNodes;
