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
const CalculatorComponents = () => {
  const { itemsData, setNodeValues, nodeValues } = useCalculatorContext();
  const { setNodes, getEdges, getNodes, zoomOut } = useReactFlow();

  return (
    <div className="text-gray-100 flex flex-col py-4">
      {itemsData?.map(({ key, label, icon }) => (
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
            const itemData = itemsData?.find(
              ({ key: itemKey }) => itemKey == key
            );
            const { label, icon } = itemData || {};
            setNodes((nodes) => {
              const id = `${key}_${
                nodes?.filter(({ id }) => id?.split("_")[0] == key)?.length + 1
              }`;
              const newNode = {
                id,
                key,
                type: "custom",
                style: { padding: "0px" },
                position,
                label,
                icon,
                value: nodeValues?.[id],
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
                          value={nodeValues?.[id]}
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
                            key == "out" ? "!text-gray-800 !text-center" : ""
                          }`}
                        />
                      ) : key == "out" ? (
                        <div>Connect it</div>
                      ) : null}
                    </div>
                  ),
                },
              };
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

export default CalculatorComponents;
