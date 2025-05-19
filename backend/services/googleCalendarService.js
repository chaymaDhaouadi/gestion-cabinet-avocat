const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// URL pour l'authentification Google
function getAuthUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
    });
}

// Récupérer les tokens après l'authentification
async function getAccessToken(code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
}

// Ajouter un événement au Google Calendar
async function addEvent(eventDetails) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
        summary: eventDetails.title,
        description: eventDetails.description,
        location: eventDetails.location,
        start: {
            dateTime: eventDetails.startTime,
            timeZone: 'Europe/Paris',
        },
        end: {
            dateTime: eventDetails.endTime,
            timeZone: 'Europe/Paris',
        },
    };

    await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    });
}

// (Optionnel) Envoyer un email de notification (exemple vide)
async function sendEmailNotification(emailDetails) {
    console.log('Simulation : envoi d\'un email à ', emailDetails.to);
    // Ici tu peux utiliser nodemailer pour vraiment envoyer un mail si tu veux
}

module.exports = {
    getAuthUrl,
    getAccessToken,
    addEvent,
    sendEmailNotification,
};
