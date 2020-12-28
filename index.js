#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

clear();

console.log(
  chalk.yellow(figlet.textSync("Hook-navigator", { horizontalLayout: "full" }))
);
