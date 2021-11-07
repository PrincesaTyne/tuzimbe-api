const pool = require('../models/dbconnect')

const regex = /\S+@\S+\.\S/

const getContractors = (req, res) => {
  try {
    const getContractorsQuery = `SELECT * FROM contractors ORDER BY contractorId ASC`
    
    pool.query(getContractorsQuery, (err, results) => {
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
    const contractorId = parseInt(req.params.contractorId)
    const getContractorQuery = `SELECT * FROM contractors WHERE contractorId = $1`
    const getContractorQueryValue = [contractorId]
    const result = await pool.query(getContractorQuery, getContractorQueryValue)
    return res.status(400).json({
      data: result.rows
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const getContractor = async(res, option, value) => {
  try {
    const contractorQuery = `SELECT * FROM contractors WHERE ${option} = $1`
    const contractorQueryValue = [value]
    const result = await pool.query(contractorQuery, contractorQueryValue)
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
    const { firstName, lastName, email, age, gender, roleId } = req.body
    const isEmail = await getContractor(res, 'email', email)
    const addContractorQuery = `INSERT INTO contractors (firstName, lastName, email, age, gender, roleId, createdOn)
                            VALUES($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`
    const addContractorQueryValues = [firstName, lastName, email, age, gender, roleId]

    if(!firstName || !email || !roleId){
      return res.status(400).json({
        message: 'FirstName, Email and RoleId are required'
    })
    }else if (age &&  typeof age !==  'number'){
      return res.status(400).json({
        message: 'Age should be a number'
      })
    }else if (roleId &&  typeof roleId !==  'number'){
      return res.status(400).json({
        message: 'RoleId should be a number'
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
      const results = await pool.query(addContractorQuery, addContractorQueryValues)

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
    const contractorId = parseInt(req.params.contractorId)
    const { firstName, lastName, email, age, gender, roleId } = req.body
    const updateContractorQuery = `UPDATE contractors SET firstName = $1, lastName = $2, email = $3, age = $4, gender =$5, roleId = $6 WHERE contractorId = $7`
    const updateContractorQueryValues = [firstName, lastName, email, age, gender, roleId, contractorId]

    if (age &&  typeof age !==  'number'){
      return res.status(400).json({
        message: 'Age should be a number'
      })
    }else if (roleId &&  typeof roleId !==  'number'){
      return res.status(400).json({
        message: 'RoleId should be a number'
      })
    }else if (regex.test(email) === false){
      return res.status(400).json({
        message: 'Please enter a valid email'
      })
    }else {
      const results = await pool.query(updateContractorQuery, updateContractorQueryValues)

      return res.status(201).json({
        message: 'Contractor updated successfuly.',
        data: results.rows[0]
      })
    }
  } catch (err) {
    if (err.message.includes('duplicate key value violates unique constraint')){
      return res.status(400).json({
        message: 'Email already exists'
      })
    }else {
      return res.status(400).json({
        message: err.message
      })
    }
  }
}

const deleteContractor = async(req, res) => {
  try {
  const contractorId = parseInt(req.params.contractorId)
  const deleteContractorQuery = `DELETE FROM contractors WHERE contractorId = $1`
  const deleteContractorValue = [contractorId]
  
  const result = pool.query(deleteContractorQuery, deleteContractorValue)

  return res.status(201).json({
    message: 'Contractor deleted successfuly.'
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
