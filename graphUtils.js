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
  edgeArray.map((edge) => {
    getVertexByName(edge.source, graph).children.push(
      getVertexByName(edge.target, graph)
    );
    return true;
  });
  var tr = new TarjanRunner();
  tr.execute(graph);
  const isAcyclic = tr.isAcyclic;
  const cycles = tr.cycles;
  return tr;
};

/**
 * given an origin and destination vertex (and the edge array)
 * returns all paths from origin to destination
 * @param {string} origin (vertex)
 * @param {string} destination (vertex)
 * @param {Array} edgeArray
 * @return {TarjanRunner}
 */
const getPaths = (origin, destination, edgeArray) => {
  // look at https://www.geeksforgeeks.org/count-possible-paths-two-vertices/
  return [];
};

export { buildGraph, getVertexByName, runTarjanOnEdges, getPaths };

console.log(
  runTarjanOnEdges([
    { source: "a", target: "b" },
    { source: "a", target: "c" },
    { source: "b", target: "c" },
  ])
);
