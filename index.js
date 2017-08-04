var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res)
{
    res.sendFile('private/index.html', {root: __dirname});
});

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

	socket.on('disconnect', function()
	{	
		if (user.nick != null)
		{
			io.emit('user disconnected', "'" + user.nick + "@" + user.ip + "' has mysteriously faded in plain sight.");
		}
		
		delete users[socket.id];
	});

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
		
		user.nick = nick;
		socket.emit('nick set', "'" + nick + "' nickname set successfully.");
		
		for (var key in users)
		{
			if (users[key].nick != nick)
			{
				users[key].socket.emit('user connected', "'" + user.nick + "@" + user.ip + "' has emerged from nowhere.");
			}
		}
    });
});

http.listen(3000, function ()
{
    console.log('ladc up and running on port 3000');
});
