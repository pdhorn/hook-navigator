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
  let ones = [];
  let multis = [];
  let thePaths = {};
  Object.keys(chainObject).forEach((key) => {
    thePaths[key] = {};
    let subobject = chainObject[key];
    let counts = subobject.countPathsTo;
    let paths = subobject.pathsTo;
    Object.keys(counts).forEach((subkey) => {
      if (counts[subkey] === 1) {
        ones.push([key, subkey]);
        thePaths[key][subkey] = paths[subkey];
      } else if (counts[subkey] > 1) {
        multis.push([key, subkey]);
        thePaths[key][subkey] = paths[subkey];
      }
    });
  });

  if (ones.length + multis.length === 0) {
    console.log("No state variables detected.");
  }

  if (ones.length > 0) {
    console.log(
      chalk.green(
        "These state variable trigger ONE setter for these state variables:"
      )
    );
    ones.forEach((pair) => {
      console.log(
        "\t- Setting",
        chalk.yellow.underline(pair[0]),
        "triggers setting",
        chalk.magenta.underline(pair[1]),
        "via the chain",
        thePaths[pair[0]][pair[1]][0]
      );
    });
    console.log(chalk.green("\nGood job :)\n\n"));
  }
  if (multis.length > 0) {
    console.log(
      chalk.red(
        "These state variable trigger MULTIPLE setters for these state variables:"
      )
    );
    multis.forEach((pair) => {
      console.log(
        "\t- Setting",
        chalk.yellow.underline(pair[0]),
        "triggers setting",
        chalk.magenta.underline(pair[1]),
        "via the chains:"
      );
      thePaths[pair[0]][pair[1]].forEach((path) => {
        console.log("\t\t- ", path);
      });
    });
    console.log(chalk.red("\nPlease address these."));
  }
};

export { analyze };
