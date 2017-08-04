var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*
 app.use(express.static(__dirname + '/public'));
 app.use('/Styles', express.static(__dirname + '/public/Styles'));
 app.use('/Scripts', express.static(__dirname + '/public/Scripts'));
 */

app.get('/', function (req, res)
{
    res.sendFile('private/index.html', {root: __dirname});
});

/*
app.get('/login', function (req, res)
{
    res.sendFile('private/login.html', {root: __dirname});
});
 */

app.use(express.static('public'));

var users = {};
var userConn = 'A user has connected';
var userDisc = 'A user has disconnected';
var connectCount = 0; // for unique username
io.on('connection', function (socket)
{
	connectCount += 1;
	var user = {
		nick : null,
		socket : socket,
		ip : socket.handshake.address
	};
	
	users[socket.id] = user;
	
    console.log('a user has connected to ladc');
    // io.emit('user connected', "SERVER: " + userConn);
	
    /*socket.on('user connected', function(nick)
    {
		io.emit("'" + users[socket.id].nick + "' has emerged from nowhere.");
    });*/

	/*socket.on('join', function(name)
	{
		users[socket.id] = name;
		socket.emit('update', "You're connected.");
	 	socket.emit('update', name + " has emerged from nowhere.");
		socket.emit('update-people', users);	
	});

 	socket.on('send', function(msg)
	{
		socket.emit('chat message', users[socket.id], msg);
	}); */

	socket.on('disconnect', function()
	{
		/*socket.emit('update', users[socket.id] + " has mysteriously faded in plain sight.");
		delete users[socket.id];
		socket.emit('update-people', users);*/
		
		if (users[socket.id].nick != null)
		{
			io.emit('user disconnected', "'" + users[socket.id].nick + "@" + users[socket.id].ip + "' has mysteriously faded in plain sight.");
		}
		
		delete users[socket.id];
		//socket.emit('update-people', users);
	});

	/*socket.on('disconnect', function ()
    {
        console.log('a user has disconnected from ladc');
        io.emit('user disconnected', "SERVER: " + userDisc);
    });*/

	socket.on('chat message', function (msg)
    {
		var user = users[socket.id];
        io.emit('chat message', user.nick + "@" + user.ip + ": " + msg); // make a foreach in users instead of this
    });

    socket.on('set nick', function (nick)
    {
		for (var key in users)
        {
            if (users[key].nick == nick)
			{
				socket.emit('nick exists', "'" + nick + "' nickname already exists.");
				return false;
			}
        }
		
		users[socket.id].nick = nick;
		socket.emit('nick set', "'" + nick + "' nickname set successfully.");
		
		for (var key in users)
		{
			if (users[key].nick != nick)
			{
				users[key].socket.emit('user connected', "'" + users[socket.id].nick + "@" + users[socket.id].ip + "' has emerged from nowhere.");
			}
		}
		// io.emit('user connected', "'" + users[socket.id].nick + "' has emerged from nowhere.");
    });
});

http.listen(3000, function ()
{
    console.log('ladc up and running on port 3000');
});
