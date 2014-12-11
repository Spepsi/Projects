/*
Partie serveur : gestion de la connection des utilisateurs et acheminement des messages et 
autres fichiers

*/


var http = require('http');
var md5 = require('MD5') ;
  

httpServer = http.createServer(function(req, res) {
  
});
httpServer.listen(1337);

// Variable qui stocke tous les utilisateurs
var users = {} ;
var conversations = [] ; // attributs : id, users,  messages, 
var clients = {} ;
var io = require('socket.io').listen(httpServer);
// A la connection d'un utilisateur on lui envoie la liste des connectés :
io.sockets.on('connection',function(socket){
	
	for(var k in users){
		if(users[k].status==1){
			socket.emit('newuser',users[k]);
		}
	}
	
	console.log('Nouvel utilisateur');

	var me ;
	// Au login d'un utilisateur :
	socket.on('login', function(user){
		if(!users[user.login]){
			socket.clientname = user.id
			
			me = user;
			me.id = user.login ;
			me.avatar = 'https://gravatar.com/avatar/'+ md5(user.id) +'?s=25';
			socket.broadcast.emit('newuser',me) ;
			users[me.id] = me;
			users[me.id].socket =socket.id;
			users[me.id].rooms =[] ;
			clients[me.id] = socket;
			
			
			socket.emit('logged');
			users[me.id].status = 1 ;
		}
		else{
			socket.clientname = user.id
			
			me = user;
			me.id = user.login ;
			me.avatar = 'https://gravatar.com/avatar/'+ md5(user.id) +'?s=25';
			socket.broadcast.emit('newuser',me) ;
			users[me.id] = me;
			users[me.id].socket =socket.id;
			users[me.id].rooms =[] ;
			clients[me.id] = socket;
			
			
			socket.emit('logged');
			users[me.id].status = 1 ;
			
		}
		
	})
	// A la déconnexion d'un utilisateur :
	socket.on('disconnect', function(){
		if(!me){
			return false ;
		}
		users[me.id].status = 0 ;
		io.sockets.emit('disuser', me) ;
		// Pour toutes les conversations, on enlève l'utilisateur qui se déconnecte :
		for(var k in users[me.id].rooms){
			index = conversations[users[me.id].rooms[k]].users.indexOf(me.id);
			if(index !=-1){
				conversations[users[me.id].rooms[k]].users.splice(index,1);
			}
			
			
			// Le client quitte toutes les rooms
			clients[me.id].leave(users[me.id].rooms[k]);
			io.sockets.to(users[me.id].rooms[k]).emit('updateLeave',conversations[users[me.id].rooms[k]]) ;
		}
		// On supprime l'utilisateur
		delete clients[me.id];
		delete users[me.id] ;
	});



socket.on('createConversation',function(data){
	// generation de l'id de la conversation (room) 
	console.log('creation d\'une conversation');
	room = "";
	for(var k in data.users){
		room += data.users[k] ;
	}
	room =room + Math.round(Math.random()*1000);
	conversations[room] = { users : data.users , room : room } ;
	for(var k in data.users){
		clients[data.users[k]].join(room);
		users[data.users[k]].rooms.push(room);		
	}
	io.sockets.to(room).emit('inviteJoining',room);
	io.sockets.to(room).emit('updateUsers',conversations[room]);
	});
// Réponse à l'ajout d'un utilisateur dans une conversation par un client :
	socket.on('addInRoom',function(data){
	// On vérifie que la conversation comporte moins de 5 personnes avant d'inviter
		if(conversations[data.room].users.length<5){
			// On joint le client à la room correspondante :
			clients[data.newUser].join(data.room);
			// On invite le client à joindre la conversation :
			clients[data.newUser].emit('inviteJoining',data.room) ;
			conversations[data.room].users.push(data.newUser);
			console.log(conversations[data.room]);
			// On signifie à tous les utilisateurs qu'un autre utilisateur a été ajouté	
			io.sockets.to(data.room).emit('updateUsers',conversations[data.room]);
		}
});

// Transmission du message dans la room :
socket.on('sendMessage',function(data){
	io.sockets.to(data.room).emit('forwardMessage',data);

});

// Quand un utilisateur quitte une conversation on le transmet aux autres
socket.on('leaveRoom',function(data){
	clients[data.user].leave(data.room);
	console.log(conversations[data.room].users);
	index = conversations[data.room].users.indexOf(data.user);
	if(index !=-1){
		// Suppression de l'utilisateurs dans la conversation correspondante
		conversations[data.room].users.splice(index,1);
	}
	console.log(conversations[data.room].users);
	index2 = users[data.user].rooms.indexOf(data.room);
	if(index2 !=-1){
		users[data.user].rooms.splice(index,1);
	}
	io.sockets.to(data.room).emit('updateLeave',conversations[data.room]);

});

// lorsque le serveur reçoit une image on la retransmet :


socket.on('imageSent', function(data) {
console.log('image sent');
io.sockets.to(data.room).emit('newImage',data);

});



});

