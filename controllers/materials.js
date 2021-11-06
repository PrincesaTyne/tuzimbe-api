const pool = require('../models/dbconnect')

const getMaterials = (req, res) => {
  try {
    const getMaterialsQuery = `SELECT * FROM materials ORDER BY materialId ASC`
    
    pool.query(getMaterialsQuery, (err, results) => {
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

const getMaterialById = async(req, res) => {
  try {
    const materialId = parseInt(req.params.materialId)
    const getMaterialQuery = `SELECT * FROM materials WHERE materialId = $1`
    const getMaterialQueryValue = [materialId]
    const result = await pool.query(getMaterialQuery, getMaterialQueryValue)
    return res.status(400).json({
      data: result.rows
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const getMaterial = async(res, option, value) => {
  try {
    const materialQuery = `SELECT * FROM materials WHERE ${option} = $1`
    const materialQueryValue = [value]
    const result = await pool.query(materialQuery, materialQueryValue)
    return {
      data: result.rows
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const addMaterial = async(req, res) => {
  try {
    const { materialName, quantity, price, measurement } = req.body
    const isMaterial = await getMaterial(res, 'materialName', materialName)
    const addMaterialQuery = `INSERT INTO materials (materialName, quantity, price, measurement, updatedOn, createdOn)
                            VALUES($1, $2, $3, $4, NOW(), NOW()) RETURNING *`
    const addMaterialQueryValues = [materialName, quantity, price, measurement]

    if(!materialName || !quantity || !price || !measurement){
      return res.status(400).json({
        message: 'MaterialName, Quantity, Measurement and Price are required'
    })
    }else if (quantity &&  typeof quantity !==  'number'){
      return res.status(400).json({
        message: 'Quantity should be a number'
      })
    }else if (price &&  typeof price !==  'number'){
      return res.status(400).json({
        message: 'Price should be a number'
      })
    }else if (materialName && isMaterial.data.length){
      return res.status(400).json({
        message: 'MaterialName already exists'
      })
    }else {
      const results = await pool.query(addMaterialQuery, addMaterialQueryValues)

      return res.status(201).json({
        message: 'Material created successfuly.',
        data: results.rows[0]
    })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const updateMaterial = async(req, res) => {
  try {
    const materialId = parseInt(req.params.materialId)
    const { materialName, quantity, price, measurement } = req.body
    const updateMaterialQuery = `UPDATE materials SET materialName = $1, quantity = $2, price = $3, measurement =$4, updatedOn = NOW() WHERE materialId = $5`
    const updateMaterialQueryValues = [materialName, quantity, price, measurement, materialId]

    if (quantity &&  typeof quantity !==  'number'){
      return res.status(400).json({
        message: 'Quantity should be a number'
      })
    }else if(price &&  typeof price !==  'number'){
      return res.status(400).json({
        message: 'Price should be a number'
      })
    }else {
      const results = await pool.query(updateMaterialQuery, updateMaterialQueryValues)

      return res.status(201).json({
        message: 'Material updated successfuly.',
        data: results.rows[0]
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const deleteMaterial = async(req, res) => {
  try {
  const materialId = parseInt(req.params.materialId)
  const deleteMaterialQuery = `DELETE FROM materials WHERE materialId = $1`
  const deleteMaterialValue = [materialId]
  
  const result = pool.query(deleteMaterialQuery, deleteMaterialValue)

  return res.status(201).json({
    message: 'Material deleted successfuly.'
  })
    
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
  
}

const material = {
  getMaterials,
  getMaterialById,
  addMaterial,
  updateMaterial,
  deleteMaterial
}

module.exports = material
