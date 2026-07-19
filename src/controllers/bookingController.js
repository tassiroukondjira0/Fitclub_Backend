const Booking = require('../models/Booking');
const Course = require('../models/Course');
const PRICING = require('../utils/pricing');

// @desc    Créer une réservation
// @route   POST /api/bookings
// @access  Privé
// @body    { courseId, subscriptionType }
const createBooking = async (req, res, next) => {
  try {
    const { courseId, subscriptionType } = req.body;

    if (!courseId || !subscriptionType) {
      return res.status(400).json({ message: 'courseId et subscriptionType sont requis' });
    }

    if (!PRICING[subscriptionType]) {
      return res.status(400).json({ message: 'Type d\'abonnement invalide' });
    }

    const course = await Course.findById(courseId).populate('coaches');
    if (!course) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }

    if (!course.coaches || course.coaches.length === 0) {
      return res.status(400).json({ message: 'Aucun coach assigné à ce cours' });
    }

    // Alternance automatique des coachs :
    // - Récupérer toutes les réservations existantes pour ce cours, triées par ordre de création
    // - Compter combien de fois chaque coach a été assigné
    // - Choisir le coach avec le moins d'assignations (et le plus ancien en cas d'égalité)
    const previousBookings = await Booking.find({ courseId, paymentStatus: 'completed' })
      .sort('createdAt')
      .populate('assignedCoach');

    const coachAssignments = course.coaches.map((coach) => ({
      coach,
      count: previousBookings.filter((b) => b.assignedCoach && b.assignedCoach._id.toString() === coach._id.toString()).length,
    }));

    coachAssignments.sort((a, b) => {
      if (a.count !== b.count) return a.count - b.count;
      return a.coach._id.toString().localeCompare(b.coach._id.toString());
    });

    const selectedCoach = coachAssignments[0].coach;

    // Le montant est toujours calculé côté serveur à partir de la grille
    // tarifaire officielle : on ne fait jamais confiance à un montant envoyé par le client.
    const booking = await Booking.create({
      userId: req.user._id,
      courseId,
      subscriptionType,
      amount: PRICING[subscriptionType],
      paymentStatus: 'pending',
      assignedCoach: selectedCoach._id,
    });

    const populatedBooking = await Booking.findById(booking._id).populate('assignedCoach', 'name email role');

    res.status(201).json({ booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

// @desc    Mes réservations
// @route   GET /api/bookings/me
// @access  Privé
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort('-createdAt');
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings };
