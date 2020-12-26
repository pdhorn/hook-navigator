// Full credit to HopefulLlama
// https://gist.github.com/HopefulLlama/dacf9f5b26ddfebbac6e
// for implementing Tarjan's algorithm
// I modified it to get some of the data out of it.

function Vertex(name) {
  this.name = name;
  this.index = null;
  this.lowlink = null;
  this.onStack = false;

  this.children = [];
}

function TarjanRunner() {
  var _this = this;
  this.indexCounter = 0;
  this.stack = [];
  this.stronglyConnectedComponents = [];
  this.isAcyclic = false;
  this.cycles = [];

  this.execute = function (vertices) {
    for (var vertex of vertices) {
      if (vertex.index === null) {
        _this.strongConnect(vertex);
      }
    }
    this.isAcyclic =
      this.stronglyConnectedComponents.filter((scc) => scc.length > 1)
        .length === 0;
    this.cycles = this.stronglyConnectedComponents.filter(
      (scc) => scc.length > 1
    );
  };

  this.strongConnect = function (vertex) {
    vertex.index = _this.indexCounter;
    vertex.lowlink = _this.indexCounter;
    _this.indexCounter++;

    _this.stack.push(vertex);
    vertex.onStack = true;

    for (var child of vertex.children) {
      if (child.index === null) {
        _this.strongConnect(child);
        vertex.lowlink = Math.min(vertex.lowlink, child.lowlink);
      } else if (child.onStack) {
        vertex.lowlink = Math.min(vertex.lowlink, child.lowlink);
      }
    }

    if (vertex.lowlink === vertex.index) {
      var stronglyConnectedComponents = [];
      var w = null;
      while (vertex != w) {
        w = _this.stack.pop();
        w.onStack = false;
        stronglyConnectedComponents.push(w);
      }

      this.stronglyConnectedComponents.push(stronglyConnectedComponents);
    }
  };
}

var v1 = new Vertex("v1");
var v2 = new Vertex("v2");
var v3 = new Vertex("v3");
var v4 = new Vertex("v4");
var v5 = new Vertex("v5");
var v6 = new Vertex("v6");
var v7 = new Vertex("v7");

v7.children.push(v6);
v7.children.push(v5);

v6.children.push(v4);
v6.children.push(v3);

v5.children.push(v2);
v5.children.push(v1);

/** Above graph visualized:
 *
 * v1  \
 *       > v5  \
 * v2  /        \
 *   	          > v7
 * v3 \	        /
 *      > v6  /
 * v4 /
 *
 */

/** Test loops
 *	v1.children.push(v7);
 *	v5.children.push(v7);
 */

//  var graph = [v7, v6, v5, v4, v3, v2, v1];

// var tr = new TarjanRunner();
// tr.execute(graph);

export { Vertex, TarjanRunner };
