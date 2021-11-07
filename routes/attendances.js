const express = require('express')
const router = express.Router()
const attendance = require('../controllers/attendances')

const {
  getAttendances,
  getAttendanceById,
  addAttendance,
  updateAttendance,
  deleteAttendance
} = attendance

router.get('/', getAttendances)
router.post('/', addAttendance)
router.put('/', )
router.get('/:attendanceId', getAttendanceById)
router.put('/:contractorId', updateAttendance)
router.delete('/:attendanceId', deleteAttendance)

module.exports = router
