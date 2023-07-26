const inquirer = require("inquirer");
const mysql = require("mysql2")
const connection = require('./config/connection');


function init() {
  inquirer.prompt({
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a new Role",
      "Add a new employee",
      "Add a manager",
      "Update an employee's role",
      "View Employeeds by Manager",
      "View Employees by department",
      "Remove Departments | Roles | Employees",
      "View the total utilized budget of a department",
      "Quit"
    ]
}) 
.then((res) => {
  switch (res.choice) {
    case "View all departments":
      viewDepartments();
      break;
    case "View all roles":
      viewRoles();
      break;
    case "View all employees":
      viewEmployees();
      break;
    case "Add a department":
      AddDepartment();
      break;
    case "Add a new Role":
      AddRole();
      break;
    case "Add a new employee":
      AddEmployee();
      break;
    case "Add a manager":
      addManager();
      break;
    case "Update an employee's role":
      updateEmployeeRole();
      break;
    case "View Employeeds by Manager":
      viewEmployeesManager();
      break;
    case "View Employees by department":
      viewEmployeesDepartment();
      break;
    case "Remove Departments | Roles | Employees":
      RemoveData();
      break;
    case "View the total utilized budget of a department":
      viewDepartmentBudget();
      break;
    case "Quit":
      connection.end();
      console.log("Goodbye");
      break;
  }
})
};

init();