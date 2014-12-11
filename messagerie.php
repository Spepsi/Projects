<?php
session_start();
$titre="Messagerie";
include("includes/identifiants.php");
include("includes/debut.php");
include("includes/menu.php");
echo '<p><i>Vous êtes ici</i> : <a href="./index.php">Index </a> --> Messagerie';

?>








<html>
    <head>
        <meta charset="utf-8" />
		<link rel="stylesheet" href="css/design.css" />
        <title>Messagerie :</title>
    </head>
 


   <body>

   <?php if(!isset($_SESSION['pseudo'])){
   	echo '<p> Veuillez vous connecter </p>' ;

   }
   else {
	echo '<script> var pseudo =\''.$_SESSION['pseudo'].'\' </script>' ;
   ?>
 
	<div id="blocPage">
    

    
    <!-- On utilise des div avec id pour contrôler l'affichage ou non 
	de la page. Comme ça on reste sur une unique page.
	-->
    
    <!-- La page d'accueil -->
    
    <div id="accueil">
        
		
		<h1>Bonjour !</h1>
        
        
         <input type="submit" id="formulaire_login" value='Entrez dans la messagerie' />  
        
    </div>
    <h1 id="bonjourMessage"> </h1>
	
	<!-- Le salon où on voit la liste des utilisateurs en ligne
	
	-->
	<div id="blocSalonRoom">
	
	<div id="salon" style="display : none">
		
		<h1>En ligne : </h1>
        
		<div id="listeUsers" > 
			<!-- Fonction pour rechercher un utilisateur -->
		<input id="recherche" type="text" placeholder=" Rechercher : " /> <br/><br/>
		</div>
		
	</div>

	<!-- Une discussion entre deux ou plusieurs personnes -->
	
	
	<div id="discussion" class="discussion" style="display : none">
		
		<input type="submit" class="closeButton" name="quitterConversation" value="Quitter" />
		
		<input type="submit" class="inviteButton" name="inviterConversation" value="Inviter" />
		<input type="file" class = "postImage" value = "Image" multiple />
		<h1>  </h1>
				
				<div class="usersInDiscussion"> </div>
			<div class="messages"> </div> 
			
			
			<form method="post" action="#" class="texteMessage"> 
				<input type="text" class="monMessage" name="monMessage" />
				<input type="submit" class="sendButton" name="posterMessage" value="Envoyer" />
			</form>
			<br/>
			<br/>
	</div>

	</div>
	</div> 

	<?php 
}

?>

    </body>

	<script src="http://code.jquery.com/jquery.min.js"> </script>
	<script src="http://localhost:1337/socket.io/socket.io.js"></script>
	<script src="javascript/javascript.js"></script>
	
	
</html>