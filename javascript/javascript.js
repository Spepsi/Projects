/*
Scripts client : Environnement dynamique du chat
*/
(function($){
// Initialisation des variables utilis�es tout au long de la session
// Initialisation du socket :
var socket = io.connect('http://localhost:1337') ;
// Variable qui stocke la conversation en cours
var conversation = {} ; // attributs : IdConversation ( r�f�rence serveur ) 


// Conversation cibl�e lors de l'appuie sur le bouton "inviter" :
var conversationFocused ;
// Booleen qui passe � true lors de l'appuie sur un bouton inviter :
var inviterConversation=false ; // Passe � true quand on est en mode inviter dans la conversation
// Indique si l'utilisateur est logg� ou non (droit d'envoyer des messages);
var connected = false; 
var conversationsADeux = {} ;
// Types approuv�s de fichiers lors de l'envoi d'une image :
var allowedTypes = ['png', 'jpg', 'jpeg', 'gif'] ;
// Types de vid�os approuv�s :
var videoAllowedTypes = ['avi','mov','mpg'];
// URL de la derni�re image envoy�e :
var imageURL ;
// Tableau stockant l'url de toutes les photos re�ues :
var urlOther = [] ;
// Id de l'utilisateur : (=login) :
var myID  = pseudo ;
/*
Log de l'utilisateur, on envoie au serveur notre id
*/
$('#formulaire_login').click(function(event){
	
	
	event.preventDefault();
	socket.emit('login',{
		login : pseudo,
		})
});


/*
message "logged" re�u si le serveur accepte la connexion (unicit� du pseudo)
Quand l'utilisateur est logg� on fait dispara�tre le menu du log
*/
socket.on('logged',function(){
connected = true ;
$('#accueil').fadeOut();
// Affichage du salon (liste des utilisateurs ) :
$('#salon').css('display','inline');
$('#bonjourMessage').html('Bonjour '+pseudo+' ! ');
}) ;
	
/* Quand l'utilisateur se d�connecte on le retire des utilisateurs en ligne
	ou de la conversation en cours
*/
socket.on('disuser', function(user){
	$('#'+ user.id).remove();
}) ;
	
	/* Quand un autre utilisateur se connecte on l'ajoute dans la liste d'utilisateurs en 
	ligne :
	*/
	socket.on('newuser',function(user){
	$('#listeUsers').append('<div id="'+ user.id + '" ><img src="'+user.avatar +'" /><p>'+ user.id +'</p></div>');
	
	/*On d�clare la fonction a appeler quand on double clique sur un utilisateur en ligne
	 A pour effet de creer la discussion ou de l'inviter � la discussion en cours
    si le bouton "inviter" est enclench�	 :
	*/	
		
		$('#'+user.id).dblclick(function(){
		// Si le bouton inviter conversation est enclench� :	
			if(inviterConversation){
				socket.emit('addInRoom',
					{room : conversationFocused,
					newUser : user.id
					});
		// Sinon cr�ation d'une conversation � deux utilisateurs			
				}
				else{
					socket.emit('createConversation',
					{ 
						users : [myID,user.id] // ids des deux utilisateurs
						
					}
				);

				}

			inviterConversation = false;  // On repasse en mode sans invitation
			});
		
		
		
		
});

/*
Evenement qui indique que nous avons �t� invit� dans une conversation.
On cr�e donc la conversation et on ajoute les listeners sur les nouveaux boutons.
*/

socket.on('inviteJoining',function(room){
	// Creation de la balise div avec id conversation
	var discussion = $( '#discussion' );
	// Insertion de la nouvelle conversation apr�s la balise template
	discussion.clone().attr('id', room ).insertAfter( discussion );
	// Affichage de la discussion :
	$('#'+room).css('display','block');
	
	/*
	Ajout des listeners sur les boutons.
	*/
	
	// Bouton envoyer message
	$('input.sendButton').click(function(){
			event.preventDefault(); 
			// R�cup�ration de la discussion cibl�e :
			var room = this.parentNode.parentNode.id;
			var texte = '<strong>'+myID+' :</strong> ';
			texte += safe_tags($('#'+room+' input.monMessage').val());
			// Si le message est non vide on l'envoie :
			if($('#'+room+' input.monMessage').val()){
				// Transmission du message au serveur :
				socket.emit('sendMessage',{
					room : room,
					message : texte,
					sender : myID
				});
			}
			// On vide l'input texte :
			$('#'+room+' input.monMessage').val('');
		});
		
		// Bouton d'invitation :
		$('input.inviteButton').click(function(){
			inviterConversation = !inviterConversation ;
			conversationFocused = this.parentNode.id ;
		});
		
		// Bouton de fermeture d'une conversation :
		$('input.closeButton').click(function(){
			// On signifie au serveur qu'on quitte la conversation
			$('#'+this.parentNode.id).css('display','none') ;
			room = this.parentNode.id;
			socket.emit('leaveRoom',{
			user : myID,
			room : room 
			});
		});
			
		// Chargement d'une image par l'utilisateur. On d�tecte quand un fichier a �t� en
		// envoy� :
		$('input.postImage').change( function() {
		// R�cup�ration de la conversation (id) :
		room = this.parentNode.id ;
		// Utilisation d'un file reader :
		var reader = new FileReader();
		// On r�cup�re la derni�re photo envoy� :
        var files = this.files[0];
        var filesLen = files.length ;
        var imgType;
            imgType = files.name.split('.');
            imgType = imgType[imgType.length - 1];
		// On v�rifie que le type du fichier est bien une photo.
            if(allowedTypes.indexOf(imgType) != -1) {
			    reader.onloadend = function () {
				htmlImage = '<strong>'+myID+' : </strong><img src=\''+reader.result+'\'  height="42" width="42" alt=\'imagePreview\' /></br>' ;
				imageURL = reader.result ;
			// Envoie de l'image au serveur.
				socket.emit('imageSent',{
				url : imageURL,
				message : htmlImage,
				room : room
				});
				}
			}
			if(videoAllowedTypes.indexOf(imgType) !=-1){
			
			
				reader.onloadend = function () {
				htmlImage = '<strong>'+myID+' : </strong><video controls src=\''+reader.result+'\'  height="42" width="42"  /></br>' ;
				imageURL = reader.result ;
			// Envoie de l'image au serveur.
				socket.emit('imageSent',{
				url : imageURL,
				message : htmlImage,
				room : room
				});
			   
			   
			   
            }
			
			}
			
			reader.readAsDataURL(files);
			imageURL = reader.result;
             
        });
        
	});


/*
A la r�ception d'une image on l'affiche et on creer un lien pour l'afficher dans un 
nouvel onglet :
*/	
socket.on('newImage',function(data){
	messagefinal = '<a target="_blank" href=\''+data.url+'\' >'+data.message+'</a>' ;
	$('#'+data.room+' .messages').append(messagefinal);
	$('#'+data.room+' .messages').animate({scrollTop : $('#'+data.room+' .messages').prop('scrollHeight')},100) ;
	urlOther.push(data.url);
	
});	

/*
Lorsque le serveur met � jour les participants d'une conversation on est notifi� :
*/
socket.on('updateUsers',function(data){
// Le titre de la conversation refl�te les participants, on le change quand mise � jour.
	titre = '';
	for( var k in data.users) {
		titre += data.users[k] + ' ' ;
	}
	$('#'+data.room+' h1').html(titre);
	
});

// Quand un utilisateur quitte, on met aussi � jour la conversation.
socket.on('updateLeave',function(data){
// Quand un utilisateur part on change le titre de la conversation
	titre = '';
	for( var k in data.users) {
		titre += data.users[k] + ' ' ;
	}
	$('#'+data.room+' h1').html(titre);
	
});



/* 
Lorsqu'on re�oit un message on l'affiche dans la balise message de discussionId associ�e.
*/
socket.on('forwardMessage',function(data){
	$('#'+data.room+' .messages').append(data.message+'<br/>');
	$('#'+data.room+' .messages').animate({scrollTop : $('#'+data.room+' .messages').prop('scrollHeight')},100)
	$('#'+data.room).css('display','block');
});


/*
Fonction de recherche d'un utilisateur dans la liste des utilisateurs en ligne :
*/ 
// Lorsqu'une touche est tap�e on met � jour cette recherche :
$('#recherche').keyup(function(){
// On r�cup�re tous les id des utilisateurs en ligne ...
var message  = $('#recherche').val();
var selection = $('#listeUsers').contents();

var tab = [] ;

for (var k in selection){
	if(selection[k].id){
	tab.push(selection[k].id);
	}
}
//...  Puis on filtre en fonction de la recherche :
for ( var k in tab) {
	if(tab[k].startsWith(message)){
	$('#'+tab[k]).css('display','block') ;
	}
	else {
	$('#'+tab[k]).css('display','none') ;
	}
	$('#recherche').css('display','block');
}
});


// Methode pour la recherche d'ids :

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

// Fonction pour �viter des injections de script ou de html.
function safe_tags(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}

})(jQuery);