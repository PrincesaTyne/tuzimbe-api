const pool = require('../models/dbconnect')

const regex = /\S+@\S+\.\S/

const getContractors = (req, res) => {
  try {
    const contractors = `SELECT * FROM contractors ORDER BY contractorId ASC`
    
    pool.query(contractors, (err, results) => {
      if(err){
        return res.status(400).json({
          message: err.message
        })
      }

      return res.status(200).json({
        data: results.rows
      })
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const getContractorById = async(req, res) => {
  try {
    const contractorId = parseInt(req.params.id)
    const contractor = `SELECT * FROM contractors WHERE contractorId = $1`
    const contractorValue = [contractorId]
    const result = await pool.query(contractor, contractorValue)
    return {
      data: result.rows
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const addContractor = async(req, res) => {
  try {
    const { firstName, lastName, email, age, gender, role } = req.body
    const isEmail = await getSingleContractor(res, 'email', email)
    const newContractor = `INSERT INTO contractors (firstName, lastName, email, age, gender, role, createdOn)
                            VALUES($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`
    const newContractorValues = [firstName, lastName, email, age, gender, role]

    if(!firstName || !email || !role){
      return res.status(400).json({
        message: 'FirstName, Email and Role are required'
    })
    }else if (age &&  typeof age !==  'number'){
      return res.status(400).json({
        message: 'Age should be a number'
      })
    }else  if (email && isEmail.data.length){
      return res.status(400).json({
        message: 'Email already exists'
      })
    }else if (regex.test(email) === false){
      return res.status(400).json({
        message: 'Please enter a valid email'
      })
    }else {
      const results = await pool.query(newContractor, newContractorValues)

      return res.status(201).json({
        message: 'Contractor created successfuly.',
        data: results.rows[0]
    })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const updateContractor = async(req, res) => {
  try {
    const contractorId = parseInt(req.params.id)
    const { firstName, lastName, email, age, gender, role } = req.body
    const contractor = `UPDATE contractors SET firstName = $1, lastName = $2, email = s$3, age = $4, gender =$5, role = $6 WHERE contractorId = $7`
    const contractorValues = [firstName, lastName, email, age, gender, role, contractorId]

    if (age &&  typeof age !==  'number'){
      return res.status(400).json({
        message: 'Age should be a number'
      })
    }else if (regex.test(email) === false){
      return res.status(400).json({
        message: 'Please enter a valid email'
      })
    }else {
      const results = await pool.query(contractor, contractorValues)

      return res.status(201).json({
        message: 'Contractor updated successfuly.',
        data: results.rows[0]
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const deleteContractor = async(req, res) => {
  try {
  const contractorId = parseInt(request.params.id)
  const deleteQuery = `DELETE FROM contractors WHERE contractorId = $1`
  const deleteValue = [contractorId]
  
  const result = pool.query(deleteQuery, deleteValue)

  return res.status(201).json({
    message: 'Contractor deleted successfuly.',
    data: result.rows[0]
  })
    
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
  
}

const contractor = {
  getContractors,
  getContractorById,
  addContractor,
  updateContractor,
  deleteContractor
}

module.exports = contractor
