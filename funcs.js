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

// next thing: after functionToArgs, get all state variables in the second argument
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
const getVarsFromSecondArgOfFunction = (argsArray) => {};

export {
  parseUseEffects,
  isMatched,
  functionToArgs,
  getVarsFromSecondArgOfFunction,
};
