# Fassil

# Workshop M1 – Outil de gestion pour monteur vidéo intermittent/freelance

Projet réalisé dans le cadre du **Workshop client 2** – MBA Développeur Full Stack, M1 DFS, MyDigitalSchool (31 août – 4 septembre 2026).

## Le besoin

Le client est monteur vidéo, à la fois **intermittent du spectacle** et **freelance**. Il avance dans le flou : il ne sait pas précisément où il en est de ses heures d'intermittence, retrouve difficilement ses documents (contrats, attestations, factures), et ses projets vidéo dorment sur un disque dur sans qu'il puisse les montrer facilement.

Cet outil lui permet de :
- suivre ses missions (intermittence et freelance) sur un calendrier et une liste filtrable ;
- visualiser en un coup d'œil ses heures d'intermittence cumulées sur 12 mois glissants (avec seuil configurable), son CA freelance et la répartition de son temps entre les deux régimes ;
- centraliser et retrouver ses documents (contrats, attestations, devis, factures) par mission ou par catégorie ;
- valoriser son travail via un portfolio de projets (lien vidéo intégré) ;
- se connecter de façon sécurisée à son espace personnel (mono-utilisateur).

**Module différenciant** : génération PDF d'un devis ou d'un récapitulatif de mission à partir des données saisies.

## Stack technique

| Côté | Techno |
|---|---|
| Frontend | React 19 + Vite, React Router, Axios, FullCalendar |
| Backend | Node.js, Express 5 |
| Base de données | MongoDB (Mongoose) |
| Authentification | JWT + bcrypt |
| Upload de fichiers | Multer (stockage disque serveur) |

Le choix d'une stack JavaScript de bout en bout (React/Express/MongoDB) permet de partager le format JSON entre le front et l'API, d'itérer rapidement sur les modèles de données (missions, documents, projets) et de rester dans un écosystème que toute l'équipe maîtrise, ce qui est déterminant sur un format de 4,5 jours.

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

## Lancer le projet en local

### Prérequis
- Node.js ≥ 18
- Une base MongoDB accessible (locale ou MongoDB Atlas)

### 1. Cloner le dépôt

```bash
git clone https://github.com/Mardevous/workshopm1.git
cd workshopm1
```

### 2. Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` à la racine de `backend/` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/workshopm1
JWT_SECRET=une_valeur_secrete_a_generer
```

Lancer le serveur :

```bash
npm run dev
```

L'API démarre sur `http://localhost:5000`.

### 3. Frontend

Dans un second terminal :

```bash
cd frontend
npm install
```

Créer un fichier `.env` à la racine de `frontend/` :

```env
VITE_API_URL=http://localhost:5000
```

Lancer l'application :

```bash
npm run dev
```

Le frontend est accessible sur `http://localhost:5173`.

> Le projet ne dispose pas encore d'une configuration Docker unique pour lancer front et back en une seule commande : deux terminaux sont nécessaires, comme décrit ci-dessus.

## Variables d'environnement

| Variable | Emplacement | Description |
|---|---|---|
| `PORT` | backend | Port d'écoute de l'API (5000 par défaut) |
| `MONGODB_URI` | backend | URI de connexion à la base MongoDB |
| `JWT_SECRET` | backend | Clé secrète utilisée pour signer les tokens JWT |
| `VITE_API_URL` | frontend | URL de base de l'API consommée par le frontend |

## Application déployée du nom de Fassil

- **Frontend** : [workshopm1.vercel.app](https://workshopm1.vercel.app/) (Vercel)
- **Backend** : hébergé sur Render
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

Le dossier technique complet (note de cadrage, spécifications fonctionnelles et techniques, guide de reprise, roadmap) se trouve dans `/docs`, rédigé en Markdown et exporté en PDF.

## Équipe

- Andréa – [@Mardevous](https://github.com/Mardevous)
- Xinshen – [@zhengxs3](https://github.com/zhengxs3)

## Contexte pédagogique

Projet réalisé en laboratoire, sans garantie de perfection : l'objectif est un socle fonctionnel, déployé, compréhensible et reprenable par une personne n'ayant pas travaillé dessus — notamment par le client lui-même, seul ou avec l'aide d'outils d'IA.
