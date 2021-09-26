const mysql = require("mysql2")
const inquirer = require("inquirer")
const util = require("util")

require("dotenv").config()
const db = mysql.createConnection({
  host: "localhost",
  // Your MySQL username,
  user: "root",
  // Your MySQL password
  password: process.env.DB_PW,
  database: "employee_tracker",
})

db.query = util.promisify(db.query)

const rerun = () => {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "usersChoice",
        message: "Select from the choices below",
        choices: [
          "View all Employees",
          "View all Roles",
          "View all Departments",
          "Add an Employee",
          "Add a Role",
          "Add a Department",
          "Update an Employee's Role",
          "Exit",
        ],
      },
    ])
    .then(({ usersChoice }) => {
      console.log(usersChoice)

      if (usersChoice === "Add an Employee") {
        addAnEmployee()
      } else if (usersChoice === "View all Employees") {
        viewAllEmployees()
      } else if (usersChoice === "View all Roles") {
        viewAllRoles()
      } else if (usersChoice === "View all Departments") {
        viewAllDepartments()
      } else if (usersChoice === "Add a Role") {
        addARole()
      } else if (usersChoice === "Add a Department") {
        addADepartment()
      } else if (usersChoice === "Update an Employee's Role") {
        updateRole()
      } else {
        db.end()
      }
    })
}

//view all employees
const viewAllEmployees = async () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, title, salary, name AS department_name, manager.first_name AS manager_firstname, manager.last_name AS manager_lastname FROM employee 
  LEFT JOIN role ON role.id = employee.role_id
  LEFT JOIN department ON department.id = role.department_id
  LEFT JOIN employee manager ON manager.id = employee.manager_id;`

  db.query(sql, (err, rows) => {
    if (err) throw err

    console.table(rows)
    rerun()
  })
}

//view all roles
const viewAllRoles = async () => {
  const sql = `SELECT role.id, title, salary, name AS department_name FROM role
  LEFT JOIN department ON department.id = role.department_id;`

  db.query(sql, (err, rows) => {
    if (err) throw err

    console.table(rows)
    rerun()
  })
}

//view all departments
const viewAllDepartments = async () => {
  const sql = `SELECT * from department;`

  db.query(sql, (err, rows) => {
    if (err) throw err

    console.table(rows)
    rerun()
  })
}

// Add an Employee
const addAnEmployee = async () => {
  const roleSQL = `SELECT id, title from role;`
  const roleRows = await db.query(roleSQL)
  const roles = []
  for (let i = 0; i < roleRows.length; i++) {
    roles.push({
      value: roleRows[i].id,
      name: roleRows[i].title,
    })
  }

  const employeeSQL = ` SELECT id, first_name, last_name FROM employee WHERE manager_id is null;`
  const managerRows = await db.query(employeeSQL)
  const managers = []
  for (let i = 0; i < managerRows.length; i++) {
    managers.push({
      value: managerRows[i].id,
      name: managerRows[i].first_name + " " + managerRows[i].last_name,
    })
  }

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "enter first_name of employee",
    },
    {
      type: "input",
      name: "last_name",
      message: "enter last_name of employee",
    },
    {
      type: "list",
      name: "role_id",
      message: "select role of employee",
      choices: roles,
    },
    {
      type: "list",
      name: "manager_id",
      message: "select manager of employee",
      choices: managers,
    },
  ])
  const insertSQL = `INSERT INTO employee SET ?`

  await db.query(insertSQL, answers)
  rerun()
}

//"Add a Role",
const addARole = async () => {
  const departmentSQL = `SELECT id, name from department;`
  const departmentRows = await db.query(departmentSQL)
  const departments = []
  for (let i = 0; i < departmentRows.length; i++) {
    departments.push({
      value: departmentRows[i].id,
      name: departmentRows[i].name,
    })
  }

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "enter name of role",
    },
    {
      type: "input",
      name: "salary",
      message: "enter role salary",
    },
    {
      type: "list",
      name: "department_id",
      message: "select department of role",
      choices: departments,
    },
  ])
  const insertSQL = `INSERT INTO role SET ?`

  await db.query(insertSQL, answers)
  rerun()
}
//"Add a Department",
const addADepartment = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "enter name of department",
    },
  ])
  const insertSQL = `INSERT INTO department SET ?`

  await db.query(insertSQL, answers)
  rerun()
}
//"Update an Employee's Role",
const updateRole = async () => {
  const roleSQL = `SELECT id, title from role;`
  const roleRows = await db.query(roleSQL)
  const roles = []
  for (let i = 0; i < roleRows.length; i++) {
    roles.push({
      value: roleRows[i].id,
      name: roleRows[i].title,
    })
  }

  const employeeSQL = ` SELECT id, first_name, last_name FROM employee;`
  const employeeRows = await db.query(employeeSQL)
  const employees = []
  for (let i = 0; i < employeeRows.length; i++) {
    employees.push({
      value: employeeRows[i].id,
      name: employeeRows[i].first_name + " " + employeeRows[i].last_name,
    })
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "employee_id",
      message: "select employee you want update",
      choices: employees,
    },
    {
      type: "list",
      name: "role",
      message: "select role you would like to update to",
      choices: roles,
    },
  ])
  const updateSQL = `UPDATE employee SET role_id = ? WHERE id = ?;`
  await db.query(updateSQL, [answers.role, answers.employee_id])
  rerun()
}

rerun()
