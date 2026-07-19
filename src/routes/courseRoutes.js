const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, getMyCourses } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// IMPORTANT : "/mine" doit être déclaré avant "/:id" pour ne pas être
// intercepté par la route paramétrée (sinon Express chercherait un cours
// dont l'id est littéralement "mine").
router.get('/mine', protect, authorize('coach'), getMyCourses);
router.get('/', getCourses);
router.get('/:id', getCourseById);

module.exports = router;
