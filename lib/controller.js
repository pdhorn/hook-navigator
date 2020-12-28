import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { getCallChains } from "./funcs.js";

const fs = require("fs");
const chalk = require("chalk");

const analyze = (filePath) => {
  console.log(chalk.blue.underline.bold("\n\nAnalyzing ", filePath, ":\n\n"));
  const code = fs.readFileSync(filePath, "utf8");
  const allChains = getCallChains(code);
  prettyPrintResults(allChains);
};

const prettyPrintResults = (chainObject) => {
  let ones = {};
  let multis = {};
  let thePaths = {};
  Object.keys(chainObject).forEach((key) => {
    thePaths[key] = {};
    let subobject = chainObject[key];
    let counts = subobject.countPathsTo;
    let paths = subobject.pathsTo;
    Object.keys(counts).forEach((subkey) => {
      if (counts[subkey] === 1) {
        ones[key] = (ones[key] || []) + [subkey];
        thePaths[key][subkey] = paths[subkey];
      } else if (counts[subkey] > 1) {
        multis[key] = (multis[key] || []) + [subkey];
        thePaths[key][subkey] = paths[subkey];
      }
    });
  });

  if (Object.keys(ones).length > 1) {
    console.log(
      chalk.green(
        "These state variable trigger ONE setter for these state variables:"
      )
    );
    Object.keys(ones).forEach((key) => {
      console.log(
        "\t- Setting",
        chalk.yellow.underline(key),
        "triggers setting",
        chalk.magenta.underline(ones[key]),
        "via the chain",
        thePaths[key][ones[key]][0]
      );
    });
    console.log(chalk.green("\nGood job :)\n\n"));
  }
  if (Object.keys(multis).length > 0) {
    console.log(
      chalk.red(
        "These state variable trigger MULTIPLE setters for these state variables:"
      )
    );
    Object.keys(multis).forEach((key) => {
      console.log(
        "\t- Setting",
        chalk.yellow.underline(key),
        "triggers setting",
        chalk.magenta.underline(multis[key]),
        "via the chains:"
      );
      thePaths[key][multis[key]].forEach((path) => {
        console.log("\t\t- ", path);
      });
    });
    console.log(chalk.red("\nPlease address these."));
  }
};

export { analyze };
