# 🚀 Star Wars Rebels Alliance Search System

<div align="center">

![Star Wars](https://img.shields.io/badge/Star%20Wars-FFE81F?style=for-the-badge&logo=starwars&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Hapi](https://img.shields.io/badge/Hapi-FF6B35?style=for-the-badge&logo=hapi&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Interface de recherche pour l'Alliance Rebelle permettant d'explorer les archives secrètes de l'Empire**

*Test technique réalisé pour Fastory*

[🚀 Demo Live](#) • [📖 Documentation](#installation) • [🛠️ Installation](#installation)

</div>

---

## 📋 Présentation du Projet

Bienvenue dans le système de recherche de l'Alliance Rebelle ! Ce projet a été développé dans le cadre du test technique Fastory pour créer une interface permettant aux rebelles d'explorer la base de données secrète de l'Empire.

### 🎯 Mission Accomplie

L'un de nos espions a donné sa vie pour nous permettre d'accéder aux informations de l'Empire via l'API SWAPI. Ce système permet maintenant à l'Alliance Rebelle de rechercher efficacement dans toutes les archives impériales.

## ✨ Fonctionnalités

### 🔥 Fonctionnalités Principales
- 🔍 **Recherche intelligente** avec debounce (500ms)
- 📊 **Chargement automatique** des données au démarrage
- 🎨 **Interface Star Wars** immersive avec animations
- 📱 **Design responsive** adaptatif
- 🔐 **Système d'authentification** pour les membres de l'Alliance
- 🎛️ **Filtres par catégorie** (Personnages, Planètes, Films, etc.)
- 📄 **Fiches détaillées** pour chaque élément

### 🌟 Expérience Utilisateur
- **Thème sombre** avec fond étoilé animé
- **Effets visuels** modernes (glassmorphism, gradients)
- **Icônes spécialisées** pour chaque catégorie
- **Transitions fluides** et interactions hover
- **États de chargement** avec indicateurs visuels

## 🏗️ Architecture

```
star-wars-rebels-search/
├── 🔧 rebels-backend/          # API Node.js + Hapi
│   ├── server.js              # Serveur principal avec endpoints
│   ├── package.json           # Dépendances backend
│   └── README.md              # Documentation API
├── ⚛️ star-wars-frontend/      # Application React
│   ├── src/
│   │   ├── components/
│   │   │   └── StarWarsApp.jsx # Composant principal
│   │   ├── App.js             # Point d'entrée React
│   │   └── index.css          # Styles globaux
│   ├── public/
│   │   └── index.html         # Template HTML avec Tailwind CDN
│   └── package.json           # Dépendances frontend
└── 📖 README.md               # Documentation complète
```

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Hapi.js** - Framework web robuste
- **Axios** - Client HTTP pour SWAPI
- **SWAPI** (swapi.tech) - API Star Wars

### Frontend
- **React** - Bibliothèque UI avec hooks
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes modernes
- **Debounce** - Optimisation des recherches

## 🚀 Installation et Lancement

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn
- Git

### 1️⃣ Cloner le Projet
```bash
git clone https://github.com/Abishan13/star-wars-rebels-fastory.git
cd star-wars-rebels-fastory
```

### 2️⃣ Lancer le Backend (Port 3001)
```bash
cd rebels-backend
npm install
npm start
```

Le backend sera accessible sur http://localhost:3001

### 3️⃣ Lancer le Frontend (Port 3000)
```bash
# Dans un nouveau terminal
cd star-wars-frontend
npm install
npm start
```

L'application sera accessible sur http://localhost:3000

## 🌐 Endpoints API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/` | GET | Documentation de l'API |
| `/search?q={query}` | GET | Recherche globale dans toutes les catégories |
| `/search?q={query}&auth={base64}` | GET | Recherche avec authentification |
| `/auth/search` | POST | Recherche authentifiée (JSON) |
| `/{category}/{id}` | GET | Récupération d'un élément spécifique |
| `/categories` | GET | Liste des catégories disponibles |
| `/health` | GET | Status de santé de l'API |

## 🔐 Authentification

Pour accéder aux données classifiées de l'Alliance :

- **Username**: `Luke`
- **Password**: `DadSucks`

L'authentification peut se faire via :
- Interface utilisateur (modal)
- Paramètre URL (`?auth=base64`)
- Endpoint POST `/auth/search`

## 🎮 Guide d'Utilisation

### 1. Démarrage
Au lancement, l'application charge automatiquement une sélection d'éléments de toutes les catégories.

### 2. Recherche
- Tapez au moins 2 caractères dans la barre de recherche
- Les résultats s'affichent en temps réel avec debounce
- Videz la recherche pour revenir à l'affichage complet

### 3. Filtres
- Cliquez sur "Filtres" pour voir les catégories
- Sélectionnez une catégorie pour filtrer les résultats
- "Tout" affiche tous les éléments

### 4. Navigation
- Cliquez sur une carte pour voir les détails
- Utilisez "Retour aux résultats" pour revenir

### 5. Authentification
- Cliquez sur "Authentification" dans le header
- Connectez-vous avec Luke/DadSucks pour accéder aux données premium

## 📊 Catégories Disponibles

| Catégorie | Description | Icône |
|-----------|-------------|-------|
| 👥 **People** | Personnages de l'univers Star Wars | Users |
| 🌍 **Planets** | Planètes et mondes | Globe |
| 🎬 **Films** | Films de la saga | Film |
| 👽 **Species** | Espèces extraterrestres | Star |
| 🚗 **Vehicles** | Véhicules terrestres | Zap |
| 🚀 **Starships** | Vaisseaux spatiaux | Rocket |

## 🎯 Réalisations du Test Technique

### ✅ Étape 1 - Backend (Obligatoire)
- [x] Création d'un back-end Node.js
- [x] Récupération des données SWAPI
- [x] Endpoint de recherche sur toutes les catégories
- [x] API adaptée aux besoins du frontend

### ✅ Étape 1 - Backend (Optionnel)
- [x] Système d'authentification Luke/DadSucks
- [x] Utilisation d'Hapi.js
- [x] Gestion d'erreurs robuste
- [x] Documentation complète des endpoints

### ✅ Étape 2 - Frontend (Obligatoire)
- [x] Interface React moderne
- [x] Champ de recherche fonctionnel
- [x] Affichage en liste des résultats
- [x] Fiches détaillées avec informations de base

### ✅ Étape 2 - Frontend (Optionnel)
- [x] Fiches ultra détaillées
- [x] Affichage différencié par type de données
- [x] Système de filtres par catégorie
- [x] Authentification avec l'API
- [x] Design immersif Star Wars
- [x] Debounce pour optimiser les recherches
- [x] Architecture fonctionnelle et immutable

## 🚀 Optimisations Techniques

### Performance
- **Debounce de recherche** : Évite les appels API excessifs
- **Stratégie de chargement intelligent** : 6 requêtes maximum au démarrage
- **Déduplication** : Évite les doublons dans les résultats
- **Gestion d'erreurs** : Fallback et retry automatiques

### UX/UI
- **Chargement progressif** : Indicateurs visuels
- **Responsive design** : Adaptatif mobile/desktop
- **Animations Star Wars** : Fond étoilé, transitions fluides
- **États interactifs** : Hover effects, feedback visuel

### Architecture
- **API RESTful** : Endpoints cohérents et documentés
- **Composants réutilisables** : Architecture modulaire
- **Gestion d'état** : Hooks React optimisés
- **Séparation des responsabilités** : Backend/Frontend découplés

## 🧪 Tests et Développement

### Backend
```bash
cd rebels-backend
npm run dev  # Si nodemon configuré
```

### Frontend
```bash
cd star-wars-frontend
npm start    # Hot reload automatique
```

### Tests API
```bash
# Test de santé
curl http://localhost:3001/health

# Test de recherche
curl "http://localhost:3001/search?q=luke"

# Test d'authentification
curl -X POST http://localhost:3001/auth/search \
  -H "Content-Type: application/json" \
  -d '{"username":"Luke","password":"DadSucks","query":"vader"}'
```

## 🎨 Aperçu Visuel

### Interface Principale
- **Header** avec branding Alliance Rebelle et authentification
- **Barre de recherche** avec icône et loader animé
- **Système de filtres** expansible
- **Grille de cartes** responsive avec hover effects

### Thématique Star Wars
- **Palette de couleurs** : Noir, bleu, rouge/orange pour l'Alliance
- **Typographie** : Gradients colorés pour les titres
- **Animations** : Étoiles scintillantes, transitions fluides
- **Icônes** : Spécialisées par catégorie avec couleurs distinctes

## 🔮 Évolutions Possibles

- [ ] **Router React** pour navigation directe
- [ ] **Redux** pour gestion d'état avancée
- [ ] **CSS Modules** pour styles encapsulés
- [ ] **Tests unitaires** Jest/React Testing Library
- [ ] **PWA** avec service worker
- [ ] **Déploiement** Vercel/Netlify + Heroku

## 📝 Notes Techniques

### Contraintes Respectées
- ❌ **swapi-node prohibé** : Utilisation d'axios direct
- ✅ **Hapi.js utilisé** : Framework backend recommandé
- ✅ **React fonctionnel** : Hooks et composants fonctionnels
- ✅ **Immutabilité** : Pas de mutations d'état direct

### Points d'Attention
- **CORS configuré** pour développement local
- **Gestion d'erreurs** robuste avec fallbacks
- **API Rate Limiting** : Pause entre requêtes
- **Sécurité** : Validation des entrées utilisateur

## 👨‍💻 Développeur

**Abishan** - Développeur Full Stack
- GitHub: [@Abishan13](https://github.com/Abishan13)
- Email: [votre-email@example.com]

---

<div align="center">

**Que la Force soit avec vous !** ⭐

*Ce projet a été réalisé avec passion pour démontrer mes compétences en développement full-stack dans l'univers Star Wars.*

![May the Force be with you](https://img.shields.io/badge/May%20the%20Force-be%20with%20you-FFE81F?style=for-the-badge&logo=starwars&logoColor=black)

</div>
