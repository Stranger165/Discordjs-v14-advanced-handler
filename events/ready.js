const chalk = require("chalk");
const client = require("../index");

client.on("ready", () => {
  console.log(
    chalk.cyan("[ INFORMATION ]") +
    chalk.white.bold(" | ") +
    chalk.blue(`${new Date().toLocaleDateString()}`) +
    chalk.white.bold(" | ") +
    chalk.cyan("Logged in as") +
    chalk.white(": ") +
    chalk.greenBright(`${client.user.tag}`)
  )
});