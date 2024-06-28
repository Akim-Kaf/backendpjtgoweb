# Utilisez une image Node.js officielle comme image de base
FROM node:20

# Définissez le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copiez les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installez les dépendances de l'application
RUN npm install

# Copiez le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Exposez le port sur lequel l'application écoute
EXPOSE 8080

# Définissez la commande pour exécuter l'application
CMD ["node", "server.js"]
