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

function viewDepartments() {
 const query = "SELECT * FROM departments";
 connection.query(query, (err, res) => {
  if (err) throw err;
  console.table(res);
  init();
 })
}

function viewRoles() {
  const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  })
}

function viewEmployees() {
  const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
  FROM employee e
  LEFT JOIN roles r ON e.role_id = r.id
  LEFT JOIN departments d ON r.department_id = d.id
  LEFT JOIN employee m ON e.manager_id = m.id;
  `;
  connection.query(query, (err, res) => {
    if(err) throw err;
    console.table(res);
    init()
  })
};

init();