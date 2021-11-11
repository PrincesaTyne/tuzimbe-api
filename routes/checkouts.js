const express = require('express')
const router = express.Router()
const checkout = require('../controllers/checkouts')

const {
  getCheckouts,
  getCheckoutById,
  addCheckout,
  updateCheckout,
  deleteCheckout,
  getDailyCosts,
  getWeeklyCosts,
  getMonthlyCosts,
  getDailyDetailedCosts,
  getWeeklyDetailedCosts,
  getMonthlyDetailedCosts,
  getDailyDetailedUsage,
  getWeeklyDetailedUsage,
  getMonthlyDetailedUsage
} = checkout

router.get('/', getCheckouts)
router.get('/daily_material_cost', getDailyCosts)
router.get('/weekly_material_cost', getWeeklyCosts)
router.get('/monthly_material_cost', getMonthlyCosts)
router.get('/daily_detailed_cost', getDailyDetailedCosts)
router.get('/weekly_detailed_cost', getWeeklyDetailedCosts)
router.get('/monthly_detailed_cost', getMonthlyDetailedCosts)
router.get('/daily_detailed_usage', getDailyDetailedUsage),
router.get('/weekly_detailed_usage', getWeeklyDetailedUsage),
router.get('/monthly_detailed_usage', getMonthlyDetailedUsage),
router.post('/', addCheckout)
router.route('/:checkoutId')
        .get(getCheckoutById)
        .put(updateCheckout)
        .delete(deleteCheckout)

module.exports = router
