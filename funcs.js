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

export { parseUseEffects, isMatched };
