const inquirer = require("inquirer");

const questions = [
  {
    type: "list",
    message: "What do you want to do?",
    name: "entryPrompt",
    choices: ["Employee name", "Employee id", "Department"]
  }
];

function init() {
  return inquirer.prompt(questions)
};

init();