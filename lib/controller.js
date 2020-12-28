import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { getCallChains } from "./funcs.js";

const fs = require("fs");

const analyze = (filePath) => {
  const code = fs.readFileSync(filePath, "utf8");
  return getCallChains(code);
};

export { analyze };
