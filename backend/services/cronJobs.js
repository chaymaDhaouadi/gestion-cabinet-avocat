// services/cronJobs.js
const cron = require('node-cron');
const { sendEmailReminder } = require('./mailerService');
const Rendezvous = require('../models/rendezvous.model'); // Assure-toi que tu as un modèle de rendez-vous

// Exemple de fonction pour vérifier les rendez-vous et envoyer un email de rappel
cron.schedule('0 9 * * *', () => { // Tous les jours à 9h
  Rendezvous.find({ date: { $gte: new Date() } }) // Trouver les rendez-vous à venir
    .then(rendezVousAvenir => {
      rendezVousAvenir.forEach(rendezVous => {
        const email = rendezVous.avocatEmail;
        const sujet = 'Rappel : Rendez-vous avec un client';
        const texte = `Bonjour, vous avez un rendez-vous avec ${rendezVous.clientNom} le ${rendezVous.date}.`;

        sendEmailReminder(email, sujet, texte); // Envoi de l'email
      });
    })
    .catch(err => console.log('Erreur lors de la récupération des rendez-vous:', err));
});
