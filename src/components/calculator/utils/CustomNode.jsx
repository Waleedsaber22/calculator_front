import { LuGrip } from "react-icons/lu";
import { Handle, Position, useStore } from "reactflow";

const connectionNodeIdSelector = (state) => state.connectionNodeId;

export default function CustomNode(props) {
  const { id, data } = props || {};
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  const label = isTarget ? "Drop here" : "Drag to connect";
  return (
    <div className="relative flex justify-center">
      <LuGrip className="rounded-t-lg absolute top-[-20px]  text-gray-700 bg-gray-200 text-xl p-1 rounded-t-2 box-content" />
      <div
        className={`customNodeBody p-2 rounded-lg ${
          isTarget ? "bg-gray-300" : "bg-gray-200"
        }`}
        style={{
          borderStyle: isTarget ? "dashed" : "solid",
        }}
      >
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
        {!isConnecting && (
          <Handle
            className="customHandle"
            position={Position.Right}
            type="source"
          />
        )}

        <Handle
          className="customHandle"
          position={Position.Left}
          type="target"
          isConnectableStart={false}
        />
        {data?.label}
      </div>
    </div>
  );
}
