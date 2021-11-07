const express = require('express')
const router = express.Router()
const role = require('../controllers/roles')

const {
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole
} = role

router.get('/', getRoles)
router.post('/', addRole)
router.route('/:roleId')
        .get(getRoleById)
        .put(updateRole)
        .delete(deleteRole)

module.exports = router
