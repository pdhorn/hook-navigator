import { Vertex, TarjanRunner } from "./tarjan.js";

/**
 * given an array of edges
 * returns all vertices in those edges
 * @param {Array} edgeArray
 * @return {Array}
 */
const getVerticesFromEdgeArray = (edgeArray) => [
  ...new Set(edgeArray.map((x) => [x.source, x.target]).flat()),
];

/**
 * given an array of vertex names
 * returns the list of Vertex es with those names
 * @param {Array} edgeArray
 * @return {Array}
 */
const buildGraph = (vertexNames) => vertexNames.map((v) => new Vertex(v));

/**
 * given a list of Vertexes and an edge array
 * returns populates the Vertexes' children
 * @param {Array} graph (of vertexes)
 * * @param {Array} edgeArray
 * @return
 */
const populateChildren = (graph, edgeArray) => {
  edgeArray.map((edge) => {
    getVertexByName(edge.source, graph).children.push(
      getVertexByName(edge.target, graph)
    );
    return true;
  });
};

/**
 * given a name (of a vertex) and a list of Vertex es
 * returns the vertex with that name
 * @param {String} name (of a vertex)
 * @param {Array} vertices (of Vertex es)
 * @return {Array}
 */
const getVertexByName = (name, vertexes) =>
  vertexes.filter((v) => v.name === name)[0];

/**
 * given the edges of state variable setter dependencies
 * e.g. output of mapUseEffectTriggers
 * returns the TarjanRunner
 * @param {Array} edgeArray
 * @return {TarjanRunner}
 */
const runTarjanOnEdges = (edgeArray) => {
  const vertexNames = getVerticesFromEdgeArray(edgeArray);
  let graph = buildGraph(vertexNames);
  populateChildren(graph, edgeArray);
  var tr = new TarjanRunner();
  tr.execute(graph);
  const isAcyclic = tr.isAcyclic;
  const cycles = tr.cycles;
  return tr;
};

/**
 * given an origin and destination vertex (and the edge array)
 * returns all paths from origin to destination
 * @param {string} origin (vertex name)
 * @param {string} destination (vertex name)
 * @param {Array} edgeArray
 * @return {Array}
 */
const getPaths = (origin, destination, edgeArray) => {
  // look at https://www.geeksforgeeks.org/count-possible-paths-two-vertices/
  const tr = runTarjanOnEdges(edgeArray);
  if (!tr.isAcyclic) {
    throw "This graph is cyclic with cycle " + tr.cycles[0];
  }
  let vertexNames = getVerticesFromEdgeArray(edgeArray);
  let graph = buildGraph(vertexNames);
  graph = graph.map((v) => {
    v["visited"] = false;
    return v;
  });
  populateChildren(graph, edgeArray);

  var depthCounter = 0;

  const getPathsHelper = (u, d, paths) => {
    depthCounter += 1;
    // console.log("depth", depthCounter);
    // console.log("u", u.name);
    // console.log("paths", paths);
    u.visited = true;
    if (u.name !== d.name) {
      //   console.log("got here");
      paths = paths
        .map((p) => {
          //   console.log(p);
          //   console.log("last name", p[p.length - 1]);
          //   console.log("u name", u.name);
          if (p[p.length - 1] === u.name) {
            console.log("end check");
            return (
              u.children
                //   .filter((c) => !c.visited)
                .map((c) => {
                  let x = [...p];
                  x.push(c.name);
                  return x;
                })
            );
          } else {
            return [[...p]];
          }
        })
        .flat();
      //   console.log("paths", paths);
      u.children.forEach((child) => {
        if (!child.visited) {
          //   console.log("calling");
          paths = getPathsHelper(child, d, paths);
        }
      });
    }
    u.visited = false;
    return paths;
  };

  const getPathsHelperFilter = (u, d) =>
    getPathsHelper(u, d, [[u.name]]).filter((p) => p[p.length - 1] === d.name);

  return getPathsHelperFilter(
    getVertexByName(origin, graph),
    getVertexByName(destination, graph)
  );
};

export { buildGraph, getVertexByName, runTarjanOnEdges, getPaths };

// console.log(
//   runTarjanOnEdges([
//     { source: "a", target: "b" },
//     { source: "a", target: "c" },
//     { source: "b", target: "c" },
//   ])
// );

// const moreComplexGraph = [
//   { source: "a", target: "b" },
//   { source: "a", target: "c" },
//   { source: "a", target: "e" },
//   { source: "b", target: "d" },
//   { source: "b", target: "e" },
//   { source: "c", target: "e" },
//   { source: "d", target: "c" },
// ];

// const moreComplexPathsAToE = [
//   ["a", "b", "e"],
//   ["a", "e"],
//   ["a", "c"],
//   ["a", "b", "d", "c", "e"],
// ];
// const moreComplexPathsAToC = [
//   ["a", "c"],
//   ["a", "b", "d", "c"],
// ];

// console.log(getPaths("a", "e", moreComplexGraph));

// console.log(
//   getPaths("b", "c", [
//     { source: "a", target: "b" },
//     { source: "a", target: "c" },
//     { source: "b", target: "c" },
//   ])
// );
