**Description du projet**

C'est une application React js / Node et expresse  qui utilise une base de données mongodb pour assure la gestion des questionnaires pour qualifier un chantier.

Le backen expose une api qui permet d'obtenir les données des domaines et enregistrer les demandes d'interventions des utilisateurs.

Le front utilise axios pour effectuer des requettes api.

  **Le projet contient un fichier docker-compose** pour mettre en place trois services, react-app pour le front, node-app pour le back et mongo pour la base de données
  
  **NB: Si vous utiliser mongodb en local**:
  
  - stoper son service pour liberer le port 27017 parce que le service mongo du docker l'utilisera
    Pour ce faire, utiliser la commande **service mongodb stop**
    
  **NB:  les ports ci-après doivent pas être disponibles**
  
  - le front utilise le port 3000
  - le back utilise le port 8080

**L'instalation du projet**:

  Depuis le dossier racine du projet [goweb-app] en utilisant docker, elle s'effectue avec la commande **docker compose up --build** 
  Le projet utilise une base de données nommée domaines qui est unitialisée avec le contenu du fichier xlsx qui se trouve dans 
  backendpjtgoweb/fixtures/plomberie

A la fin de l'exécution de la commande, rendez-vous à http://localhost:3000/

**Utiliser MongoDb compass pour consulter la base de données**
