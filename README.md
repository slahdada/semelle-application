# Semelle — Atelier & livraison

Application métier en français, React 19, TypeScript et Vite. Devise : dinar tunisien. Aucun jeu de données de démonstration n’est injecté.

## Utilisation

1. Créer une commande : seul le nom du client est obligatoire. Le numéro est attribué automatiquement et ne sera pas réutilisé après suppression.
2. Renseigner les articles, quantités, prix et frais. Le total se recalcule immédiatement, avec trois décimales possibles.
3. Importer les photos ou utiliser la caméra. Les aperçus sont disponibles avant Enregistrer. Les images sont redimensionnées à 1 600 pixels maximum et compressées en JPEG.
4. Changer l’étape depuis la commande. Les problèmes reçoivent une description. Une commande ne peut être clôturée avec un solde restant.
5. Ajouter les paiements dans l’onglet Paiement, puis Enregistrer. Les annulations de paiements restent tracées dans l’historique.
6. Sauvegarder régulièrement dans Données & réglages. Le JSON contient les photos, paiements et historiques. La restauration remplace les données après confirmation et validation.

Les liens téléphoniques ouvrent l’application d’appel. WhatsApp propose un message modifiable et ouvre la conversation ; l’utilisateur valide l’envoi dans WhatsApp. Le partage utilise la fonction native du navigateur ou copie un résumé. Le CSV peut être ouvert dans Excel ; il ne contient pas les photos. Le PDF et l’impression comprennent les détails et les photos.

## Stockage et hors connexion

Les commandes et les photos sont conservées dans IndexedDB sur cet appareil et ce navigateur. Les écritures et les restaurations sont transactionnelles. Les modifications concurrentes d’une même commande sont détectées. Ce fonctionnement ne synchronise pas plusieurs appareils. Effacer les données du navigateur ou perdre l’appareil supprime les données locales : conservez des sauvegardes externes.

La PWA précache l’application, ses polices, les formulaires et les exports après la première ouverture. Les commandes sont consultables et modifiables hors connexion. Les mises à jour sont proposées dans l’interface et s’appliquent à la demande.

Android : installer lorsque le navigateur propose le bouton. iPhone/iPad : dans Safari, Partager → Sur l’écran d’accueil. La caméra, les liens d’appel, le partage, le plein écran et l’installation dépendent des capacités du navigateur et de l’appareil. Une application native Capacitor n’est pas incluse.

## Démarrage local

Node.js 22.18+ ou 24, npm et Google Chrome pour les tests.

```sh
npm ci
npm run dev
```

Ouvrir l’adresse affichée. L’accès depuis un téléphone nécessite un serveur HTTPS accessible au téléphone ; localhost désigne le téléphone lui-même.

```sh
npm run build
npm test
```

La sortie de production est dans `dist/`. Le serveur de test utilise le port 5174. Le développement utilise le port 5173. Un alias esbuild-wasm permet la compilation dans l’environnement Windows restreint ; la sortie est un JavaScript normal et ne nécessite pas WebAssembly côté utilisateur.

Le transfert Sites sous Windows utilise `scripts/publish-windows.mjs`. Ce wrapper conserve le workflow Sites d’origine, applique OpenSSL et une exception Git limitée au dossier de l’application pour le processus courant, et adapte le chemin d’archivage pour Git Bash. Il reçoit les identifiants temporaires exclusivement sur stdin, sans les écrire dans un fichier ni modifier la configuration Git globale.

## Architecture

- `src/domain.ts` : modèle métier, calculs, recherche et validation.
- `src/db.ts` : IndexedDB et transactions.
- `src/main.tsx` : navigation, tableau de bord, recherche et filtres.
- `src/Editor.tsx` : fiche client, articles, photos, paiements, historique.
- `src/DataTools.tsx` : sauvegarde, restauration et exports.
- `src/photos.ts`, `src/pdf.ts`, `src/print.ts`, `src/exports.ts` : opérations associées.
- `public/sw.js`, `public/manifest.webmanifest`, `scripts/cache-assets.mjs` : PWA et mise à jour du cache.

Pour évoluer vers le cloud, remplacer les opérations de `db.ts` par un dépôt serveur authentifié, ajouter une file de synchronisation et un stockage de photos. Cette version privilégie le fonctionnement local explicitement prévu dans le cahier des charges.

## Vérifications

Les tests couvrent le parcours commande, les calculs, les photos importées/compressées, les paiements, les statuts, l’historique, la recherche, les exports PDF/CSV, les sauvegardes/restaurations, les confirmations de suppression, les conflits entre onglets et le cache hors connexion. Le test WebMCP utilise un contexte de registre contrôlé ; la compatibilité avec un navigateur agent natif reste à vérifier.

L’affichage est testé en Chromium aux dimensions suivantes, en portrait et paysage : 360×640, 412×915, 390×844, 820×1180, 800×1280, 1368×912, 1440×900 et 1920×1080. La réduction du viewport vérifie que le bouton Enregistrer reste visible avec une hauteur réduite. Ce n’est pas un test d’un vrai clavier iOS/Android.

Restent à vérifier sur matériel : Safari/iOS, capture caméra réelle, clavier système, installation et lancement standalone, impression physique et mises à jour d’une installation existante. Les tests aux dimensions d’un appareil ne remplacent pas les tests sur cet appareil.
