# Guide d'installation de Prisma avec pnpm

## 🎯 Objectif

Ce document fournit un guide étape par étape pour installer et configurer Prisma dans un projet Node.js en utilisant pnpm. Prisma est un ORM moderne qui simplifie l'interaction avec les bases de données.

## 📋 Pré-requis

- [Node.js](https://nodejs.org) installé (version 16+ recommandée)
- pnpm installé : `npm install -g pnpm`
- Une base de données PostgreSQL fonctionnelle

## 🚀 Étapes d'installation

### 1. Initialiser un projet Node.js

```bash
mkdir mon-projet && cd mon-projet
pnpm init
```

### 2. Installer Prisma et le client

```bash
# Installation de Prisma CLI en tant que dépendance de développement
pnpm add -D prisma

# Installation du client Prisma
pnpm add @prisma/client
```

### 3. Initialiser Prisma

```bash
pnpm exec prisma init
```

Cette commande crée :

- Un fichier `.env` avec une URL de base de données
- Un dossier `prisma/` contenant `schema.prisma`

### 4. Configurer la base de données

Modifier le fichier `.env` avec les bonnes informations :

```env
DATABASE_URL="postgresql://utilisateur:motdepasse@localhost:5432/ma_base?schema=public"
```

### 5. Éditer schema.prisma

Exemple de modèle simple (à adapter selon vos besoins) :

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

### 6. Générer le client Prisma

```bash
pnpm exec prisma generate
```

### 7. Appliquer les migrations

```bash
pnpm exec prisma migrate dev --name init
```

Cette commande :

- ✅ Crée la base de données si elle n'existe pas
- ✅ Applique les modèles définis dans `schema.prisma`
- ✅ Génère automatiquement le client Prisma

### 8. Créer des données de test

```bash
pnpm exec prisma db seed
```

### 9. Exemple d'utilisation

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
    },
  });

  // Récupérer tous les utilisateurs
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 📚 Commandes utiles

```bash
# Visualiser la base de données
pnpm exec prisma studio

# Réinitialiser la base de données
pnpm exec prisma migrate reset

# Créer une nouvelle migration
pnpm exec prisma migrate dev --name nom_migration

# Appliquer les migrations en production
pnpm exec prisma migrate deploy

# Synchroniser le schéma sans migration
pnpm exec prisma db push

# Créer des données de test
pnpm exec prisma db seed
```

## 🌱 Configuration du seeding (optionnel)

Ajouter dans votre `package.json` :

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Puis installer tsx et créer le fichier de seed :

```bash
pnpm add -D tsx
```

## 📁 Structure du projet

```
mon-projet/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts (optionnel)
├── .env
├── package.json
└── ...
```

## 🎉 Conclusion

Avec ces étapes, vous êtes prêt à utiliser Prisma dans votre projet Node.js en toute simplicité !

N'oubliez pas de :

- ✅ Adapter vos modèles dans `schema.prisma` selon vos besoins
- ✅ Configurer correctement votre base de données
- ✅ Utiliser `pnpm exec` pour toutes les commandes Prisma

## 🔗 Ressources utiles

- [Documentation officielle Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Guide des migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
