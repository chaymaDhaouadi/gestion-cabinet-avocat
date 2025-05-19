// services/mailerService.js
const nodemailer = require('nodemailer');

// Créer un transporteur pour l'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chaymadhaouadi3@gmail.com', // Remplace par l'email de l'avocat
    pass: 'Chaimadh'     // Remplace par le mot de passe de l'email (ou mot de passe d'application)
  }
});

// Fonction pour envoyer un email de rappel
const sendEmailReminder = (to, subject, text) => {
  const mailOptions = {
    from: 'chaymadhaouadi3@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erreur lors de l\'envoi de l\'email:', error);
    } else {
      console.log('Email envoyé: ' + info.response);
    }
  });
};

module.exports = { sendEmailReminder };
