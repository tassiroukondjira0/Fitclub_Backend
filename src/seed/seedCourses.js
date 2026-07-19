// Ce script insère les 6 cours affichés sur la page "Cours" du frontend.
// Les identifiants (_id) sont volontairement fixes : "course_1" à "course_6",
// car src/lib/courses.ts, dans le frontend, fait déjà correspondre chaque
// slug de cours ("base-endurance", "base-hiit", ...) à ces IDs précis.
//
// Utilisation : npm run seed  (nécessite MONGO_URI dans .env)

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Course = require('../models/Course');

const courses = [
  {
    _id: 'course_1',
    title: 'Base Endurance',
    description: 'Un cours cardio intense pour améliorer votre souffle et votre résistance.',
    duration: 60,
    instructor: 'Coach Awa',
    schedule: { day: 'Lundi', time: '09:00 - 10:00' },
    capacity: 12,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '09:00 - 10:00' },
      { day: 'Mardi', time: '10:30 - 11:15' },
      { day: 'Mercredi', time: '18:00 - 18:45' },
      { day: 'Jeudi', time: '19:00 - 19:45' },
      { day: 'Vendredi', time: '21:00 - 21:30' },
      { day: 'Samedi', time: '09:00 - 10:00' },
    ],
  },
  {
    _id: 'course_2',
    title: 'Base HIIT',
    description: "Des séquences courtes et explosives pour brûler un maximum d'énergie.",
    duration: 45,
    instructor: 'Coach Idriss',
    schedule: { day: 'Lundi', time: '10:30 - 11:15' },
    capacity: 15,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '10:30 - 11:15' },
      { day: 'Mardi', time: '18:00 - 18:45' },
      { day: 'Mercredi', time: '19:00 - 19:45' },
      { day: 'Jeudi', time: '09:00 - 10:00' },
      { day: 'Vendredi', time: '20:00 - 20:30' },
      { day: 'Samedi', time: '10:30 - 11:15' },
    ],
  },
  {
    _id: 'course_3',
    title: 'Base Force',
    description: 'Un travail progressif de force pour tonifier tout le corps.',
    duration: 60,
    instructor: 'Coach Mame',
    schedule: { day: 'Mardi', time: '09:00 - 10:00' },
    capacity: 10,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '09:00 - 10:00' },
      { day: 'Mardi', time: '09:00 - 10:00' },
      { day: 'Mercredi', time: '10:30 - 11:15' },
      { day: 'Jeudi', time: '18:00 - 18:45' },
      { day: 'Vendredi', time: '19:00 - 19:45' },
      { day: 'Samedi', time: '20:00 - 20:30' },
    ],
  },
  {
    _id: 'course_4',
    title: 'Souplesse',
    description: "Des exercices de mobilité et d'étirements pour garder un corps souple.",
    duration: 45,
    instructor: 'Coach Fatou',
    schedule: { day: 'Mardi', time: '18:00 - 18:45' },
    capacity: 12,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '10:30 - 11:15' },
      { day: 'Mardi', time: '18:00 - 18:45' },
      { day: 'Mercredi', time: '09:00 - 10:00' },
      { day: 'Jeudi', time: '19:00 - 19:45' },
      { day: 'Vendredi', time: '09:00 - 10:00' },
      { day: 'Samedi', time: '21:00 - 21:30' },
    ],
  },
  {
    _id: 'course_5',
    title: 'Cardio',
    description: 'Un entraînement rythmé pour stimuler le cœur et augmenter l\'endurance.',
    duration: 45,
    instructor: 'Coach Moussa',
    schedule: { day: 'Mercredi', time: '09:00 - 09:45' },
    capacity: 15,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '18:00 - 18:45' },
      { day: 'Mardi', time: '19:00 - 19:45' },
      { day: 'Mercredi', time: '09:00 - 09:45' },
      { day: 'Jeudi', time: '20:00 - 20:30' },
      { day: 'Vendredi', time: '10:30 - 11:15' },
      { day: 'Samedi', time: '09:00 - 10:00' },
    ],
  },
  {
    _id: 'course_6',
    title: 'Souffle',
    description: 'Un cours centré sur la respiration pour mieux gérer l\'effort et récupérer.',
    duration: 30,
    instructor: 'Coach Aida',
    schedule: { day: 'Mercredi', time: '20:00 - 20:30' },
    capacity: 10,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '19:00 - 19:45' },
      { day: 'Mardi', time: '20:00 - 20:30' },
      { day: 'Mercredi', time: '20:00 - 20:30' },
      { day: 'Jeudi', time: '09:00 - 10:00' },
      { day: 'Vendredi', time: '18:00 - 18:45' },
      { day: 'Samedi', time: '19:00 - 19:45' },
    ],
  },
  {
    _id: 'course_7',
    title: 'Power Training',
    description: 'Un cours intense de musculation pour développer la puissance.',
    duration: 60,
    instructor: 'Coach Awa',
    schedule: { day: 'Jeudi', time: '09:00 - 10:00' },
    capacity: 12,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '21:00 - 21:30' },
      { day: 'Mardi', time: '09:00 - 10:00' },
      { day: 'Mercredi', time: '18:00 - 18:45' },
      { day: 'Jeudi', time: '09:00 - 10:00' },
      { day: 'Vendredi', time: '19:00 - 19:45' },
      { day: 'Samedi', time: '10:30 - 11:15' },
    ],
  },
  {
    _id: 'course_8',
    title: 'Yoga Flow',
    description: 'Un cours de yoga dynamique pour améliorer flexibilité et équilibre.',
    duration: 45,
    instructor: 'Coach Fatou',
    schedule: { day: 'Jeudi', time: '19:00 - 19:45' },
    capacity: 15,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '09:00 - 10:00' },
      { day: 'Mardi', time: '21:00 - 21:30' },
      { day: 'Mercredi', time: '19:00 - 19:45' },
      { day: 'Jeudi', time: '19:00 - 19:45' },
      { day: 'Vendredi', time: '09:00 - 10:00' },
      { day: 'Samedi', time: '18:00 - 18:45' },
    ],
  },
  {
    _id: 'course_9',
    title: 'HIIT avancé',
    description: 'Séquences avancées pour sportifs confirmés.',
    duration: 45,
    instructor: 'Coach Idriss',
    schedule: { day: 'Vendredi', time: '09:00 - 09:45' },
    capacity: 12,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '10:30 - 11:15' },
      { day: 'Mardi', time: '09:00 - 10:00' },
      { day: 'Mercredi', time: '21:00 - 21:30' },
      { day: 'Jeudi', time: '10:30 - 11:15' },
      { day: 'Vendredi', time: '09:00 - 09:45' },
      { day: 'Samedi', time: '20:00 - 20:30' },
    ],
  },
  {
    _id: 'course_10',
    title: 'Mobilité',
    description: 'Exercices de mobilité articulaire pour tous niveaux.',
    duration: 30,
    instructor: 'Coach Aida',
    schedule: { day: 'Vendredi', time: '21:00 - 21:30' },
    capacity: 10,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '20:00 - 20:30' },
      { day: 'Mardi', time: '10:30 - 11:15' },
      { day: 'Mercredi', time: '09:00 - 10:00' },
      { day: 'Jeudi', time: '18:00 - 18:45' },
      { day: 'Vendredi', time: '21:00 - 21:30' },
      { day: 'Samedi', time: '09:00 - 10:00' },
    ],
  },
  {
    _id: 'course_11',
    title: 'Endurance matinale',
    description: 'Démarrez votre journée avec un cours de cardio revitalisant.',
    duration: 60,
    instructor: 'Coach Moussa',
    schedule: { day: 'Samedi', time: '09:00 - 10:00' },
    capacity: 15,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '09:00 - 10:00' },
      { day: 'Mardi', time: '18:00 - 18:45' },
      { day: 'Mercredi', time: '20:00 - 20:30' },
      { day: 'Jeudi', time: '09:00 - 10:00' },
      { day: 'Vendredi', time: '18:00 - 18:45' },
      { day: 'Samedi', time: '09:00 - 10:00' },
    ],
  },
  {
    _id: 'course_12',
    title: 'Renforcement musculaire',
    description: 'Renforcement ciblé pour tout le corps.',
    duration: 45,
    instructor: 'Coach Mame',
    schedule: { day: 'Samedi', time: '16:00 - 16:45' },
    capacity: 12,
    coaches: [],
    scheduleSlots: [
      { day: 'Lundi', time: '18:00 - 18:45' },
      { day: 'Mardi', time: '19:00 - 19:45' },
      { day: 'Mercredi', time: '10:30 - 11:15' },
      { day: 'Jeudi', time: '20:00 - 20:30' },
      { day: 'Vendredi', time: '09:00 - 10:00' },
      { day: 'Samedi', time: '16:00 - 16:45' },
    ],
  },
];

const run = async () => {
  await connectDB();

  for (const course of courses) {
    await Course.findByIdAndUpdate(course._id, course, { upsert: true, new: true });
    console.log(`✔ Cours seedé : ${course.title} (${course._id})`);
  }

  console.log('Seed terminé.');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error('Erreur pendant le seed :', error);
  process.exit(1);
});
