<?php
try
{
$db = new PDO('mysql:host=localhost;dbname=messagerie', 'root', '',array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
}
catch (Exception $e)
{
        die('Erreur : ' . $e->getMessage());
}
$db->exec("SET CHARACTER SET utf8");
?>