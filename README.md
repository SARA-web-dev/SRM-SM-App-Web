# SRM-SM-App-Web 
SRM-SM | Plateforme de Gestion de Stages
Une application web moderne pour la gestion intelligente des demandes de stage avec
analyse par intelligence artificielle.
🚀 Fonctionnalités
Pour les Candidats
- ✅ Se connecter,inscription et authentification sécurisée
- ✅ Soumission de demandes de stage avec CV et lettre de motivation
- ✅ Suivi en temps réel du statut des demandes
- ✅ Analyse automatique des compétences par IA
- ✅ Envoyer un message
- ✅ Modifier / Annuler demande
- ✅ Voir ses notifications et ses emails
- ✅ Interface responsive et moderne
Pour les Administrateurs
- ✅ Dashboard de gestion des demandes
- ✅ Filtrage et recherche avancée
- ✅ Prise de décision (accepter/rejeter)
- ✅ Visualisation des scores ML
- ✅ Export des données
Intelligence Artificielle
- 🤖 Analyse automatique des CV (extraction de texte PDF)
- 🎯 Classification par domaine de compétences
- 📊 Calcul de score de compatibilité
- 🔍 Détection automatique des compétences
- ⏱️ Estimation de l'expérience professionnelle
🏗 Architecture
```
- ✅ Statistiques en temps réel
- ✅ Ajouter commentaire
- ✅ Voir ses notifications
- ✅ Envoyer un message
SRM-SM_Stage_App/
├── database/
│ └── gestion_stages.sql # Base de données MySQL
├── backend/
│ ├── server.js # API Express.js
│ ├── package.json # Dépendances Node.js
│ ├──ml/│ └── model.py # Modèle d'IA Python
│ └── uploads # Upload de fichiers
└──
frontend/
├── index.html # Interface utilisateur
├── style.css # Styles CSS modernes
└──
script.js # Logique JavaScript
```
🛠 Technologies Utilisées
Backend
- **Node.js** + **Express.js** - API REST
- **MySQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **Multer** - Upload de fichiers
- **bcrypt** - Hachage des mots de passe
Frontend
- **HTML5** + **CSS3** + **JavaScript ES6+**
- **CSS Grid** + **Flexbox** - Layout responsive
- **Font Awesome** - Icônes
- **Fetch API** - Communication avec l'API
Intelligence Artificielle
- **Python 3.8+**
- **scikit-learn** - Machine Learning
- **pdfminer.six** - Extraction de texte PDF
- **NLTK** - Traitement du langage naturel
- **TF-IDF** + **Naive Bayes** - Classification
📋 Prérequis
- **Node.js** 14.0+
- **Python** 3.8+
- **MySQL** 5.7+
- **npm** ou **yarn**
🚀 Installation
1. Cloner le projet
```bash
git clone <repository-url>
cd SRM-SM_Stage_App
```
2. Configuration de la base de données
```bash
Importer le schéma MySQLmysql -u root -p < database/gestion_stages.sql
```
3. Installation du backend
```bash
cd backend
npm install
Installer les dépendances Python
pip install pdfminer.six==20221105 nltk==3.8.1 scikit-learn==1.3.2 python-dateutil==2.8.2
```
4. Configuration des variables d'environnement
```bash
# Créer un fichier .env dans le dossier backend
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gestion_stages
SECRET_KEY=your_secret_key
PORT=3000
```
5. Démarrage de l'application
```bash
# Démarrer le serveur backend
cd backend
npm start
node server.js
Le frontend est servi automatiquement sur http://localhost:3000
```
📊 Accéder à l'interface d'administration :
Ouvrez votre navigateur et accédez à http://localhost:3000/admin.
Utilisez les identifiants d'un compte administrateur pour vous connecter. Les identifiants par
défaut sont :
Email : admin@srm-sm.ma
Mot de passe : admin123
Email
Email 'asrmsm1@gmail.com', 
envoi automatiquement par candidat après décision de l’admin
📊 Base de Données
Tables principales
- **Candidat** - Informations des candidats- **Administrateur** - Comptes administrateurs
- **DemandeStage** - Demandes de stage avec métadonnées ML
-**Messages**-Contacte entre candidat et admin
🔒 Fonctionnalités de sécurité
- Mots de passe sécurisés et hachés avec bcrypt
- Authentification JWT
- Validation des données côté serveur
- Protection contre les injections SQL
🤖 Modèle d'Intelligence Artificielle
Fonctionnalités ML
1. **Extraction de texte** - Lecture automatique des CV PDF
2. **Classification de domaine** - Identification du domaine de compétences
3. **Analyse des compétences** - Détection des technologies et outils
4. **Calcul d'expérience** - Estimation des années d'expérience
5. **Score de compatibilité** - Évaluation globale du profil
Domaines supportés
- Informatique / réseaux et télécoms
- Gestion (Finance/Compta/Marketing/Fiscalité/Commerce)
- Électricité et électromécanique
- Génie Civil
- Logistique et transport
- Ressources humaines
🎨 Interface Utilisateur
### Design moderne
- Interface responsive (mobile-first)
- Animations fluides et micro-interactions
- Palette de couleurs professionnelle
- Composants réutilisables
- Accessibilité optimisée
### Fonctionnalités UX
- Upload par glisser-déposer
- Feedback visuel en temps réel
- Messages toast informatifs
- Chargement progressif
- Navigation intuitive
🔒 Sécurité
- Authentification JWT sécurisée
- Validation des fichiers uploadés
- Protection CORS configurée- Hachage des mots de passe
- Validation des données d'entrée
- Gestion des erreurs robuste
📈 Performance
- Optimisation des requêtes SQL
- Compression des assets
- Lazy loading des données
- Cache côté client
- Debounce pour les recherches
🧪 Tests
```bash
# Tests backend
cd backend
npm test
# Tests du modèle ML
cd backend/ml
python -m pytest test_model.py
```
📝 API Endpoints
### Authentification
- `POST /api/candidat/inscription` - Inscription candidat
- `POST /api/candidat/login` - Connexion candidat
- `POST /api/admin/login` - Connexion admin
### Demandes
- `POST /api/demande` - Soumettre une demande
- `GET /api/candidat/demandes` - Demandes du candidat
- `GET /api/admin/demandes` - Toutes les demandes (admin)
- `PUT /api/admin/demandes/:id` - Mettre à jour une décision
### Fichiers
- `GET /uploads/:filename` - Télécharger un fichier
👥 Équipe
- **Développement** - Équipe SRM-SM
- **Design** - Interface moderne et responsive
- **IA/ML** - Modèle de classification intelligent
---**SRM-SM** - Plateforme Intelligente de Gestion de Stages 🎓
