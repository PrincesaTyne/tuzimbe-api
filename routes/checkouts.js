const express = require('express')
const router = express.Router()
const checkout = require('../controllers/checkouts')

const {
  getCheckouts,
  getCheckoutById,
  addCheckout,
  updateCheckout,
  deleteCheckout
} = checkout

router.get('/', getCheckouts)
router.post('/', addCheckout)
router.route('/:checkoutId')
        .get(getCheckoutById)
        .put(updateCheckout)
        .delete(deleteCheckout)

module.exports = router
