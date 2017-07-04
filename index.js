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
app.get('/login', function (req, res)
{
    res.sendFile('private/login.html', {root: __dirname});
});

app.use(express.static('public'));

var users = [];
var userConn = 'A user has connected';
var userDisc = 'A user has disconnected';
io.on('connection', function (socket)
{
    console.log('a user has connected to ladc');
    io.emit('user connected', "SERVER: " + userConn);
    /*socket.on('user connected', function()
     {
     io.emit('user connected');
     });*/

    socket.on('disconnect', function ()
    {
        //console.log('a user has disconnected from ladc');
        io.emit('user disconnected', "SERVER: " + userDisc);
    });

    socket.on('chat message', function (msg)
    {
        //console.log('message: ' + msg);
        io.emit('chat message', "Anonas: " + msg);
    });

    socket.on('set username', function (data)
    {
        if (users.indexOf(data) > -1)
        {
            users.push(data);
            socket.emit('user set', {username: data});
        } else
        {
            socket.emit('user exists', data + ' username is taken.');
        }
    });
});

http.listen(3000, function ()
{
    console.log('ladc up and running on port 3000');
});
