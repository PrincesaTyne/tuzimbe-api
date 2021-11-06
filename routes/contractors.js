const express = require('express')
const router = express.Router()
const contractor = require('../controllers/contractors')

const {
  getContractors,
  getContractorById,
  addContractor,
  updateContractor,
  deleteContractor
} = contractor

router.get('/', getContractors)
router.post('/', addContractor)
router.route('/:id')
        .get(getContractorById)
        .put(updateContractor)
        .delete(deleteContractor)

module.exports = router
