# Bilan de mission – Vols

Application web installable (PWA) pour saisir les vols d'une mission hélicoptère et produire la synthèse par aéronef (MEP/Retour, Zone, VT, Total — Jour, Nuit, VI, SIL), le kéro et les heures mécaniques, avec export PDF.

Fonctionne sur tablette Android, iPad et ordinateur, **y compris hors ligne** une fois installée.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | L'application (tout le code est dedans) |
| `manifest.webmanifest` | Nom, couleurs et icônes pour l'installation |
| `sw.js` | Service worker : mise en cache pour le hors ligne |
| `icons/` | Icônes : Android (192, 512, maskable), Apple (`apple-touch-icon.png`, 180 px), ordinateur (favicons 16 et 32 px) |
| `favicon.ico` | Icône d'onglet pour les navigateurs d'ordinateur |
| `.nojekyll` | Indique à GitHub Pages de servir les fichiers tels quels |

## Mise en ligne sur GitHub Pages

1. Créez un dépôt sur GitHub (par exemple `bilan-vols`).
2. Déposez **tous les fichiers à la racine** du dépôt (bouton *Add file → Upload files*, glissez le contenu du dossier, y compris le dossier `icons`).
3. Dans le dépôt : *Settings → Pages → Build and deployment → Source : Deploy from a branch*, branche `main`, dossier `/ (root)`, puis *Save*.
4. Après une à deux minutes, l'application est disponible à l'adresse `https://<votre-compte>.github.io/bilan-vols/`.

> Le dépôt peut rester privé uniquement avec un abonnement GitHub payant ; sinon, le code est public (les **données de vol, elles, ne quittent jamais l'appareil**).

## Installation sur l'appareil

- **Android (Chrome)** : ouvrez l'adresse, menu ⋮ → *Installer l'application* (ou *Ajouter à l'écran d'accueil*).
- **iPad / iPhone (Safari)** : bouton Partager → *Sur l'écran d'accueil*.
- **Ordinateur (Chrome / Edge)** : icône d'installation dans la barre d'adresse.

Ouvrez l'application une première fois avec du réseau : elle se met alors en cache et fonctionne ensuite hors ligne.

## Où sont les données ?

Les vols sont enregistrés **localement dans l'appareil** (stockage du navigateur), automatiquement à chaque modification. Il n'y a pas de serveur : une tablette et un ordinateur ne partagent pas les mêmes données.

- **Exporter sauvegarde** crée un fichier `.json` de la mission (à garder ou à transférer).
- **Importer** recharge ce fichier sur le même appareil ou un autre.
- Effacer les données du navigateur ou désinstaller l'application **supprime les vols** : exportez une sauvegarde régulièrement.

## Mettre à jour l'application

Remplacez simplement les fichiers modifiés dans le dépôt GitHub. Il n'y a **aucun numéro de version à changer** et **rien à désinstaller** :

- le service worker fonctionne en « réseau d'abord » : avec du réseau, l'appli charge toujours la dernière version publiée ; hors ligne, elle utilise la dernière copie enregistrée ;
- l'identité de l'appli est fixée dans le manifeste (`"id"`), donc l'installation existante reste la même appli après une mise à jour ;
- quand une nouvelle version arrive, l'appli se recharge d'elle-même une fois. Les vols saisis sont conservés.

GitHub Pages peut mettre jusqu'à une dizaine de minutes à diffuser une modification.

## Règles de saisie appliquées

- H méca et ATT obligatoires.
- Si VI CAG / VI CAM : Jour ≥ VI CAG + VI CAM.
- Si SIL : Nuit ≥ SIL. Si VTN : Nuit ≥ VTN.
- Total = Jour + Nuit (calculé).
