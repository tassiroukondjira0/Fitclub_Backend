const Course = require('../models/Course');
const Booking = require('../models/Booking');

// Une réservation "pending" ou "completed" occupe une place ; seule une
// réservation "failed" (paiement échoué) libère la place.
const BOOKED_STATUSES = ['pending', 'completed'];

// Calcul de l'instructeur rotatif pour un créneau donné
const getRotatingInstructor = (course, targetDay) => {
  if (!course.coaches || course.coaches.length === 0 || !course.scheduleSlots || course.scheduleSlots.length === 0) {
    return course.instructor;
  }

  // Trouver les créneaux pour le jour demandé
  const daySlots = course.scheduleSlots.filter(slot => slot.day === targetDay);
  if (daySlots.length === 0) {
    return course.instructor;
  }

  // Prendre le premier créneau du jour pour déterminer l'index de rotation
  const targetSlot = daySlots[0];
  const slotIndex = course.scheduleSlots.findIndex(slot => 
    slot.day === targetSlot.day && slot.time === targetSlot.time
  );

  if (slotIndex === -1) {
    return course.instructor;
  }

  // Rotation simple : le coach à l'index (slotIndex % nombre de coaches)
  const coachIndex = slotIndex % course.coaches.length;
  const coach = course.coaches[coachIndex];
  
  return coach?.name || course.instructor;
};

// Ajoute availableSpots à un cours en comptant ses réservations actives.
const withAvailability = async (course) => {
  const bookedCount = await Booking.countDocuments({
    courseId: course._id,
    paymentStatus: { $in: BOOKED_STATUSES },
  });
  const json = course.toJSON();
  json.availableSpots = Math.max(course.capacity - bookedCount, 0);
  // Utiliser le coach rotatif basé sur le jour courant
  const today = new Date();
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const currentDay = dayNames[today.getDay()];
  json.instructor = getRotatingInstructor(course, currentDay);
  return json;
};

// @desc    Liste des cours
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort('_id').populate('coaches', 'name email role');
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
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Cours introuvable' });
    res.json({ course: await withAvailability(course) });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, getCourseById };