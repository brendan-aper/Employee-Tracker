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
      addDepartment();
      break;
    case "Add a new Role":
      addRole();
      break;
    case "Add a new employee":
      addEmployee();
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

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Enter the name of the new department:",
    })
    .then((answer) => {
      console.log(answer.name);
      const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
      connection.query(query, (err, res) => {
        if(err) throw err;
        console.log(`Added department ${answer.name} to the database!`);
        init()
      })
    })
};
function addRole() {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
      if (err) throw err;
      inquirer
          .prompt([
              {
                type: "input",
                name: "title",
                message: "Enter the title of the new role:",
              },
              {
                type: "input",
                name: "salary",
                message: "Enter the salary of the new role:",
              },
              {
                type: "list",
                name: "department",
                message: "Select the department for the new role:",
                choices: res.map(
                  (department) => department.department_name
                ),
              },
          ])
          .then((answers) => {
              const department = res.find(
                (department) => department.name === answers.department
              );
              const query = "INSERT INTO roles SET ?";
              connection.query(
                query,
                  {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: department,
                  },
                  (err, res) => {
                    if (err) throw err;
                    console.log(
                      `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
                    );
                      // restart the application
                    init();
                  }
              );
          });
  });
}

function addEmployee() {
  connection.query("SELECT id, title FROM roles", (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    const roles = results.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
      connection.query(
        'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
        (error, results) => {
          if (error) {
            console.error(error);
            return;
          }
          const managers = results.map(({ id, name }) => ({
            name,
            value: id,
          }));
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "firstName",
                  message: "Enter the employee's first name:",
                },
                {
                  type: "input",
                  name: "lastName",
                  message: "Enter the employee's last name:",
                },
                {
                  type: "list",
                  name: "roleId",
                  message: "Select the employee role:",
                  choices: roles,
                },
                {
                  type: "list",
                  name: "managerId",
                  message: "Select the employee manager:",
                  choices: [
                    { name: "None", value: null },
                    ...managers,
                  ],
                },
              ])
              .then((answers) => {
                const sql =
                  "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    const values = [
                      answers.firstName,
                      answers.lastName,
                      answers.roleId,
                      answers.managerId,
                    ];
                    connection.query(sql, values, (error) => {
                      if (error) {
                        console.error(error);
                        return;
                      }
                      console.log("Employee added successfully");
                      init();
                    });
              })
              .catch((error) => {
                console.error(error);
              });
        }
      );
  });
};

function addManager() {
  const queryDepartments = "SELECT * FROM departments";
  const queryEmployees = "SELECT * FROM employee";

  connection.query(queryDepartments, (err, resDepartments) => {
    if (err) throw err;
    connection.query(queryEmployees, (err, resEmployees) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "list",
            name: "department",
            message: "Select the department:",
            choices: resDepartments.map(
              (department) => department.department_name
            ),
          },
          {
            type: "list",
            name: "employee",
            message: "Select the employee to add a manager to:",
            choices: resEmployees.map(
              (employee) => 
                `${employee.first_name} ${employee.last_name}`
            ),
          },
          {
            type: "list",
            name: "manager",
            message: "Select the employee's manager:",
            choices: resEmployees.map(
              (employee) => 
                `${employee.first_name} ${employee.last_name}`
            ),
          },
        ])
        .then((answers) => {
          const department = resDepartments.find(
            (department) =>
              department.department_name === answers.department
          );
          const employee = resEmployees.find(
            (employee) =>
              `${employee.first_name} ${employee.last_name}` === answers.employee
          );
          const manager = resEmployees.find(
            (employee) =>
              `${employee.first_name} ${employee.last_name}` === answers.manager
          );
          const query = "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)";
            connection.query(
              query,
              [manager.id, employee.id, department.id],
              (err, res) => {
                if (err) throw err;
                  console.log(`Added manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.department_name}!`);
                  init();
              }
            );
        });
      });
  });
}



init();