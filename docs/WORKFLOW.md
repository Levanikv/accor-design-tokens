# Workflow final – Design Tokens

## Vue d’ensemble

- **Repo central** : design tokens issus de Tokens Studio (source de vérité).
- **Build web** : exécuté sur la **branch principale** (`main`) → artefacts pour le web (JSON, CSS, thèmes).
- **Build app** : basé sur `main` → mise à jour de la **branch `app`** (ou envoi direct vers le repo Android) → **ouverture d’une PR sur le repo GitHub Android**.

---

## Étapes à effectuer

### 1. Repo central (tokens depuis Tokens Studio)

- Les tokens sont soit **exportés/synchronisés** depuis Tokens Studio vers ce repo (plugin Figma / sync manuel), soit commités manuellement dans `src/`.
- La **branch principale** est `main`. Toute évolution des tokens se fait via PR vers `main`.

### 2. Build web → branch principale

- **Déclencheur** : push/merge sur `main`.
- **Action** : lancer le build **web** (JSON + CSS + thèmes).
- **Sortie** : `dist/json/`, `dist/css/`, `dist/themes.manifest.json`, éventuellement publication npm ou déploiement des artefacts.

**Commandes :**
```bash
npm ci
npm run build:web
```

### 3. Build app → branch `app` → PR vers le repo Android

- **Source** : toujours le code de la branch **`main`** (tokens à jour).
- **Étapes** :
  1. Partir de `main` (checkout en CI).
  2. Lancer le **build app** (Android Compose) → génère `dist/android/*.kt`.
  3. Soit :
     - **Option A** : pousser ces fichiers sur une branch **`app`** de ce repo (artefacts versionnés), puis un job dédié crée/met à jour une PR vers le **repo Android**.
     - **Option B** : cloner le **repo Android**, créer une branch (ex. `design-tokens/update-YYYYMMDD`), y copier les `.kt`, commit + push, puis ouvrir une PR sur le repo Android (vers `main` ou `develop`).

**Commandes (build app seul) :**
```bash
npm ci
npm run build:app
# Sortie : dist/android/AccorColorPrimitives.kt, AccorColorSemantics.kt
```

### 4. Résumé des étapes côté CI (GitHub Actions)

| Étape | Branch / Événement | Action | Résultat |
|--------|--------------------|--------|----------|
| 1 | Push sur `main` | `npm run build:web` | Artefacts web (JSON, CSS) publiés ou déployés |
| 2 | Push sur `main` | `npm run build:app` | Génération des `.kt` |
| 3 | Après build app | Push vers branch `app` **ou** vers repo Android | Fichiers Android à jour |
| 4 | Après push vers Android | Créer / mettre à jour une PR | PR ouverte sur le repo GitHub Android |

### 5. Prérequis techniques (Build app → PR Android)

À configurer dans **Settings > Secrets and variables > Actions** du repo design-tokens :

| Type   | Nom                  | Description |
|--------|----------------------|-------------|
| Secret | `ANDROID_REPO_TOKEN`  | Token GitHub (PAT) avec droits d’écriture sur le repo Android (pour push + création de PR). |
| Variable | `ANDROID_REPO`     | Repo Android au format `owner/repo` (ex. `accor/android-app`). **Obligatoire** pour le workflow PR. |
| Variable | `ANDROID_BASE_BRANCH` | Branch cible de la PR sur le repo Android (défaut : `main`). |
| Variable | `ANDROID_TOKENS_PATH` | Chemin dans le repo Android où copier les `.kt` (défaut : `designsystem/src/main/java/com/accor/designsystem/compose`). |

---

## Fichiers concernés

- **Build web** : `scripts/build.js` (génération tokens JSON + CSS), sortie dans `dist/json`, `dist/css`.
- **Build app** : `scripts/buildAppCompose.js`, sortie dans `dist/android/` (`AccorColorPrimitives.kt`, `AccorColorSemantics.kt`).
- **CI** : `.github/workflows/` (workflows pour build web sur `main`, build app, puis PR vers Android).

### 6. Fichiers et workflows créés

- **Scripts** : `npm run build:web`, `npm run build:app`, `npm run build` (tout).
- **Workflows** :
  - `.github/workflows/build-web.yml` : sur push `main`, build web + upload des artefacts.
  - `.github/workflows/build-app-android-pr.yml` : sur push `main`, build app puis push vers le repo Android et ouverture d’une PR.
