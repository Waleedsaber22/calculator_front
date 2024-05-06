import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  updateEdge,
  getOutgoers,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import "./calc.css";
import { getStraightPath } from "reactflow";
import { useCalculatorContext } from "../../context/CalculatorContextProvider";
import { Input, InputNumber } from "antd";
import CustomNode from "./utils/CustomNode";
import FloatingEdge from "./utils/FloatingEdge";
import evalGraph from "./utils/calculate";
import { IoReload } from "react-icons/io5";
import { FcPrevious } from "react-icons/fc";
import { BiSkipPrevious } from "react-icons/bi";
import { FaBackward, FaForward } from "react-icons/fa6";
import { LuForward, LuUndo2 } from "react-icons/lu";
const initialNodes = [];
const initialEdges = [];
/*
========================================================================================================
custom connection lines during drag action
*/
function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
      <circle
        cx={toX}
        cy={toY}
        fill="black"
        r={10}
        stroke="black"
        strokeWidth={1.5}
      />
    </g>
  );
}
const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "black",
};
/* ================================================= end ================================================ */

const CalculatorView = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodesData, nodeValues, setNodeValues, createNewNode } =
    useCalculatorContext();

  /*
  =======================================================================================
  custom nodes and edges components used to style it with more controllability
  
  */
  const nodeTypes = useMemo(
    () => ({
      custom: (props) => CustomNode(props),
    }),
    [CustomNode]
  );
  const edgeTypes = useMemo(
    () => ({
      floating: FloatingEdge,
    }),
    [FloatingEdge]
  );

  /*
  =======================================================================================
  event handler when item dropped (input - output - .......)
  
  */
  const handleDropItem = useCallback(
    (e) => {
      e.preventDefault();

      const key = e.dataTransfer.getData("item_key");

      // check if the dropped element is valid
      if (typeof key === "undefined" || !key) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      const nodeData = nodesData?.find(({ key: itemKey }) => itemKey == key);
      const { label, icon } = nodeData || {};
      setNodes((nodes) => {
        const id = `${key}_${
          nodes?.filter(({ id }) => id?.split("_")[0] == key)?.length + 1
        }`;
        const newNode = createNewNode({
          id,
          key,
          label,
          icon,
          position,
          value: nodeValues?.[id],
        });
        return [...nodes, newNode];
      });
    },
    [reactFlowInstance, nodeValues]
  );

  /*
  ========================================================================================================
  re-evalute our flow when input changes 
  
  */
  useEffect(() => {
    setNodes((nodes) => {
      return nodes?.map((n) =>
        ["in", "out"]?.includes(n?.key)
          ? {
              ...n,
              value: nodeValues?.[n?.id],
              data: {
                label: (
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className={`text-white flex gap-2 items-center justify-center
               w-full p-2 rounded-t-lg ${
                 n?.key == "in"
                   ? "bg-yellow-700"
                   : n?.key == "out"
                   ? "bg-blue-700"
                   : "bg-red-700"
               }`}
                    >
                      <div>{n?.label}</div>
                      <div>{n?.icon}</div>
                    </div>
                    {["out", "in"].includes(n?.key) ? (
                      <InputNumber
                        name={n?.id}
                        value={nodeValues?.[n?.id]}
                        disabled={n?.key == "out"}
                        onChange={(val) => {
                          const outputValues = evalGraph(
                            getNodes()?.map((node) =>
                              node?.id == n?.id ? { ...node, value: val } : node
                            ),
                            getEdges()
                          );
                          setNodeValues((nV) => ({
                            ...nV,
                            [n?.id]: val,
                            ...(outputValues || {}),
                          }));
                        }}
                        placeholder={n?.label}
                        className={`!rounded-none !w-full ${
                          n?.key == "out"
                            ? "allow-cursor-output !cursor-auto !text-gray-800 !text-center"
                            : ""
                        }`}
                      />
                    ) : null}
                  </div>
                ),
              },
            }
          : n
      );
    });
  }, [nodeValues]);
  /* ================================================= end ================================================ */

  const edgeUpdateSuccessful = useRef(true);
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);
  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);
  const { getNodes, getEdges, zoomOut } = useReactFlow();
  const isValidConnection = useCallback(
    (connection) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      const hasCycle = (node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target.id === connection.source) return false;
      const sourceKey = connection?.source?.split("_")[0];
      const targetKey = connection?.target?.split("_")[0];
      if (
        (sourceKey == targetKey && ["in"].includes(sourceKey)) ||
        (targetKey == "out" &&
          edges?.some(({ target }) => target == connection?.target)) ||
        targetKey == "in" ||
        // (!["in", "out"].includes(sourceKey) &&
        //   !["in", "out"].includes(targetKey))
        //||
        edges?.some(
          ({ target, source }) =>
            source == connection?.source && target == connection?.target
        )
      )
        return false;
      return !hasCycle(target);
    },
    [getNodes, getEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const nodes = getNodes();
        const newEdges = addEdge(params, eds);
        const allEdges = getEdges();
        const outputValues = evalGraph(nodes, newEdges);
        setNodeValues(() => ({ ...nodeValues, ...(outputValues || {}) }));
        return newEdges;
      });
    },
    [setEdges, nodeValues]
  );
  return (
    <div
      className={`relative h-[calc(100vh-50px)] calc-wrapper border-l-4 border-t-4 border-gray-200 overflow-auto h-full grow`}
    >
      <ReactFlow
        onDrop={(e) => handleDropItem(e, setNodes, reactFlowInstance)}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        edgeTypes={edgeTypes}
        fitView
        connectionLineComponent={CustomConnectionLine}
        nodeTypes={nodeTypes}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        defaultEdgeOptions={{
          style: {
            strokeWidth: 3,
            stroke: "gray",
          },
          type: "floating",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "gray",
          },
        }}
        isValidConnection={isValidConnection}
        connectionLineStyle={connectionLineStyle}
      >
        <Controls />
        <div className="flex flex-col gap-2">
          <IoReload
            className="relative z-[100000] p-2 box-content text-gray-400 text-xl cursor-pointer"
            onClick={() => {
              setEdges([]);
              setNodes([]);
              setNodeValues({});
            }}
          />
          {/* <LuUndo2 className="relative z-[100000] p-2 box-content text-gray-400 text-xl cursor-pointer" /> */}
          {/* <LuForward className="relative z-[100000] p-2 box-content text-gray-400 text-xl cursor-pointer" /> */}
        </div>
        {/* <MiniMap /> */}
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default CalculatorView;
