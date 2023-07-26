USE employee_db;

INSERT INTO department (name)
VALUES ('Sales'),
       ('Accounting'),
       ('Customer Service'),
       ('Administration');

INSERT INTO role (title, salary, department_id)
VALUES ('Senior Sales Exec', 100000, 1),
       ('Junior Sales Exec', 60000, 1),
       ('Accounting Director', 80000, 2),
       ('Accountant', 55000, 2),
       ('Customer Service Rep', 50000, 3),
       ('Office Administrator', 5000, 4),
       ('Receptionist', 45000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Dwight', 'Schrute', 1, NULL),
       ('Andy', 'Bernard', 2, 1),
       ('Angela', 'Martin', 3, NULL),
       ('Kevin', 'Malone', 4, 3),
       ('Kelly', 'Kapoor', 5, NULL),
       ('Pam', 'Beasely', 6, NULL),
       ('Erin','Hannon', 7, 6);