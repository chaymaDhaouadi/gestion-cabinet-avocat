const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const session = require('express-session'); // ✅ IMPORT SESSION
const cron = require('node-cron');

const clientRoutes = require('./routes/client.routes');
const dossierRoutes = require('./routes/dossier.routes');
const audienceRoutes = require('./routes/audiences');
const documentRoutes = require('./routes/documents');
const rendezvousRoutes = require('./routes/rendezvous');
const googleCalendarService = require('./services/googleCalendarService'); // si tu as un service Google séparé
const factureRoutes = require('./routes/facture.routes');
const transactionRoutes = require('./routes/transaction.routes');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cronJobs = require('./services/cronJobs');
const googleCalendarRouter = require('./routes/google-calendar');
const { sendTestEmail } = require('./services/mailerService'); // Assure-toi d'importer le service mailer
const tribunalRoutes = require('./routes/tribunaux');
dotenv.config();
const app = express();
const PORT = 3000;

process.env.TZ = 'Europe/Paris'; // Remplace par ta timezone locale

// Vérification de la date actuelle
cron.schedule('* * * * *', () => {
  const currentDate = new Date();
  if (isNaN(currentDate.getTime())) {
    console.error('❌ Date invalide détectée !');
  } else {
    console.log('✅ Date valide :', currentDate.toLocaleString());
  }
});
// Middlewares
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: 'mon_secret_ici',
    resave: false,
    saveUninitialized: true,
  })
);
// Route de test pour envoyer un email
app.post('/api/test-email', async (req, res) => {
  const { email, sujet, message } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'L\'email est requis' });
  }

  try {
    await sendTestEmail(email, sujet || 'Test Email', message || 'Ceci est un email de test.');
    res.status(200).json({ success: 'Email envoyé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});
app.use('/api/google', googleCalendarRouter);


mongoose.connect('mongodb://localhost:27017/cabinet_avocat')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));
// Authentification Google
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send('Authentification réussie !');
  } catch (error) {
    console.error('Erreur lors de l\'authentification : ', error);
    res.status(500).send('Erreur lors de l\'authentification');
  }
});


// MongoDB


// Routes
app.use('/api/factures', factureRoutes);
app.use('/api/transactions', transactionRoutes);

// Routes API
app.use('/api/clients', clientRoutes);
app.use('/api/dossiers', dossierRoutes);
app.use('/api/audiences', audienceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/rendezvous', rendezvousRoutes);

app.use('/api/tribunaux', tribunalRoutes);



// Créer le dossier uploads/receipts s'il n'existe pas
const uploadPath = path.join(__dirname, 'uploads/receipts');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('Dossier uploads/receipts créé automatiquement.');
}

// Configuration de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/receipts');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route d'upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier reçu' });
  }

  res.status(200).json({
    message: 'Fichier uploadé avec succès',
    file: req.file
  });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});
