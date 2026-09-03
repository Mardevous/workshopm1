# Fassil

# Workshop M1 – Outil de gestion pour monteur vidéo intermittent/freelance

Projet réalisé dans le cadre du **Workshop client** – MBA Développeur Full Stack, M1 DFS, MyDigitalSchool.

## Installation et lancement en local

### Prérequis

- Node.js
- npm
- Git
- MongoDB

### 1. Cloner le dépôt

```bash
git clone https://github.com/Mardevous/workshopm1.git
cd workshopm1
```

### 2. Installer les dépendances

```bash
npm install
npm run install:all
```

### 3. Configurer les variables d'environnement

Créer `/backend/.env` :

```env
PORT=5000
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_cle_secrete
```

Créer `/frontend/.env` :

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Lancer l'application

Depuis la racine :

```bash
npm run dev
```

Cette commande démarre simultanément le backend Express et le frontend React/Vite.

## L'objectif de l'application

L'application a pour objectif d'aider un monteur vidéo exerçant à la fois sous le régime de l'intermittence du spectacle et en freelance à centraliser et suivre son activité professionnelle. L'idée est de distinguer dès le premier coup d'œil les heures d'intermittence des projets freelance à travers plusieurs éléments pris en compte: 
- suivre ses missions (intermittence et freelance) sur un calendrier et une liste filtrable ;
- visualiser en un coup d'œil ses heures d'intermittence cumulées sur 12 mois glissants (avec seuil configurable), son CA freelance et la répartition de son temps entre les deux régimes ;
- centraliser et retrouver ses documents (contrats, attestations, devis, factures) par mission ou par catégorie ;
- valoriser son travail via un portfolio de projets (lien vidéo intégré) ;
- se connecter de façon sécurisée à son espace personnel (mono-utilisateur).

**Module différenciant** : génération PDF d'un devis ou d'un récapitulatif de mission à partir des données saisies. La fonctionnalité est dans la page mission. Sur la ligne d'une mission, on a un bouton permettant de générer un PDF récapitulatif de la mission.

## Stack technique

| Côté | Techno |
|---|---|
| Frontend | React + Vite, Axios, FullCalendar |
| Backend | Node.js, Express|
| Base de données | MongoDB (Mongoose) |
| Authentification | JWT + bcrypt |
| Upload de fichiers | Multer (stockage disque serveur) |

Le choix d'une stack JavaScript permet de partager le format JSON entre le front et l'API, d'itérer rapidement sur les modèles de données (missions, documents, projets) et de rester dans un écosystème que toute l'équipe maîtrise, ce qui est déterminant sur un format de 4,5 jours.

## Structure du dépôt

```
workshopm1/
├── backend/              # API REST Express
│   ├── controllers/      # Logique métier (missions, auth, dashboard, documents, portfolio)
│   ├── models/           # Schémas Mongoose (Mission, User, Document, PortfolioProject, Configuration)
│   ├── routes/           # Déclaration des routes Express
│   ├── middleware/        # authMiddleware (vérification du JWT)
│   ├── uploads/           # Fichiers déposés par les utilisateurs (documents, PDF générés)
│   └── server.js          # Point d'entrée de l'API
├── frontend/             # Application React
│   └── src/
│       ├── pages/         # Login, Dashboard, Missions, Calendar, Documents, Portfolio
│       ├── components/    # Composants réutilisables (ex. ProtectedRoute)
│       └── services/       # Client Axios (services/api.js)
└── docs/                 # Dossier technique (note de cadrage, specs, guide de reprise, roadmap)
```

## Lancement de l'application

Après avoir installé les dépendances et configuré les variables
d'environnement, le frontend et le backend peuvent être lancés
simultanément depuis la racine du projet :

```bash
npm run dev
```

## Variables d'environnement

| Variable | Emplacement | Description |
|---|---|---|
| `PORT` | backend | Port d'écoute de l'API (5000 par défaut) |
| `MONGODB_URI` | backend | URI de connexion à la base MongoDB |
| `JWT_SECRET` | backend | Clé secrète utilisée pour signer les tokens JWT |
| `VITE_API_URL` | frontend | URL de base de l'API consommée par le frontend |

## Application déployée du nom de Fassil

- **Frontend** : [workshopm1.vercel.app](https://workshopm1.vercel.app/) (Vercel)
- **Backend** :  [workshopm1-1sbk](https://workshopm1-1sbk.onrender.com/) (Render)
- **Base de données** : MongoDB Atlas

**Compte de démonstration** :
- Email : `demo@workshop.fr`
- Mot de passe : `Demo1234!`

## Principales routes de l'API

Toutes les routes (hors `/api/auth/login`) nécessitent un header `Authorization: Bearer <token>`.

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Connexion et récupération d'un token JWT |
| GET / POST | `/api/missions` | Lister / créer une mission |
| GET / PATCH / DELETE | `/api/missions/:id` | Détail / modifier / supprimer une mission |
| GET | `/api/dashboard` | Indicateurs : heures d'intermittence sur 12 mois glissants, seuil, CA freelance par mois, répartition du temps |
| GET / POST | `/api/documents` | Lister / déposer un document |
| GET / POST | `/api/portfolio` | Lister / créer un projet du portfolio |

Le seuil d'heures (507 h par défaut) et le nombre d'heures par jour type (8 h par défaut) sont stockés dans la collection `Configuration`, et non codés en dur, conformément aux règles métier du brief.

## Documentation

documents --> 
- 1 Note de cadrage
- 2 Spécifications fonctionnelles
- 3 Spécification techniques
- 4 Guide reprise.md
- 5 roadmap.md

## Équipe

- Andréa – [@Mardevous](https://github.com/Mardevous)
- Xinshen – [@zhengxs3](https://github.com/zhengxs3)
