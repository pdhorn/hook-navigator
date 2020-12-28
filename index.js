#!/usr/bin/env node

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const yargs = require("yargs");
// const controller = require("./lib/controller");
import { analyze } from "./lib/controller.js";

const argv = yargs
  .option("files", {
    alias: "f",
    description: "pass filenames",
    type: "array",
  })
  .help()
  .alias("help", "h").argv;

clear();

console.log(
  chalk.yellow(figlet.textSync("Hook-navigator", { horizontalLayout: "full" }))
);

argv.files.forEach((filePath) => {
  analyze(filePath);
});
