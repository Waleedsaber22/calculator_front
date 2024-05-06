// class Node {
//   constructor(type, value = null) {
//     this.type = type; // 'number' or 'operation'
//     this.value = value; // value of the node (number) or operation ('+', '-', '*', '/')
//     this.inputs = []; // array of input node IDs
//     this.outputs = []; // array of output node IDs
//   }
// }

// // Function to evaluate a node recursively
// function evaluateNode(node, nodeMap, inputValues) {
//   // If the node has already been visited, return its value
//   if (node.value !== undefined) {
//     return node.value;
//   }

//   // If the node is an operation node, recursively evaluate its input nodes
//   const inputNodes = node.inputs.map((inputId) => nodeMap.get(inputId));
//   const inputResults = inputNodes.map((inputNode) =>
//     evaluateNode(inputNode, nodeMap, inputValues)
//   );

//   // Perform the operation based on the node's ID
//   switch (node.id.split("_")[0]) {
//     case "add":
//       node.value = inputResults.reduce((acc, curr) => acc + curr, 0);
//       break;
//     case "sub":
//       node.value = inputResults.reduce((acc, curr) => acc - curr);
//       break;
//     case "mul":
//       node.value = inputResults.reduce((acc, curr) => acc * curr, 1);
//       break;
//     case "div":
//       node.value = inputResults.reduce((acc, curr) => acc / curr);
//       break;
//     default:
//       throw new Error("Invalid operation");
//   }
//   nodeMap.set(node.id, node);
//   // Return the evaluated value
//   return node.value;
// }
// // Function to evaluate a graph given its nodes and edges
// function evaluateGraph(nodes, edges) {
//   // Construct the graph
//   const nodeMap = new Map(); // Map to store nodes by ID

//   // Create nodes
//   nodes.forEach((nodeData) => {
//     const { id, value } = nodeData;
//     const node = new Node(value === undefined ? "operation" : "number", value);
//     nodeMap.set(id, node);
//   });

//   // Connect edges
//   edges.forEach(({ source, target }) => {
//     const sourceNode = nodeMap.get(source);
//     const targetNode = nodeMap.get(target);
//     if (sourceNode && targetNode) {
//       sourceNode.outputs.push(targetNode);
//       targetNode.inputs.push(sourceNode);
//     }
//   });

//   // Find output nodes
//   const outputNodes = nodes
//     .filter((node) => node.id.startsWith("out"))
//     .map((outputNode) => nodeMap.get(outputNode.id));

//   // Evaluate the graph starting from input nodes
//   const outputValues = outputNodes.map((outputNode) =>
//     evaluateNode(outputNode, nodeMap)
//   );

//   // Create an object of output values in the desired format
//   const outputObject = {};
//   outputNodes.forEach((outputNode, index) => {
//     outputObject[outputNode.id] = outputValues[index];
//   });

//   return outputObject;
// }

// Example usage
// Define a Node class to represent nodes in the graph
// Define a Node class to represent nodes in the graph
// Define a Node class to represent nodes in the graph
// Define a Node class to represent nodes in the graph
// Define a Node class to represent nodes in the graph
// Define a Node class to represent nodes in the graph
// Define a Node class to represent nodes in the graph
// Define a Node class to represent nodes in the graph
// Define a Node class to represent nodes in the graph
// Define a Node class to represent nodes in the graph
class Node {
  constructor(id, value = null) {
    this.id = id; // Node ID
    this.value = value; // Value of the node
    this.inputs = []; // Array to store input node IDs
    this.outputs = []; // Array to store output node IDs
  }
}

// Function to perform topological sorting
function topologicalSort(nodes, edges) {
  const inDegree = new Map();
  const queue = [];

  // Calculate in-degree for each node
  nodes.forEach((node) => inDegree.set(node.id, 0));
  edges.forEach((edge) =>
    inDegree.set(edge.target, inDegree.get(edge.target) + 1)
  );

  // Enqueue nodes with in-degree 0
  nodes.forEach((node) => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });

  // Perform topological sort
  const sortedNodes = [];
  while (queue.length > 0) {
    const nodeId = queue.shift();
    sortedNodes.push(nodeId);

    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        inDegree.set(edge.target, inDegree.get(edge.target) - 1);
        if (inDegree.get(edge.target) === 0) {
          queue.push(edge.target);
        }
      }
    });
  }

  return sortedNodes;
}
// old alg ===>

// // Function to evaluate a graph given its nodes and edges
// function evaluateGraph(nodes, edges) {
//   // Perform topological sorting
//   const sortedNodes = topologicalSort(nodes, edges);

//   // Create a map to store node values
//   const nodeValues = new Map();

//   // Evaluate nodes in the topologically sorted order
//   sortedNodes.forEach((nodeId) => {
//     const node = nodes.find((n) => n.id === nodeId);
//     const inputs = edges
//       .filter((edge) => edge.target === nodeId)
//       .map((edge) => {
//         const inputNode = nodes.find((n) => n.id === edge.source);
//         return nodeValues.get(inputNode.id);
//       });

//     // For input nodes, use their values directly
//     if (inputs.length === 0) {
//       nodeValues.set(nodeId, node.value === null ? 0 : node.value);
//     } else {
//       // Skip the operation for output nodes
//       if (!node.id.startsWith("out")) {
//         // Perform the operation based on the node's operation
//         switch (node.id?.split("_")?.[0]) {
//           case "add":
//             nodeValues.set(
//               nodeId,
//               inputs.reduce((acc, curr) => acc + curr, 0)
//             );
//             break;
//           case "sub":
//             nodeValues.set(
//               nodeId,
//               inputs.reduce((acc, curr) => acc - curr)
//             );
//             break;
//           case "mul":
//             nodeValues.set(
//               nodeId,
//               inputs.reduce((acc, curr) => acc * curr, 1)
//             );
//             break;
//           case "div":
//             nodeValues.set(
//               nodeId,
//               inputs.reduce((acc, curr) => acc / curr)
//             );
//             break;
//           default:
//             throw new Error(`Invalid operation for node ${nodeId}`);
//         }
//       }
//     }
//   });
//   // Extract output values
//   const outputValues = {};
//   nodes
//     .filter((node) => node.id.startsWith("out"))
//     .forEach((outputNode) => {
//       const incomingEdges = edges.filter(
//         (edge) => edge.target === outputNode.id
//       );
//       let outputNodeValue = undefined; // Initialize output value
//       incomingEdges.forEach((edge) => {
//         const sourceNodeValue = nodeValues.get(edge.source);
//         if (sourceNodeValue !== undefined) {
//           outputNodeValue = (outputNodeValue || 0) + sourceNodeValue;
//         }
//       });
//       nodeValues.set(outputNode.id, outputNodeValue || undefined);
//       outputValues[outputNode.id] = outputNodeValue || undefined;
//     });

//   return outputValues;
// }
// Example usage
// const nodes = [
//   {
//     id: "add_1",
//   },
//   {
//     id: "out_1",
//   },
//   {
//     id: "out_2",
//   },
//   {
//     id: "in_1",
//     value: 4,
//   },
//   {
//     id: "out_1",
//   },
//   {
//     id: "in_2",
//     value: 8,
//   },
//   {
//     id: "mul_2",
//   },
// ];
// const edges = [
//   { source: "in_1", target: "add_1" },
//   { source: "in_2", target: "mul_2" },
//   { source: "in_2", target: "add_1" },
//   { source: "out_1", target: "mul_2" },
//   { source: "mul_2", target: "out_2" },
//   { source: "add_1", target: "out_1" },
// ];
const nodes = [
  {
    id: "in_1",
    value: 2,
  },
  {
    id: "out_1",
  },
];
const edges = [{ source: "in_1", target: "out_1" }];

// function getConnectedGraphs(nodes, edges) {
//   const visited = new Set(); // Set to track visited nodes
//   const connectedGraphs = []; // Array to store connected graphs

//   // Depth-first search (DFS) function to traverse connected nodes
//   function dfs(nodeId, graphNodes, graphEdges) {
//     visited.add(nodeId); // Mark the current node as visited
//     graphNodes.push(nodes.find((node) => node.id === nodeId)); // Add node to the current graph

//     // Find edges connected to the current node
//     const connectedEdges = edges.filter(
//       (edge) => edge.source === nodeId || edge.target === nodeId
//     );

//     // Iterate over connected edges
//     connectedEdges.forEach((edge) => {
//       // Check if the other end of the edge is not visited
//       const nextNodeId = edge.source === nodeId ? edge.target : edge.source;
//       if (!visited.has(nextNodeId)) {
//         graphEdges.push(edge); // Add edge to the current graph
//         dfs(nextNodeId, graphNodes, graphEdges); // Recursively traverse connected nodes
//       }
//     });
//   }

//   // Iterate over nodes to find connected subgraphs
//   nodes.forEach((node) => {
//     if (!visited.has(node.id)) {
//       const graphNodes = []; // Nodes in the current graph
//       const graphEdges = []; // Edges in the current graph
//       dfs(node.id, graphNodes, graphEdges); // Traverse connected nodes starting from the current node
//       connectedGraphs.push({ nodes: graphNodes, edges: graphEdges }); // Add the current graph to the list of connected graphs
//     }
//   });

//   return connectedGraphs;
// }
function getConnectedGraphs(nodes, edges) {
  const visited = new Set(); // Set to track visited nodes
  const connectedGraphs = []; // Array to store connected graphs

  // Depth-first search (DFS) function to traverse connected nodes
  function dfs(nodeId, graphNodes, graphEdges, exploredEdges) {
    visited.add(nodeId); // Mark the current node as visited
    graphNodes.push(nodes.find((node) => node.id === nodeId)); // Add node to the current graph

    // Find edges connected to the current node
    const connectedEdges = edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );

    // Iterate over connected edges
    connectedEdges.forEach((edge) => {
      // Check if the edge has not been explored yet
      if (!exploredEdges.has(JSON.stringify(edge))) {
        // Mark the edge as explored
        exploredEdges.add(JSON.stringify(edge));
        graphEdges.push(edge); // Add edge to the current graph

        // Check if the other end of the edge is not visited
        const nextNodeId = edge.source === nodeId ? edge.target : edge.source;
        if (!visited.has(nextNodeId)) {
          dfs(nextNodeId, graphNodes, graphEdges, exploredEdges); // Recursively traverse connected nodes
        }
      }
    });
  }

  // Iterate over nodes to find connected subgraphs
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      const graphNodes = []; // Nodes in the current graph
      const graphEdges = []; // Edges in the current graph
      const exploredEdges = new Set(); // Set to track explored edges
      dfs(node.id, graphNodes, graphEdges, exploredEdges); // Traverse connected nodes starting from the current node
      connectedGraphs.push({ nodes: graphNodes, edges: graphEdges }); // Add the current graph to the list of connected graphs
    }
  });

  return connectedGraphs;
}
// Function to find all paths from input nodes to output nodes
function findOutputNodePaths(nodes, edges) {
  const outputNodePathsMap = new Map();
  const outputOrderMap = new Map(); // Map to track the order of output node resolution

  // Helper function to perform depth-first search
  function dfs(nodeId, path) {
    path.push(nodeId); // Add current node to the path

    if (nodeId.startsWith("out")) {
      const outputNode = path[path.length - 1];
      if (!outputNodePathsMap.has(outputNode)) {
        outputNodePathsMap.set(outputNode, []);
      }
      outputNodePathsMap.get(outputNode).push(path.slice()); // Add the path to outputNodePathsMap under the outputNode key
    } else {
      // Find adjacent nodes
      const adjacentNodes = edges
        .filter((edge) => edge.source === nodeId)
        .map((edge) => edge.target);

      // Recursively explore adjacent nodes
      adjacentNodes.forEach((adjNode) => {
        dfs(adjNode, path.slice()); // Pass a copy of the current path to prevent mutation
      });
    }

    path.pop(); // Remove the current node from the path before backtracking
  }

  // Start DFS from each input node
  nodes
    .filter((node) => node.id.startsWith("in"))
    .forEach((inputNode) => {
      dfs(inputNode.id, []);
    });

  // Combine paths for each output node into a single array
  const outputNodePaths = Array.from(outputNodePathsMap.values()).flat();

  // Sort paths by the order of resolution of dependent output nodes
  outputNodePaths.sort((pathA, pathB) => {
    const lastNodeA = pathA[pathA.length - 1];
    const lastNodeB = pathB[pathB.length - 1];

    // Get the order of resolution for the last dependent output nodes
    const orderA = outputOrderMap.get(lastNodeA) || 0;
    const orderB = outputOrderMap.get(lastNodeB) || 0;

    // Compare the order of resolution
    return orderA - orderB;
  });

  // Update the order of resolution for output nodes
  let order = 1;
  outputNodePaths.forEach((path) => {
    const lastNode = path[path.length - 1];
    if (nodes.find((node) => node.id === lastNode).value === null) {
      outputOrderMap.set(lastNode, order++);
    }
  });
  const visited_paths = [];
  const grouped_paths = [];
  outputNodePaths?.map((path, i) => {
    const outputNode = path?.[path?.length - 1];
    if (visited_paths?.includes(outputNode)) return;
    let accumulated_path = path;
    outputNodePaths?.slice(i + 1)?.map((next_path) => {
      const outputNextNode = next_path?.[next_path?.length - 1];
      if (outputNextNode == outputNode) {
        let isDone = false;
        accumulated_path?.forEach((nodeId, i) => {
          const shared_node_index = next_path
            ?.slice(0, -1)
            .findIndex((sharedNodeId) => sharedNodeId == nodeId);
          if (shared_node_index != -1 && !isDone) {
            isDone = true;
            accumulated_path = [
              ...accumulated_path.slice(0, i),
              ...next_path.slice(0, shared_node_index),
              ...accumulated_path.slice(i, accumulated_path?.length),
            ];
          }
          //   accumulated_path.push(nodeId);
        });
      }
    });
    grouped_paths.push(accumulated_path);
    visited_paths?.push(outputNode);
  });
  return grouped_paths;
}

// Function to accumulate values along a path
function accumulatePathValues(nodes, path) {
  let result = undefined;
  let inputs = [];
  // Traverse the path in reverse order
  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];
    const node = nodes.find((n) => n.id === nodeId);
    if (node.value !== undefined) {
      // For input nodes, use their values directly
      inputs.push(node.value);
      if (i == path.length - 1 && inputs?.length) result = inputs?.[0];
    } else {
      // Perform the operation based on the node's id
      switch (node.id?.split("_")?.[0]) {
        case "add":
          result = (result || 0) + inputs.reduce((acc, curr) => acc + curr, 0);
          break;
        case "sub":
          result = (result || 0) + inputs.reduce((acc, curr) => acc - curr, 0);
          break;
        case "mul":
          result = (result || 1) * inputs.reduce((acc, curr) => acc * curr, 1);
          break;
        case "div":
          result = !result
            ? inputs.reduce((acc, curr) => acc / curr)
            : result / inputs.reduce((acc, curr) => acc / curr);
          break;
        default:
          return undefined;
      }
      inputs = [];
    }
  }

  return result;
}

// Function to evaluate the graph
function evaluateGraph(nodes, edges) {
  // Find all output node paths
  const outputNodePaths = findOutputNodePaths(nodes, edges);

  // Accumulate values along each output node path
  const outputValues = {};
  outputNodePaths.forEach((path, i) => {
    const outputNodeId = path[path.length - 1];
    outputValues[outputNodeId] = accumulatePathValues(nodes, path.slice(0, -1));
  });

  return outputValues;
}
function calculateOutputValues(nodes, edges) {
  // Initialize a map to store node values
  const nodeValues = {};

  // Build a map of node dependencies
  const dependencies = {};
  edges.forEach((edge) => {
    if (!dependencies[edge.target]) {
      dependencies[edge.target] = [];
    }
    dependencies[edge.target].push(edge.source);
  });
  // console.log("wa_chk_1", dependencies, edges);

  /*
    Topological sorting function
  used to order our nodes in from roots in proper way so nodes values can be resolved
    */
  function topologicalSort(node, visited, stack) {
    visited[node] = true;
    if (dependencies[node]) {
      dependencies[node].forEach((neighbor) => {
        if (!visited[neighbor]) {
          topologicalSort(neighbor, visited, stack);
        }
      });
    }
    stack.push(node);
  }

  // Perform topological sort
  const sortedNodes = [];
  const visited = {};
  for (let i = 0; i < nodes.length; i++) {
    if (!visited[nodes[i].id]) {
      topologicalSort(nodes[i].id, visited, sortedNodes);
    }
  }
  // Process nodes in sorted order to calculate values
  sortedNodes.forEach((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node.value !== undefined) {
      nodeValues[nodeId] = node.value; // Input node
    } else {
      const check_circle = [];
      const handleDependency = (deps, nodeId) => {
        if (check_circle.includes(nodeId)) return undefined;
        check_circle.push(nodeId);
        return deps[nodeId]
          ? deps[nodeId]
              ?.map((dep) => nodeValues[dep] || handleDependency(deps, dep))
              ?.flat()
          : [];
      };
      const dependenciesValues = handleDependency(dependencies, nodeId);
      // if (nodeId?.split("_")?.[0] == "div")
      //   console.log("wa_chk", dependenciesValues, dependencies[nodeId]);
      const operation = nodeId.split("_")[0]; // Extract operation type from node id
      switch (operation) {
        case "add":
          nodeValues[nodeId] =
            dependenciesValues?.length <= 1
              ? dependenciesValues?.[0]
              : dependenciesValues.reduce((acc, val) => acc + val, 0);
          break;
        case "mul":
          nodeValues[nodeId] =
            dependenciesValues?.length <= 1
              ? dependenciesValues?.[0]
              : dependenciesValues.reduce((acc, val) => acc * val, 1);
          break;
        case "sub":
          nodeValues[nodeId] =
            dependenciesValues?.length <= 1
              ? dependenciesValues?.[0]
              : dependenciesValues.reduce((acc, val) => acc - val);
          break;
        case "div":
          nodeValues[nodeId] =
            dependenciesValues?.length <= 1
              ? dependenciesValues?.[0]
              : dependenciesValues.reduce((acc, val) => acc / val);
          break;
        default:
          break;
      }
    }
  });

  // Return output node values
  const outputValues = {};
  Object.keys(dependencies).map((k) => {
    if (k?.split("_")?.[0] == "out") {
      outputValues[k] = nodeValues[dependencies[k]?.[0]] ?? undefined;
    }
  });
  return outputValues;
}

const evalGraph = (nodes, edges) => {
  let outputValues = {};
  const mainEdge = edges;
  getConnectedGraphs(nodes, edges)?.map(({ nodes, edges }) => {
    outputValues = {
      ...outputValues,
      ...calculateOutputValues(nodes, edges),
    };
  });
  return outputValues;
};
export default evalGraph;
