import { Vertex, TarjanRunner } from "./tarjan.js";
import {
  buildGraph,
  getVertexByName,
  runTarjanOnEdges,
  getPaths,
} from "./graphUtils.js";

/**
 * Given a string of code
 * returns an array of useEffect calls
 * @param {string} code
 * @returns {Array}
 */
const parseUseEffects = (code) => {
  code = code.replace(/\n|\r/g, "");
  let counter = code.length;
  const pattern = "useEffect(";
  let val = [];
  while (code.length > 0 && counter > 0) {
    counter -= 1;
    let ind = code.indexOf(pattern);
    if (ind < 0) {
      break;
    }
    let secondInd = pattern.length - 1; // start with the ( of useEffect(
    for (let i = ind + secondInd + 1; i <= code.length; i++) {
      if (isMatched(code.substring(ind + secondInd, i))) {
        val.push(code.substring(ind, i));
        code = code.substring(i);
        break;
      }
    }
  }
  return val;
};

/**
 * Given a snippet, checks if it's a matched string
 * e.g. (matched) and not (not matched
 * @param {string} snippet
 * @returns {boolean}
 */
const isMatched = (snippet) => {
  const matches = { "(": ")", "{": "}", "[": "]" };
  if (!Object.keys(matches).includes(snippet[0])) {
    throw "match-tested snippet must start with (, {, or [";
  }
  let stack = [snippet[0]];
  for (let i = 1; i < snippet.length; i++) {
    if (matches[stack[0]] === snippet[i]) {
      stack.shift();
    } else if (Object.keys(matches).includes(snippet[i])) {
      stack.unshift(snippet[i]);
    }
  }

  return stack.length === 0;
};

/**
 * given a string representing a function call
 * returns array of strings that are the args
 * This function assumes everything before the first ( is the function name
 * and that the last ) is the end of the function params
 * @param {string} functionCall
 * @return {Array}
 */
const functionToArgs = (functionCall) => {
  const firstOpenParenthesisIndex = functionCall.indexOf("(");
  const lastCloseParenthesisIndex = functionCall.lastIndexOf(")");
  functionCall = functionCall.substring(
    firstOpenParenthesisIndex + 1,
    lastCloseParenthesisIndex
  );
  // find `,` not inside matched substrings
  // a minimally-matched substring would be () or (()=>{})
  // but not ()=>{} or []{}()
  // I want to catch the first comma in `hey, [a,b]` but not the second
  let indicesOfMinimallyMatchedSubstrings = [];
  for (let i = 0; i < functionCall.length; i++) {
    for (let j = i + 1; j <= functionCall.length; j++) {
      const sub = functionCall.substring(i, j);
      if (["(", "[", "{"].includes(sub[0])) {
        if (isMatched(sub)) {
          indicesOfMinimallyMatchedSubstrings.push([i, j]);
          break;
        }
      }
    }
  }
  var regex = /,/gi,
    result,
    indicesOfCommas = [];
  while ((result = regex.exec(functionCall))) {
    indicesOfCommas.push(result.index);
  }
  indicesOfCommas = indicesOfCommas.filter((comma) =>
    indicesOfMinimallyMatchedSubstrings.every(
      (range) => !(comma >= range[0] && comma < range[1])
    )
  );

  // split functionCall into array of substrings split by the `,`s
  indicesOfCommas.push(functionCall.length);
  indicesOfCommas.unshift(-1);
  const val = indicesOfCommas
    .slice(0, indicesOfCommas.length - 1)
    .map((commaIndex, arrayIndex) =>
      functionCall.slice(commaIndex + 1, indicesOfCommas[arrayIndex + 1]).trim()
    );
  return val;
};

/**
 * given array of strings, which is args of a functioncall
 * e.g. output of functionToArgs,
 * checks if the second argument is an array and
 * returns an array of strings which are the
 * variable names in the array
 * (use case is parsing dependency array from call to useEffect)
 * @param {Array} argsArray
 * @return {Array}
 */
const getVarsFromSecondArgOfFunction = (argsArray) => {
  if (argsArray.length > 2) {
    throw (
      "Argument array must have length 2 but has length " + argsArray.length
    );
  }
  let second = argsArray[1].trim();
  if (second[0] !== "[" || second[second.length - 1] !== "]") {
    throw "Second argument doesn't appear to be an array";
  }
  return second
    .slice(1, second.length - 1)
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
};

/**
 * given some code
 * e.g. a React component
 * identify state variables and their setters
 * @param {string} code
 * @return {Array}
 */
const identifyStateVariablesAndSetters = (code) => {
  const relevantLines = code
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x.includes("useState"))
    .map((x) => x.split("useState")[0]);
  const indicesOfBrackets = relevantLines.map((x) => [
    x.indexOf("["),
    x.indexOf("]"),
  ]);
  const useStateArray = relevantLines
    .map((x, ind) =>
      x.substring(indicesOfBrackets[ind][0], indicesOfBrackets[ind][1] + 1)
    )
    .map((x) => x.replace(/\[|\]|\ /g, ""))
    .map((x) => x.split(","))
    .map((x) => ({ variable: x[0], setter: x[1] }));
  return useStateArray;
};

/**
 * given some code
 * e.g. a React component
 * identify state variables that change and trigger
 * other setters in useEffects
 * @param {string} code
 * @return {Array}
 */
const mapUseEffectTriggers = (code) => {
  const filterArrayIfStringContainsElements = (array, string) =>
    array.filter((x) => string.includes(x));
  const useStateArray = identifyStateVariablesAndSetters(code);
  const setterToVariable = (setter) =>
    useStateArray.filter((x) => x.setter === setter)[0]["variable"];
  const useEffectsArgs = parseUseEffects(code)
    .map((ueCall) => functionToArgs(ueCall))
    .map((args) => [
      filterArrayIfStringContainsElements(
        useStateArray.map((z) => z.setter),
        args[0]
      ),
      getVarsFromSecondArgOfFunction(args),
    ]);
  const pairsVarsSetWhenVarChanges = useEffectsArgs.map((x) => [
    x[0].map((z) => setterToVariable(z)),
    x[1],
  ]);
  const varChangeVarSet = pairsVarsSetWhenVarChanges.map((pair) =>
    pair[1].map((second) =>
      pair[0].map((first) => ({ source: second, target: first }))
    )
  );
  return varChangeVarSet.flat(2);
};

export {
  parseUseEffects,
  isMatched,
  functionToArgs,
  mapUseEffectTriggers,
  getVarsFromSecondArgOfFunction,
  identifyStateVariablesAndSetters,
};
