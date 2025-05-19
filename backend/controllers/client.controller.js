const Client = require('../models/client.model');
// ➕ Ajouter un client
exports.addClient = async (req, res) => {
  try {
    const { cin } = req.body;

    // 🔍 Vérifier l'existence du CIN
    const existingClient = await Client.findOne({ cin });
    if (existingClient) {
      return res.status(400).json({ message: 'CIN déjà utilisé !' });
    }

    const newClient = new Client(req.body);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// 📋 Lister tous les clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Obtenir un client par ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✏️ Modifier un client
exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🗑 Supprimer un client
exports.deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// 🔍 Vérifier l'unicité du CIN
exports.checkCIN = async (req, res) => {
  try {
    const cin = parseInt(req.params.cin);
    const client = await Client.findOne({ cin });

    if (client) {
      return res.status(200).json(client); // Client trouvé
    } else {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔍 Rechercher un client par CIN
exports.getClientByCIN = async (req, res) => {
  try {
    const cinRecherche = parseInt(req.params.cin);
    console.log("🔍 CIN reçu:", cinRecherche);

    const client = await Client.findOne({ cin: cinRecherche });

    if (!client) {
      console.log("❌ Aucun client trouvé avec ce CIN.");
      return res.status(404).json({ message: "Client non trouvé" });
    }

    console.log("✅ Client trouvé:", client);
    res.json(client);
  } catch (error) {
    console.error("⚠️ Erreur serveur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

