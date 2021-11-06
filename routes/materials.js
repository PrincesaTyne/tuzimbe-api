const express = require('express')
const router = express.Router()
const material = require('../controllers/materials')

const {
  getMaterials,
  getMaterialById,
  addMaterial,
  updateMaterial,
  deleteMaterial
} = material

router.get('/', getMaterials)
router.post('/', addMaterial)
router.route('/:materialId')
        .get(getMaterialById)
        .put(updateMaterial)
        .delete(deleteMaterial)

module.exports = router
