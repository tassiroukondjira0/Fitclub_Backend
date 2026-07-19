const Course = require('../models/Course');
const Booking = require('../models/Booking');

// Une réservation "pending" ou "completed" occupe une place ; seule une
// réservation "failed" (paiement échoué) libère la place.
const BOOKED_STATUSES = ['pending', 'completed'];

// Ajoute availableSpots + reconstruit `instructor` (chaîne) à partir du
// compte coach lié, pour rester compatible avec le type `Course` du frontend.
const withAvailability = async (course) => {
  const bookedCount = await Booking.countDocuments({
    courseId: course._id,
    paymentStatus: { $in: BOOKED_STATUSES },
  });
  const json = course.toJSON();
  json.availableSpots = Math.max(course.capacity - bookedCount, 0);

  if (course.coachId && typeof course.coachId === 'object' && course.coachId.name) {
    json.instructor = course.coachId.name;
    json.coachId = course.coachId._id?.toString() ?? course.coachId.id;
  } else if (course.coachId) {
    json.instructor = '';
    json.coachId = course.coachId.toString();
  }

  return json;
};

// @desc    Liste des cours
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort('_id').populate('coachId', 'name');
    const withSpots = await Promise.all(courses.map(withAvailability));
    res.json({ courses: withSpots });
  } catch (error) {
    next(error);
  }
};

// @desc    Détail d'un cours
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('coachId', 'name');
    if (!course) return res.status(404).json({ message: 'Cours introuvable' });
    res.json({ course: await withAvailability(course) });
  } catch (error) {
    next(error);
  }
};

// @desc    Cours du coach connecté
// @route   GET /api/courses/mine
// @access  Privé (coach)
const getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ coachId: req.user._id }).sort('_id').populate('coachId', 'name');
    const withSpots = await Promise.all(courses.map(withAvailability));
    res.json({ courses: withSpots });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, getCourseById, getMyCourses };
