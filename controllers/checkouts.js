const pool = require('../models/dbconnect')

const getCheckouts = (req, res) => {
  try {
    const getCheckoutsQuery = `SELECT * FROM checkouts ORDER BY checkoutId DESC`
    
    pool.query(getCheckoutsQuery, (err, results) => {
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

const getCheckoutById = async(req, res) => {
  try {
    const checkoutId = parseInt(req.params.checkoutId)
    const getCheckoutQuery = `SELECT * FROM checkouts WHERE checkoutId = $1`
    const getCheckoutQueryValue = [checkoutId]
    const result = await pool.query(getCheckoutQuery, getCheckoutQueryValue)
    return res.status(400).json({
      data: result.rows
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const getCheckout = async(res, option, value) => {
  try {
    const checkoutQuery = `SELECT * FROM checkouts WHERE ${option} = $1`
    const checkoutQueryValue = [value]
    const result = await pool.query(checkoutQuery, checkoutQueryValue)
    return {
      data: result.rows
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const addCheckout = async(req, res) => {
  try {
    const { materialName, quantity } = req.body
    const addCheckoutQuery = `INSERT INTO checkouts (quantity, createdOn, materialId)
                            VALUES($1, NOW(), (SELECT materialId from materials WHERE materialName = $2 )) RETURNING *`
    const addCheckoutQueryValues = [quantity, materialName]

    if(!quantity || !materialName){
      return res.status(400).json({
        message: 'MaterialName and Quantity are required'
    })
    }else if (quantity &&  typeof quantity !==  'number'){
      return res.status(400).json({
        message: 'Quantity should be a number'
      })
    }else {
      const results = await pool.query(addCheckoutQuery, addCheckoutQueryValues)

      return res.status(201).json({
        message: 'Material checkedout successffuly.',
        data: results.rows[0]
    })
    }
  } catch (err) {
    if (err.message.includes('null value in column \"materialid\" violates not-null constraint')){
      return res.status(400).json({
        message: 'Material does not exist yet. Please first add material'
      })
    }else {
      return res.status(400).json({
        message: err.message
      })
    }
    
  }
}

const updateCheckout = async(req, res) => {
  try {
    const checkoutId = parseInt(req.params.checkoutId)
    const { materialName, quantity } = req.body
    const updateCheckoutQuery = `UPDATE checkouts SET quantity = ${quantity}, materialId = (SELECT materialId from materials WHERE materialName = ${materialName} ) WHERE checkoutId = ${checkoutId}`

    if(quantity &&  typeof quantity !==  'number'){
      return res.status(400).json({
        message: 'Quantity should be a number'
      })
    }else {
      const results = await pool.query(updateCheckoutQuery)

      return res.status(201).json({
        message: 'Checkout updated successfuly.',
        data: results.rows[0]
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

const deleteCheckout = async(req, res) => {
  try {
  const checkoutId = parseInt(req.params.checkoutId)
  const deleteCheckoutQuery = `DELETE FROM checkouts WHERE checkoutId = $1`
  const deleteCheckoutValue = [checkoutId]
  
  const result = pool.query(deleteCheckoutQuery, deleteCheckoutValue)

  return res.status(201).json({
    message: 'Checkout deleted successfuly.'
  })
    
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
  
}

const checkout = {
  getCheckouts,
  getCheckoutById,
  addCheckout,
  updateCheckout,
  deleteCheckout
}

module.exports = checkout
