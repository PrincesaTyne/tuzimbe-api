require('dotenv').config()
const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

const createTables = async() =>{
  try{
    const contractorsTable = `CREATE TABLE IF NOT EXISTS contractors (
      contractorId serial PRIMARY KEY,
      firstName VARCHAR (50) NOT NULL,
      lastName VARCHAR (50),
      email VARCHAR (50) UNIQUE NOT NULL,
      age INT,
      gender VARCHAR(250),
      createdOn TIMESTAMP NOT NULL,
      roleId INT NOT NULL,
      FOREIGN KEY (roleId) REFERENCES roles(roleId) ON DELETE CASCADE
    )`
    
    const materialsTable = `CREATE TABLE IF NOT EXISTS materials (
      materialId serial PRIMARY KEY,
      materialName VARCHAR (50) UNIQUE NOT NULL,
      quantity INT,
      price INT,
      measurement VARCHAR (30),
      createdOn TIMESTAMP NOT NULL,
      updatedOn TIMESTAMP NOT NULL
    )`

    const rolesTable = `CREATE TABLE IF NOT EXISTS roles (
      roleId serial PRIMARY KEY,
      role VARCHAR (50) UNIQUE NOT NULL,
      payRate INT NOT NULL,
      createdOn TIMESTAMP NOT NULL
    )`

    const attendanceTable = `CREATE TABLE IF NOT EXISTS attendances (
      attendanceId serial PRIMARY KEY,
      arrivalTime TIMESTAMP NOT NULL,
      departureTime TIMESTAMP,
      contractorId INT NOT NULL,
      CONSTRAINT fk_contractor FOREIGN KEY (contractorId)REFERENCES contractors(contractorId) ON DELETE CASCADE
    )`

    const checkoutsTable = `CREATE TABLE IF NOT EXISTS checkouts (
      checkoutId serial PRIMARY KEY,
      materialId INT NOT NULL,
      quantity INT NOT NULL,
      contractorId INT,
      createdOn TIMESTAMP NOT NULL,
      CONSTRAINT fk_material FOREIGN KEY (materialId) REFERENCES materials(materialId) ON DELETE CASCADE,
      CONSTRAINT fk_contractor FOREIGN KEY (contractorId) REFERENCES contractors(contractorId) ON DELETE SET NULL
    )`
    
    await pool.query(rolesTable)
    await pool.query(contractorsTable)
    await pool.query(materialsTable)
    await pool.query(attendanceTable)
    await pool.query(checkoutsTable)

  } catch(err){
    console.error(err)
  }
}
createTables()

module.exports = pool
