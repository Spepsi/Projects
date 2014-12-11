<?php
//Le pied de page ici :
echo'<div id="footer">
<h2>
Qui est en ligne ?
</h2>
';

//On compte les membres
$TotalDesMembres = $db->query('SELECT COUNT(*) FROM membres')->fetchColumn();

$query = $db->query('SELECT membre_pseudo, membre_id FROM membres ORDER BY membre_id DESC LIMIT 0, 1');
$data = $query->fetch();
$derniermembre = stripslashes(htmlspecialchars($data['membre_pseudo']));
echo'Le site compte <strong>'.$TotalDesMembres.'</strong> membres.<br />';
echo'Le dernier membre est <a href="./voirprofil.php?m='.$data['membre_id'].'&amp;action=consulter">'.$derniermembre.'</a>.</p>';
$query->CloseCursor();
?>
</div>
</body>
</html>