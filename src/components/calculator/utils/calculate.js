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
      const reorderedGraphEdges = [];
      edges.forEach((edge) => {
        const { source, target } = edge || {};
        const isExit = graphEdges?.some(
          ({ source: sourceGraph, target: targetGraph }) =>
            sourceGraph == source && targetGraph == target
        );
        if (isExit) reorderedGraphEdges.push(edge);
      });
      connectedGraphs.push({ nodes: graphNodes, edges: reorderedGraphEdges }); // Add the current graph to the list of connected graphs
    }
  });

  return connectedGraphs;
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
    if (node.value != undefined && nodeId?.split("_")?.[0] == "in") {
      nodeValues[nodeId] = node.value; // Input node
    } else {
      const check_circle = [];
      const handleDependency = (deps, nodeId) => {
        if (check_circle.includes(nodeId)) return undefined;
        check_circle.push(nodeId);
        return deps[nodeId]
          ? deps[nodeId]
              ?.map(
                (dep) => nodeValues[dep]
                // || handleDependency(deps, dep)
              )
              ?.flat()
              ?.filter((val) => val != undefined)
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
          nodeValues[nodeId] = dependenciesValues?.[0] ?? undefined;
          break;
      }
    }
  });

  // Return output node values
  const outputValues = {};
  sortedNodes?.map((nodeId) => {
    if (nodeId?.split("_")?.[0] == "out")
      outputValues[nodeId] = nodeValues[nodeId];
  });
  return outputValues;
}

const evalGraph = (nodes, edges) => {
  let outputValues = {};
  getConnectedGraphs(nodes, edges)?.map(({ nodes, edges }) => {
    outputValues = {
      ...outputValues,
      ...calculateOutputValues(nodes, edges),
    };
  });
  return outputValues;
};
export default evalGraph;
