const { execSync } = require('child_process');
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util'); 

const nodemailer = require('nodemailer'); 

const helmet = require('helmet'); // Ajoutez cette ligne

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou autre (Outlook, etc.)
  auth: {
    user: 'asrmsm1@gmail.com', 
    pass: 'qxxt htix xgrv uzcb'
  }
});

// Installation des dépendances Python au démarrage
function installPythonDeps() {
  try {
    console.log('Vérification des dépendances Python...');
    const requiredPackages = {
      'pdfminer.six': '20221105',
      'nltk': '3.8.1',
      'scikit-learn': '1.3.2',
      'python-dateutil': '2.8.2'
    };

    for (const [pkg, version] of Object.entries(requiredPackages)) {
      try {
        const importName = pkg === 'pdfminer.six' ? 'pdfminer' : 
                          pkg === 'python-dateutil' ? 'dateutil' : pkg.replace('-', '_');
        execSync(`python -c "import ${importName}"`);
        console.log(`${pkg} est déjà installé`);
      } catch {
        console.log(`Installation de ${pkg}==${version}...`);
        execSync(`pip install ${pkg}==${version}`, { stdio: 'inherit' });
      }
    }
    
    // Télécharger les données NLTK
    try {
      execSync('python -c "import nltk; nltk.download(\'stopwords\')"');
    } catch (error) {
      console.log('Téléchargement des stopwords NLTK...');
    }
  } catch (error) {
    console.error('Erreur lors de l\'installation des dépendances Python:', error);
    process.exit(1);
  }
}

installPythonDeps();

// Configuration de l'application Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));

// Middleware pour parser les données URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuration CORS pour autoriser les requêtes depuis des fichiers locaux


// Configuration CORS professionnelle
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000    ',
    'http://localhost:5500',
    'http://127.0.0.1:5500    ',
    null // Pour fichiers locaux ouverts directement
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Gérer les requêtes OPTIONS (préflight)
app.options('*', cors());

// Configuration
const SECRET_KEY = process.env.SECRET_KEY || 'SRM_SM_SECRET_KEY_2025'; 
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_stages',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Créer un pool de connexions MySQL
const pool = mysql.createPool(dbConfig);

// Créer le répertoire uploads s'il n'existe pas
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Configuration sécurisée de Helmet avec CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      // Directives de base
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],

      // Chargement des scripts
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",       // Nécessaire pour certains formulaires candidats
        "'unsafe-eval'",         // Si utilisation de certaines librairies
        "https://cdn.jsdelivr.net",
        "https://www.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],

      // Feuilles de style
      styleSrc: [
        "'self'",
        "'unsafe-inline'",       // Pour les styles dynamiques
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://www.gstatic.com"
      ],

      // Balises <link> styles
      styleSrcElem: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://www.gstatic.com"
      ],

      // Polices
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
        "https://www.gstatic.com"
      ],

      // Images et PDFs
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://www.gstatic.com",
        "https://*.googleusercontent.com"
      ],
      
      // Ajouts spécifiques pour les fichiers candidats
      connectSrc: [
        "'self'",
        "http://localhost:3000",
        "ws://localhost:3000",
        "https://your-api-domain.com"
      ],

      // Permissions pour les PDFs
      objectSrc: ["'self'", "blob:"], // Essentiel pour l'affichage des PDF
      childSrc: ["'self'", "blob:"],  // Pour l'embedding de documents

      // Media
      mediaSrc: ["'self'", "data:", "blob:"], // Pour la prévisualisation

      // Frames
      frameSrc: [
        "'self'",
        "blob:", // Pour l'affichage des PDF
        "https://www.google.com",
        "https://translate.google.com"
      ],

      // Workers
      workerSrc: ["'self'", "blob:"], // Pour le traitement des fichiers

      // Manifest
      manifestSrc: ["'self'"]
    },
    reportOnly: false
  },
  // Autres configurations de sécurité
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Modifié pour les fichiers
  crossOriginEmbedderPolicy: { policy: "credentialless" }, // Assoupli pour les PDFs
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Pour les popups de prévisualisation
  
  // Reste de la configuration inchangée
  originAgentCluster: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  strictTransportSecurity: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  },
  xssFilter: true,
  noSniff: true,
  ieNoOpen: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true
}));

// Middleware d'authentification JWT
function authenticateJWT(requiredRole) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Token d\'authentification manquant' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = await promisify(jwt.verify)(token, SECRET_KEY);
      
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Accès non autorisé pour ce rôle' });
      }

      // Vérifier si l'utilisateur existe toujours en base
      const table = decoded.role === 'admin' ? 'Administrateur' : 'Candidat';
      const idField = decoded.role === 'admin' ? 'idAdmin' : 'idCandidat';
      
      const [rows] = await pool.query(
        `SELECT ${idField} FROM ${table} WHERE ${idField} = ?`, 
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(403).json({ message: 'Utilisateur introuvable' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error('Erreur JWT:', err);
      return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
  };
}

// Fonction utilitaire pour gérer les erreurs
function handleError(res, error, context) {
  console.error(`Erreur dans ${context}:`, error);
  const message = process.env.NODE_ENV === 'development' 
    ? `${context}: ${error.message}`
    : `Une erreur est survenue lors de ${context}`;
  
  res.status(500).json({ message });
}

// Routes pour les candidats 

// fonction de validation
// 🔐 Validation mot de passe côté serveur
function validatePasswordServer(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// Inscription candidat
app.post('/api/candidat/inscription', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'lettre', maxCount: 1 }
]), async (req, res) => {
  const { nom, prenom, email, motDePasse, telephone, adresse, etablissement, domaine, niveau } = req.body;
  
  if (!nom || !prenom || !email || !motDePasse || !etablissement || !domaine || !niveau) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    
    // Vérifier si l'email existe déjà
    const [existing] = await connection.query(
      'SELECT idCandidat FROM Candidat WHERE email = ?', 
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }
    
    if (!validatePasswordServer(motDePasse)) {
    return res.status(400).json({
        message: "Le mot de passe doit contenir : 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)"
    });
   };

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    
    // Insérer le nouveau candidat
    const [result] = await connection.query(
      `INSERT INTO Candidat (
        nom, prenom, email, motDePasse, telephone, adresse, 
        etablissement, domaine, niveau
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nom, prenom, email, hashedPassword, telephone || null, adresse || null,
        etablissement, domaine, niveau
      ]
    );

    res.status(201).json({ 
      message: 'Inscription réussie',
      id: result.insertId
    });
  } catch (err) {
    handleError(res, err, 'l\'inscription');
  } finally {
    if (connection) connection.release();
  }
});

// Connexion candidat
app.post('/api/candidat/login', async (req, res) => {
  const { email, motDePasse } = req.body;
  
  if (!email || !motDePasse) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM Candidat WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.idCandidat, 
        role: 'candidat',
        email: user.email,
        nom: user.nom,
        prenom: user.prenom
      }, 
      SECRET_KEY, 
      { expiresIn: '24h' }
    );

    // Retourner les infos utilisateur (sans le mot de passe)
    const userData = {
      id: user.idCandidat,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      etablissement: user.etablissement,
      domaine: user.domaine,
      niveau: user.niveau
    };

    res.json({ 
      token, 
      user: userData,
      expiresIn: 24 * 60 * 60 // 24 heures en secondes
    });
  } catch (err) {
    handleError(res, err, 'la connexion');
  } finally {
    if (connection) connection.release();
  }
});

// Soumettre une demande de stage
app.post(
  '/api/demande', 
  authenticateJWT('candidat'),
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'lettre', maxCount: 1 }
  ]),
  async (req, res) => {
    const { domaine, etablissement, niveau, description } = req.body;
    const idCandidat = req.user.id;

    if (!domaine || !etablissement || !niveau) {
      return res.status(400).json({ message: 'Domaine, établissement et niveau sont obligatoires' });
    }

    if (!req.files['cv'] || !req.files['lettre']) {
      return res.status(400).json({ message: 'CV et lettre de motivation sont obligatoires' });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      
      const cvPath = path.resolve(UPLOAD_DIR, path.basename(req.files['cv'][0].path));
      const lettrePath = path.resolve(UPLOAD_DIR, path.basename(req.files['lettre'][0].path)); 


      // Enregistrer la demande en base
      const [result] = await connection.query(
        `INSERT INTO DemandeStage (
          dateDepot, statut, fichiersCV, fichiersLettre, 
          idCandidat, domaine, etablissement, niveau, description
        ) VALUES (NOW(), 'En attente', ?, ?, ?, ?, ?, ?, ?)`,
        [
          cvPath, lettrePath, idCandidat, 
          domaine, etablissement, niveau, description || null
        ]
      ); 


      const idDemande = result.insertId;

      // Appeler le modèle ML en arrière-plan (ne pas bloquer la réponse)
      process.nextTick(async () => {
        let mlConnection;
        try {
          mlConnection = await pool.getConnection();
          const mlInput = JSON.stringify({
            domaine,
            cv_path: cvPath
          });

          execFile(
            'python', 
            [path.join(__dirname, 'ml', 'model.py'), mlInput],
            async (error, stdout, stderr) => {
              if (error) {
                console.error('Erreur modèle ML:', error, stderr);
                return;
              }

              try {
                const mlResult = JSON.parse(stdout);
                
                await mlConnection.query(
                  `UPDATE DemandeStage 
                   SET scoreML = ?, experienceML = ?, competencesML = ?
                   WHERE idDemande = ?`,
                  [
                    mlResult.score,
                    mlResult.experience,
                    mlResult.skills.join(','),
                    idDemande
                  ]
                );
              } catch (updateErr) {
                console.error('Erreur mise à jour ML:', updateErr);
              } finally {
                if (mlConnection) mlConnection.release();
              }
            }
          );
        } catch (err) {
          console.error('Erreur connexion ML:', err);
          if (mlConnection) mlConnection.release();
        }
      });

      res.status(201).json({ 
        message: 'Demande soumise avec succès. Analyse en cours...',
        idDemande
      });
    } catch (err) {
      handleError(res, err, 'la soumission de demande');
    } finally {
      if (connection) connection.release();
    }
  }  



);

// Fonction utilitaire sécurisée
function safeBasename(filePath) {
    try {
        return filePath ? path.basename(filePath) : null;
    } catch (error) {
        console.error("Erreur basename:", error);
        return null;
    }
}


// ✅ 1. Route pour récupérer les demandes d'un candidat
app.get('/api/candidat/demandes', authenticateJWT('candidat'), async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [demandes] = await connection.query(`
      SELECT 
        d.idDemande,
        d.dateDepot,
        d.statut,
        d.scoreML,
        d.decisionRH,
        d.motifRejet,
        d.fichiersCV,
        d.fichiersLettre,
        d.domaine,
        d.etablissement,
        d.niveau,
        d.experienceML,
        d.competencesML,
        d.description,
        c.nom,
        c.prenom,
        c.email,
        c.telephone
      FROM DemandeStage d
      JOIN Candidat c ON d.idCandidat = c.idCandidat
      WHERE d.idCandidat = ?
      ORDER BY d.dateDepot DESC
    `,
     [req.user.id]
    );

    const demandesWithUrls = demandes.map(d => ({
      ...d,
      cvUrl: d.fichiersCV ? `/uploads/${path.basename(d.fichiersCV)}` : null,
      lettreUrl: d.fichiersLettre ? `/uploads/${path.basename(d.fichiersLettre)}` : null,
      fichiersCV: undefined,
      fichiersLettre: undefined,
      competencesML: d.competencesML ? d.competencesML.split(',') : [],
      dateDepot: new Date(d.dateDepot).toISOString()
    }));

    res.json(demandesWithUrls);
  } catch (err) {
    handleError(res, err, 'la récupération des demandes');
  } finally {
    if (connection) connection.release();
  }
});

// ✅ 2. Route pour le profil candidat (avec sécurité sur les fichiers) 

app.get('/api/candidat/profil', authenticateJWT('candidat'), async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const [userRows] = await connection.query(
      'SELECT nom, prenom, email, telephone, adresse, etablissement, domaine, niveau FROM Candidat WHERE idCandidat = ?',
      [req.user.id]
    );

    if (!userRows.length) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const [demandeRows] = await connection.query(
      `SELECT fichiersCV, fichiersLettre 
       FROM DemandeStage 
       WHERE idCandidat = ? 
       ORDER BY dateDepot DESC 
       LIMIT 1`,
      [req.user.id]
    );

    const user = userRows[0];
    const demande = demandeRows[0] || {};

    res.json({
      success: true,
      data: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        adresse: user.adresse,
        etablissement: user.etablissement,
        domaine: user.domaine,
        niveau: user.niveau,
        fichiersCV: demande.fichiersCV || null,
        fichiersLettre: demande.fichiersLettre || null
      }
    });

  } catch (err) {
    console.error('Erreur profil:', err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) connection.release();
  } 
}); 

// ✅ Route pour modifier CV/lettre du candidat
app.put(
  '/api/candidat/profil/files',
  authenticateJWT('candidat'),
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'lettre', maxCount: 1 }
  ]),
  async (req, res) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.query(
        `SELECT idDemande FROM DemandeStage WHERE idCandidat = ? ORDER BY dateDepot DESC LIMIT 1`,
        [req.user.id]
      );

      if (!rows.length) return res.status(404).json({ message: 'Aucune demande' });

      const idDemande = rows[0].idDemande;
      const updates = [];
      const values = [];

      if (req.files['cv']) {
        updates.push('fichiersCV = ?');
        values.push(path.resolve(UPLOAD_DIR, path.basename(req.files['cv'][0].path)));
      }
      if (req.files['lettre']) {
        updates.push('fichiersLettre = ?');
        values.push(path.resolve(UPLOAD_DIR, path.basename(req.files['lettre'][0].path)));
      }

      if (updates.length) {
        values.push(idDemande);
        await connection.query(
          `UPDATE DemandeStage SET ${updates.join(', ')} WHERE idDemande = ?`,
          values
        );
      }

      res.json({ message: 'Fichiers mis à jour' }); 
      // ✅ Relancer l’analyse ML
    const [demande] = await connection.query(
      'SELECT domaine, fichiersCV FROM DemandeStage WHERE idDemande = ?',
      [idDemande]
    );

    const cvFile = demande[0].fichiersCV;
    const domaine = demande[0].domaine;

    execFile(
      'python',
      [path.join(__dirname, 'ml', 'model.py'), JSON.stringify({ domaine, cv_path: cvFile })],
      async (error, stdout, stderr) => {
        if (error) {
          console.error('Erreur ML:', error, stderr);
          return;
        }

        try {
          const mlResult = JSON.parse(stdout);
          await connection.query(
            `UPDATE DemandeStage 
            SET scoreML = ?, experienceML = ?, competencesML = ? 
            WHERE idDemande = ?`,
            [mlResult.score, mlResult.experience, mlResult.skills.join(','), idDemande]
          );
        } catch (err) {
          console.error('Erreur mise à jour ML:', err);
        }
      }
    );
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur' });
    } finally {
      if (connection) connection.release();
    }
  }
);

// Ajoutez cette fonction de debug
app.get('/api/debug/candidat/:id', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      'DESCRIBE Candidat'
    );
    console.log('Structure table Candidat:', rows);
    res.json({ structure: rows });
  } catch (err) {
    console.error(err);
    res.json({ error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// Ajoutez cette route temporaire pour diagnostiquer
app.get('/api/debug/database', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Liste toutes les tables
    const [tables] = await connection.query('SHOW TABLES');
    
    // Structure de chaque table
    const structure = {};
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [columns] = await connection.query(`DESCRIBE ${tableName}`);
      structure[tableName] = columns.map(c => ({
        field: c.Field,
        type: c.Type,
        null: c.Null,
        key: c.Key,
        default: c.Default
      }));
    }
    
    // Données de test
    const [candidatTest] = await connection.query(
      'SELECT idCandidat, nom, prenom, email FROM Candidat LIMIT 1'
    );
    
    res.json({
      tables: Object.keys(structure),
      structure,
      sampleData: candidatTest
    });
    
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      fullError: err 
    });
  } finally {
    if (connection) connection.release();
  }
});

// ✅ 3. Route pour modifier le profil candidat 

app.put('/api/candidat/profil', authenticateJWT('candidat'), async (req, res) => {
  const { telephone, adresse } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();

    const [demandes] = await connection.query(
      'SELECT COUNT(*) as count FROM DemandeStage WHERE idCandidat = ? AND statut = "En attente"',
      [req.user.id]
    );

    if (demandes[0].count === 0) {
      return res.status(403).json({ message: 'Modification non autorisée sans demandes en attente' });
    }

    await connection.query(
      'UPDATE Candidat SET telephone = ?, adresse = ? WHERE idCandidat = ?',
      [telephone || null, adresse || null, req.user.id]
    );

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (err) {
    handleError(res, err, 'la mise à jour du profil');
  } finally {
    if (connection) connection.release();
  }
});

// ✅ 4. Route pour le profil admin
app.get('/api/admin/profil', authenticateJWT('admin'), async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT nom, email FROM Administrateur WHERE idAdmin = ?',
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Administrateur non trouvé' });
    }

    const admin = rows[0];
    res.json({
      success: true,
      data: {
        nom: admin.nom || '',
        email: admin.email || ''
      }
    });
  } catch (err) {
    handleError(res, err, 'la récupération du profil admin');
  } finally {
    if (connection) connection.release();
  }
});

// Routes pour les administrateurs 

// Route directe vers l'espace admin

// ✅ Utilisation
// Dans ton navigateur, tape : http://localhost:3000/admin 

app.get('/admin', (req, res) => {
  // Vérifier si l'utilisateur est déjà connecté en vérifiant le token dans le localStorage
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    // Utilisateur connecté, afficher l'espace admin
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
  } else {
    // Utilisateur non connecté, afficher le formulaire de connexion
    res.send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Connexion Administrateur</title>
          <link rel="stylesheet" href="/style.css">
          <link rel="preconnect" href="https://fonts.googleapis.com    ">
          <link rel="preconnect" href="https://fonts.gstatic.com    " crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300    ;400;500;600;700&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css    ">
      </head>
      <body>
          <div class="auth-container">
              <div class="auth-background">
                  <div class="auth-overlay"></div>
              </div>
              <div class="auth-content">
                  <div class="auth-header">
                      <div class="auth-logo">
                          <i class="fas fa-graduation-cap"></i>
                      </div>
                      <h1 class="auth-title">SRM-SM</h1>
                      <p class="auth-subtitle">Administration</p>
                  </div>
                  <div class="forms-container">
                      <form id="formAdmin" class="auth-form active" enctype="multipart/form-data">
                          <div class="form-header">
                              <h2><i class="fas fa-user-shield"></i> Connexion Administrateur</h2>
                              <p>Accès réservé aux administrateurs</p>
                          </div>
                          <div class="form-group">
                              <label for="adminEmail"><i class="fas fa-envelope"></i> Email administrateur</label>
                              <input type="email" id="adminEmail" name="email" required>
                          </div>
                          <div class="form-group">
                              <label for="adminMotDePasse"><i class="fas fa-lock"></i> Mot de passe</label>
                              <input type="password" id="adminMotDePasse" name="motDePasse" required>
                          </div>
                          <button type="submit" class="submit-btn admin-btn">
                              <i class="fas fa-shield-alt"></i>
                              <span>Connexion Admin</span>
                              <div class="btn-loader hidden">
                                  <i class="fas fa-spinner fa-spin"></i>
                              </div>
                          </button>
                      </form>
                  </div>
              </div>
          </div>
          <script>
              document.getElementById('formAdmin').addEventListener('submit', async (e) => {
                  e.preventDefault();
                  const email = document.getElementById('adminEmail').value;
                  const motDePasse = document.getElementById('adminMotDePasse').value;

                  try {
                      const res = await fetch('/api/admin/login', {
                          method: 'POST',
                          headers: {'Content-Type': 'application/json'},
                          body: JSON.stringify({ email, motDePasse })
                      });
                      const data = await res.json();

                      if (data.token) {
                          localStorage.setItem('token', data.token);
                          localStorage.setItem('userType', 'admin');
                          localStorage.setItem('userData', JSON.stringify(data.admin));
                          window.location.href = '/'; // Rediriger vers l'espace admin
                      } else {
                          alert('Erreur de connexion: ' + data.message);
                      }
                  } catch (error) {
                      console.error('Erreur lors de la connexion:', error);
                      alert('Erreur de connexion. Veuillez réessayer.');
                  }
              });
          </script>
      </body>
      </html>
    `);
  }
});

// Connexion admin

app.post('/api/admin/login', async (req, res) => {
  const { email, motDePasse } = req.body;
  
  if (!email || !motDePasse) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [admins] = await connection.query(
      'SELECT * FROM Administrateur WHERE email = ?',
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const admin = admins[0];
    const passwordMatch = await bcrypt.compare(motDePasse, admin.motDePasse);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { 
        id: admin.idAdmin, 
        role: 'admin',
        email: admin.email,
        nom: admin.nom
      }, 
      SECRET_KEY, 
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      admin: {
        id: admin.idAdmin,
        nom: admin.nom,
        email: admin.email
      },
      expiresIn: 24 * 60 * 60 // 24 heures en secondes
    });
  } catch (err) {
    handleError(res, err, 'la connexion admin');
  } finally {
    if (connection) connection.release();
  }
});

// Route analytics pour l'admin  
app.get('/api/admin/analytics', authenticateJWT('admin'), async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // 📅 Génération des 12 derniers mois complets
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        mois_complet: date.toISOString().slice(0, 7),
        mois: date.toLocaleString('fr-FR', { month: 'short' }),
        year: date.getFullYear()
      });
    }

    // 🔍 Récupération des données existantes
    const [existingData] = await connection.query(`
      SELECT 
        DATE_FORMAT(dateDepot, '%Y-%m') as mois_complet,
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'Accepté' THEN 1 ELSE 0 END) as acceptes,
        SUM(CASE WHEN statut = 'Rejeté' THEN 1 ELSE 0 END) as rejetes,
        SUM(CASE WHEN statut = 'En attente' THEN 1 ELSE 0 END) as enAttente
      FROM DemandeStage
      WHERE dateDepot >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(dateDepot, '%Y-%m')
    `);

    // 🎯 Fusion avec les mois manquants
    const demandesParMois = months.map(month => {
      const existing = existingData.find(d => d.mois_complet === month.mois_complet);
      return {
        mois: month.mois,
        total: existing?.total || 0,
        acceptes: existing?.acceptes || 0,
        rejetes: existing?.rejetes || 0,
        enAttente: existing?.enAttente || 0
      };
    });

    // 📈 Taux par domaine
    const [tauxAcceptation] = await connection.query(`
      SELECT 
        domaine,
        COUNT(*) as total_demandes,
        SUM(CASE WHEN statut = 'Accepté' THEN 1 ELSE 0 END) as acceptes,
        ROUND((SUM(CASE WHEN statut = 'Accepté' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 0) as taux
      FROM DemandeStage
      GROUP BY domaine
      ORDER BY total_demandes DESC
    `);
    
    res.json({
      success: true,
      data: {
        demandesParMois,
        tauxAcceptation
      }
    });
  } catch (err) {
    console.error('Erreur analytics:', err);
    res.json({
      success: true,
      data: {
        demandesParMois: this.getFullYearData(),
        tauxAcceptation: []
      }
    });
  } finally {
    if (connection) connection.release();
  }
});

// Lister toutes les demandes (admin) 
app.get('/api/admin/demandes', authenticateJWT('admin'), async (req, res) => {
  let connection;
  try {
    const { statut, domaine, search, page = 1 } = req.query; // Ajout de search
    const limit = 999999999; // Affiche toutes les demandes
    const offset = (page - 1) * limit;
    
    connection = await pool.getConnection();
    
    let query = `
      SELECT 
        d.idDemande, d.dateDepot, d.statut, d.scoreML, d.decisionRH, d.motifRejet,
        d.fichiersCV, d.fichiersLettre, d.domaine, d.etablissement, d.niveau,
        d.experienceML, d.competencesML, d.description,
        c.idCandidat, c.nom, c.prenom, c.email, c.telephone
      FROM DemandeStage d
      JOIN Candidat c ON d.idCandidat = c.idCandidat
    `;

    const params = [];
    const conditions = [];
    
    if (statut) {
      conditions.push('d.statut = ?');
      params.push(statut);
    }
    
    if (domaine) {
      conditions.push('d.domaine = ?');
      params.push(domaine);
    }

    if (search) { // Ajout de la condition de recherche
      conditions.push('(c.nom LIKE ? OR c.prenom LIKE ? OR c.email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY d.dateDepot DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [demandes] = await connection.query(query, params); 

    // Requête pour le total
    const [total] = await connection.query(
      `SELECT COUNT(*) as total FROM DemandeStage d 
       JOIN Candidat c ON d.idCandidat = c.idCandidat 
       ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}`,
      params.slice(0, -2)
    ); 

    const demandesWithUrls = demandes.map(d => ({
      ...d,
      cvUrl: `/uploads/${path.basename(d.fichiersCV)}`,
      lettreUrl: `/uploads/${path.basename(d.fichiersLettre)}`,
      fichiersCV: undefined,
      fichiersLettre: undefined,
      competencesML: d.competencesML ? d.competencesML.split(',') : [],
      dateDepot: new Date(d.dateDepot).toISOString()
    }));

    res.json({
      demandes: demandesWithUrls,
      pagination: {
        total: total[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total[0].total / limit)
      }
    });
  } catch (err) {
    handleError(res, err, 'la récupération des demandes admin');
  } finally {
    if (connection) connection.release();
  }
});

app.put('/api/admin/demandes/:id', authenticateJWT('admin'), async (req, res) => {
  const { id } = req.params;
  const { decisionRH, motifRejet } = req.body;

  if (!decisionRH || !['Accepté', 'Rejeté', 'En attente'].includes(decisionRH)) {
    return res.status(400).json({ message: 'Décision invalide' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Récupérer les infos du candidat et de la demande
    const [rows] = await connection.query(`
      SELECT c.email, c.prenom, c.nom, d.domaine
      FROM DemandeStage d
      JOIN Candidat c ON d.idCandidat = c.idCandidat
      WHERE d.idDemande = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    const { email, prenom, nom, domaine } = rows[0];

    // Mettre à jour la demande
    await connection.query(
      `UPDATE DemandeStage 
       SET decisionRH = ?, statut = ?, motifRejet = ?
       WHERE idDemande = ?`,
      [decisionRH, decisionRH, motifRejet || null, id]
    );

    // ✅ Envoyer l'e-mail
    const subject = decisionRH === 'Accepté' 
      ? `✅ Demande de stage acceptée - ${domaine}`
      : `❌ Demande de stage refusée - ${domaine}`;

    const message = `
Bonjour ${prenom} ${nom},

Votre demande de stage dans le domaine **${domaine}** a été **${decisionRH.toLowerCase()}**.

${
  decisionRH === 'Rejeté' && motifRejet
    ? `Motif : ${motifRejet}`
    : ''
}

Merci de votre intérêt.

Cordialement,  
L'équipe SRM-SM
    `;

    await transporter.sendMail({
      from: '"SRM-SM" <votre.email@gmail.com>',
      to: email,
      subject,
      text: message
    });

    res.json({ message: 'Décision mise à jour et e-mail envoyé' });
  } catch (err) {
    handleError(res, err, 'la mise à jour de la demande');
  } finally {
    if (connection) connection.release();
  }
});


// 📩 Route : Envoyer un message (admin ou candidat)
app.post('/api/messages', authenticateJWT(), async (req, res) => {
    const { idDemande, message } = req.body;
    const idExpediteur = req.user.id;
    const roleExpediteur = req.user.role;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO Messages (idDemande, idExpediteur, roleExpediteur, message)
             VALUES (?, ?, ?, ?)`,
            [idDemande, idExpediteur, roleExpediteur, message]
        );
        res.json({ success: true, message: 'Message envoyé' });
    } catch (err) {
        handleError(res, err, 'l’envoi du message');
    } finally {
        if (connection) connection.release();
    }
}); 

app.get('/api/messages/:idDemande', authenticateJWT(), async (req, res) => {
    const { idDemande } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let connection;
    try {
        connection = await pool.getConnection();

        // Vérification de l'accès
        if (userRole === 'candidat') {
            const [check] = await connection.query(
                'SELECT idCandidat FROM DemandeStage WHERE idDemande = ?',
                [idDemande]
            );
            if (!check.length || check[0].idCandidat !== userId) {
                return res.status(403).json({ message: 'Accès non autorisé' });
            }
        }

        // Correction de la jointure et sélection des champs
        const [messages] = await connection.query(`
            SELECT 
                m.idMessage,
                m.idDemande,
                m.idExpediteur,
                m.roleExpediteur,
                m.message,
                m.dateEnvoi,
                CASE 
                    WHEN m.roleExpediteur = 'admin' THEN 'Admin SRM-SM'
                    ELSE COALESCE(c.prenom, c.nom)
                END as nom,
                CASE 
                    WHEN m.roleExpediteur = 'admin' THEN ''
                    ELSE COALESCE(c.prenom, '')
                END as prenom
            FROM Messages m
            LEFT JOIN Candidat c ON m.idExpediteur = c.idCandidat 
            LEFT JOIN Administrateur a ON m.idExpediteur = a.idAdmin
            WHERE m.idDemande = ?
            ORDER BY m.dateEnvoi ASC
        `, [idDemande]);

        // Transformation des données
        const formattedMessages = messages.map(msg => ({
            ...msg,
            roleExpediteur: msg.roleExpediteur || (msg.idExpediteur === userId ? userRole : 'admin'),
            nom: msg.nom || (msg.roleExpediteur === 'admin' ? 'Admin' : 'Candidat'),
            dateEnvoi: new Date(msg.dateEnvoi).toISOString()
        }));

        res.json({ success: true, messages: formattedMessages });
    } catch (err) {
        handleError(res, err, 'la récupération des messages');
    } finally {
        if (connection) connection.release();
    }
});

// Dans votre serveur (server.js)
app.get('/api/admin/demandes/with-messages', authenticateJWT('admin'), async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const [demandes] = await connection.query(`
            SELECT DISTINCT 
                d.idDemande,
                d.dateDepot,
                d.statut,
                d.domaine,
                d.niveau,
                d.description,
                c.nom as candidat_prenom,
                c.prenom as candidat_nom,
                c.email as candidat_email,
                c.telephone as candidat_telephone,
                d.fichiersCV,
                d.fichiersLettre
            FROM DemandeStage d
            JOIN Candidat c ON d.idCandidat = c.idCandidat
            WHERE EXISTS (
                SELECT 1 FROM Messages m WHERE m.idDemande = d.idDemande
            )
            ORDER BY d.dateDepot DESC
        `); 

        const demandesWithUrls = demandes.map(d => ({
            ...d,
            cvUrl: d.fichiersCV ? `/uploads/${path.basename(d.fichiersCV)}` : null,
            lettreUrl: d.fichiersLettre ? `/uploads/${path.basename(d.fichiersLettre)}` : null,
            dateDepot: new Date(d.dateDepot).toISOString()
        }));

        res.json({ success: true, data: demandesWithUrls });
    } catch (err) {
        handleError(res, err, 'la récupération des demandes avec messages');
    } finally {
        if (connection) connection.release();
    }
});
      

// Télécharger un fichier
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOAD_DIR, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'Fichier non trouvé' });
  }
});



// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend'))); 

app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

// Route pour servir l'application frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Endpoint de vérification de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'gestion_stages',
    version: '1.0.0'
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Erreur de fichier: ${err.message}` });
  }
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Une erreur est survenue';
  
  res.status(statusCode).json({ message });
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur SRM-SM démarré sur http://localhost:${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Dossier uploads: ${UPLOAD_DIR}`);
  console.log(`🗄️  Base de données: ${dbConfig.database}`);
});


// Gestion des arrêts propres
process.on('SIGTERM', () => {
  console.log('Fermeture du serveur...');
  pool.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Arrêt par Ctrl+C...');
  pool.end();
  process.exit(0);
}); 

