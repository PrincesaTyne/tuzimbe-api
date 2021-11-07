const pool = require('../models/dbconnect')

const getRoles = (req, res) => {
  try {
    const getRolesQuery = `SELECT * FROM roles ORDER BY roleId ASC`
    
    pool.query(getRolesQuery, (err, results) => {
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

const getRoleById = async(req, res) => {
  try {
    const roleId = parseInt(req.params.roleId)
    const getRoleQuery = `SELECT * FROM roles WHERE roleId = $1`
    const getRoleQueryValue = [roleId]
    const result = await pool.query(getRoleQuery, getRoleQueryValue)
    return res.status(400).json({
      data: result.rows
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const getRole = async(res, option, value) => {
  try {
    const roleQuery = `SELECT * FROM roles WHERE ${option} = $1`
    const roleQueryValue = [value]
    const result = await pool.query(roleQuery, roleQueryValue)
    return {
      data: result.rows
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const addRole = async(req, res) => {
  try {
    const { role, payRate } = req.body
    const isRole = await getRole(res, 'role', role)
    const addRoleQuery = `INSERT INTO roles (role, payrate, createdOn)
                            VALUES($1, $2, NOW()) RETURNING *`
    const addRoleQueryValues = [role, payRate]

    if(!role || !payRate){
      return res.status(400).json({
        message: 'Role and PayRate are required'
    })
    }else if (payRate &&  typeof payRate !==  'number'){
      return res.status(400).json({
        message: 'PayRate should be a number'
      })
    }else if (role && isRole.data.length){
      return res.status(400).json({
        message: 'RoleName already exists'
      })
    }else {
      const results = await pool.query(addRoleQuery, addRoleQueryValues)

      return res.status(201).json({
        message: 'Role created successfuly.',
        data: results.rows[0]
    })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const updateRole = async(req, res) => {
  try {
    const roleId = parseInt(req.params.roleId)
    const { role, payRate } = req.body
    const updateRoleQuery = `UPDATE roles SET role = $1, payRate = $2 WHERE roleId = $3`
    const updateRoleQueryValues = [role, payRate, roleId]

    if (payRate &&  typeof payRate !==  'number'){
      return res.status(400).json({
        message: 'PayRate should be a number'
      })
    }else {
      const results = await pool.query(updateRoleQuery, updateRoleQueryValues)

      return res.status(201).json({
        message: 'Role updated successfuly.',
        data: results.rows[0]
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const deleteRole = async(req, res) => {
  try {
  const roleId = parseInt(req.params.roleId)
  const deleteRoleQuery = `DELETE FROM roles WHERE roleId = $1`
  const deleteRoleValue = [roleId]
  
  const result = pool.query(deleteRoleQuery, deleteRoleValue)

  return res.status(201).json({
    message: 'Role deleted successfuly.'
  })
    
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
  
}

const role = {
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole
}

module.exports = role
