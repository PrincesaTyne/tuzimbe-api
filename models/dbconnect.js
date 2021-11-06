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
      role VARCHAR(20) NOT NULL,
      createdOn TIMESTAMP NOT NULL
    )`

    await pool.query(contractorsTable)
  } catch(err){
    console.error(err)
  }
}
createTables()

module.exports = pool
