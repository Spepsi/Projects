<?php
//Cette fonction doit être appelée avant tout code html
session_start();

//On donne ensuite un titre à la page, puis on appelle notre fichier debut.php
$titre = "Contact";
include("includes/identifiants.php");
include("includes/debut.php");
include("includes/menu.php");


echo'<i>Vous êtes ici : </i><a href ="./index.php">Contact </a>';

?>

<h1>Nous-contacter</h1></div>

<?php


// On inclut le pied de page

include("includes/pieds.php") ;
?>