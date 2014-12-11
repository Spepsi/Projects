Projects
========
!!! Compatible uniquement Chrome  (Testé uniquement sous Chrome) !!!

Site de présentation et Messagerie avec divers fonctionnalités

- Système de connexion et d'inscription
- Système de messagerie avec fonctionnalités :
  - Conversations jusqu'à 5
  - Envoie d'images ou video
  - Barre de recherche d'utilisateurs en ligne

/!\ Ce n'est pas terminé, j'essaie actuellement de passer d'une version de la messagerie écrite complètement 
en javascript ( avec node.js côté serveur et socket.io pour les requêtes asynchrones) en une version se reposant
plus sur le php ( Stockage des messages dans une base de données ce qui permet de récupérer les messages après
une déconnexion et ainsi d'éviter certains problèmes actuels.

Je souhaite aussi passer du temps sur le design et l'ergonomie, ce que je n'ai pas pu réellement faire pour le moment

Il faut ajouter la table "membres" à une base de données appelée messagerie pour que le site fonctionne ( donnée ci-dessous)




table membres :

CREATE TABLE IF NOT EXISTS `membres` (
  `membre_id` int(11) NOT NULL AUTO_INCREMENT,
  `membre_pseudo` varchar(30) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `membre_mdp` varchar(32) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `membre_email` varchar(250) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `membre_inscrit` int(11) NOT NULL,
  `membre_derniere_visite` int(11) NOT NULL,
  `membre_rang` tinyint(4) DEFAULT '2',
  `membre_post` int(11) NOT NULL,
  PRIMARY KEY (`membre_id`)
) 


