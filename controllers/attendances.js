const pool = require('../models/dbconnect')

const getAttendances = (req, res) => {
  try {
    const getAttendancesQuery = `SELECT * FROM attendances ORDER BY attendanceId DESC`
    
    pool.query(getAttendancesQuery, (err, results) => {
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

const getAttendanceById = async(req, res) => {
  try {
    const attendanceId = parseInt(req.params.attendanceId)
    const getAttendanceQuery = `SELECT * FROM attendances WHERE attendanceId = $1`
    const getAttendanceQueryValue = [attendanceId]
    const result = await pool.query(getAttendanceQuery, getAttendanceQueryValue)
    return res.status(400).json({
      data: result.rows
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const clockedin = async(res, id) => {
  try {
    const clockedinQuery = `SELECT * FROM attendances WHERE contractorId = ${id} AND arrivalTime::DATE = CURRENT_DATE`
    const result = await pool.query(clockedinQuery)
    return {
      data: result.rows
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const clockedout = async(res, id) => {
  try {
    const clockedoutQuery = `SELECT * FROM attendances WHERE contractorId = ${id} AND arrivalTime::DATE = CURRENT_DATE AND departureTime IS NOT NULL`
    const result = await pool.query(clockedoutQuery)
    return {
      data: result.rows
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const getAttendance = async(res, option, value) => {
  try {
    const attendanceQuery = `SELECT * FROM attendances WHERE ${option} = $1`
    const attendanceQueryValue = [value]
    const result = await pool.query(attendanceQuery, attendanceQueryValue)
    return {
      data: result.rows
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const addAttendance = async(req, res) => {
  try {
    const { contractorId } = req.body
    const isClockedin = await clockedin(res, contractorId)
    const addAttendanceQuery = `INSERT INTO attendances (contractorId, arrivalTime)
                            VALUES($1, NOW()) RETURNING *`
    const addAttendanceQueryValues = [contractorId]

    if(!contractorId){
      return res.status(400).json({
        message: 'ContractorId is required'
    })
    }else if (contractorId &&  typeof contractorId !==  'number'){
      return res.status(400).json({
        message: 'ContractorId should be a number'
      })
    }else if (contractorId && isClockedin.data.length){
      return res.status(400).json({
        message: 'ID exists. Contractor already clockedin'
      })
    }else {
      const results = await pool.query(addAttendanceQuery, addAttendanceQueryValues)

      return res.status(201).json({
        message: 'Contractor clocked in successffuly.',
        data: results.rows[0]
    })
    }
  } catch (err) {
    if (err.message.includes('violates foreign key constraint')){
      return res.status(400).json({
        message: 'Contractor does not exist. Please first add contractor'
      })
    }else {
      return res.status(400).json({
        message: err.message
      })
    }
    
  }
}

const updateAttendance = async(req, res) => {
  try {
    const attendanceId = parseInt(req.params.attendanceId)
    const { contractorId } = req.body
    const isClockedin = await clockedin(res, contractorId)
    const isClockedout = await clockedout(res, contractorId)
    const updateAttendanceQuery = `UPDATE attendances SET departureTime = NOW() WHERE contractorId = ${contractorId} AND arrivalTime::DATE = CURRENT_DATE`

    if(!contractorId){
      return res.status(400).json({
        message: 'ContractorId is required'
    })
    }else if (contractorId &&  typeof contractorId !==  'number'){
      return res.status(400).json({
        message: 'ContractorId should be a number'
      })
    }else if(contractorId &&  !isClockedin.data.length){
      return res.status(400).json({
        message: 'Please clockin first'
      })
    }else if(contractorId &&  isClockedout.data.length){
      return res.status(400).json({
        message: 'Contractor already clockedout'
      })
    }else {
      const results = await pool.query(updateAttendanceQuery)

      return res.status(201).json({
        message: 'Contractor clockedout successfuly.',
        data: results.rows[0]
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const deleteAttendance = async(req, res) => {
  try {
  const attendanceId = parseInt(req.params.attendanceId)
  const deleteAttendanceQuery = `DELETE FROM attendances WHERE attendanceId = $1`
  const deleteAttendanceValue = [attendanceId]
  
  const result = pool.query(deleteAttendanceQuery, deleteAttendanceValue)

  return res.status(201).json({
    message: 'Contractor deleted successfuly.'
  })
    
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
  
}

const getDailyCosts = (req, res) => {
  try {
    const getDailyCostsQuery = `SELECT SUM(contractors.quantity * materials.price) as dailyCost FROM checkouts 
                                INNER JOIN materials ON materials.materialId = checkouts.materialId
                                WHERE checkouts.createdOn::DATE = CURRENT_DATE`
    
    pool.query(getDailyCostsQuery, (err, results) => {
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

const attendance = {
  getAttendances,
  getAttendanceById,
  addAttendance,
  updateAttendance,
  deleteAttendance
}

module.exports = attendance
