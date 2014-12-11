<?php
//Cette fonction doit être appelée avant tout code html
session_start();

//On donne ensuite un titre à la page, puis on appelle notre fichier debut.php
$titre = "Index";
include("includes/identifiants.php");
include("includes/debut.php");
include("includes/menu.php");


echo'<i>Vous êtes ici : </i><a href ="./index.php">Index </a>';

?>

<a href="messagerie.php" > <h1>Système de messagerie</h1></a></div>

<?php


// On inclut le pied de page

include("includes/pieds.php") ;
?>