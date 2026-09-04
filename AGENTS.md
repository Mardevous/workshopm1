# AGENTS.md

## Présentation du projet

Fassil est une application web développée dans le cadre du Workshop M1
Développeur Full Stack de MyDigitalSchool.

L'application est destinée à un monteur vidéo exerçant à la fois comme
intermittent du spectacle et comme freelance.

Elle permet de centraliser la gestion de ses missions, de suivre son activité,
de gérer ses documents et de présenter ses projets dans un portfolio.

## Stack technique

### Frontend

- React
- Vite
- JavaScript
- Axios
- React Router
- FullCalendar

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer

## Architecture

Le projet est séparé en deux applications principales :

- `/frontend` : application React/Vite
- `/backend` : API REST Node.js/Express

La documentation du projet se trouve dans :

- `/docs`

## Fonctionnalités principales

L'application comporte cinq fonctionnalités principales :

1. Authentification
2. Gestion des missions
3. Calendrier et tableau de bord
4. Gestion des documents
5. Portfolio

Un module différenciant permet également de générer un PDF
récapitulatif à partir des données d'une mission.

## Missions

Une mission peut être de type :

- `intermittence`
- `freelance`

Les statuts disponibles sont :

- `proposee`
- `confirmee`
- `terminee`

Les missions d'intermittence contiennent notamment des heures et
éventuellement des cachets.

Les missions freelance contiennent notamment un montant HT et un
nombre de jours.

## Règles métier importantes

- Le seuil d'intermittence par défaut est de 507 heures.
- Le seuil doit être configurable et ne doit pas être codé en dur.
- Le nombre d'heures par journée type est configurable.
- Le calcul des heures d'intermittence s'effectue sur 12 mois glissants.
- Seules les missions confirmées ou terminées doivent être prises en compte
  dans les indicateurs concernés.
- Une mission peut posséder plusieurs documents.
- Un document peut également être global et ne pas être associé à une mission.
- Les chevauchements entre missions sont autorisés.

## Authentification

L'application est mono-utilisateur.

Toutes les données métier doivent être protégées par authentification.

Le backend utilise JWT pour l'authentification.

Les routes protégées utilisent le middleware d'authentification.

Ne jamais :

- exposer `JWT_SECRET` ;
- exposer `MONGODB_URI` ;
- ajouter les fichiers `.env` au dépôt Git ;
- contourner le middleware d'authentification pour une route métier.

## Variables d'environnement

### Backend

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`

### Frontend

- `VITE_API_URL`

Les secrets et valeurs de production ne doivent jamais être écrits
directement dans le code source.

## API

L'API utilise le préfixe :

`/api`

Les principales ressources sont :

- `/api/auth`
- `/api/missions`
- `/api/dashboard`
- `/api/documents`
- `/api/portfolio`

## Conventions de développement

Lors d'une modification :

1. Respecter l'architecture existante.
2. Éviter de dupliquer de la logique métier.
3. Conserver les noms de champs utilisés par les modèles Mongoose.
4. Vérifier les impacts frontend et backend lors d'une modification d'API.
5. Gérer les erreurs côté API.
6. Ne jamais ajouter de secrets dans le code.
7. Tester les fonctionnalités concernées avant de valider une modification.

## Contraintes du projet

Le périmètre du projet n'inclut pas :

- la comptabilité complète ;
- la facturation complète ;
- l'intégration France Travail ;
- une application mobile native ;
- la gestion multi-utilisateur ;
- le montage ou transcodage vidéo ;
- l'intégration Google Calendar.

Les nouvelles fonctionnalités doivent rester compatibles avec le périmètre
défini dans le Workshop.

## Avant de modifier le projet

Avant toute modification importante :

1. Identifier les fichiers concernés.
2. Vérifier les modèles Mongoose existants.
3. Vérifier les routes et contrôleurs existants.
4. Vérifier les services utilisés côté frontend.
5. Éviter de modifier une API existante sans adapter le frontend correspondant.
6. Vérifier que le projet fonctionne après modification.