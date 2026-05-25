
FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

# Installer TOUTES les dépendances (dev inclus) pour le build TypeScript
RUN npm install

COPY . .

# Compiler TypeScript → génère le dossier dist/
RUN npm run build

EXPOSE 10000

# Démarrer l'app
CMD ["node", "dist/index.js"]