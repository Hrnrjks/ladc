function scrollToBot()
{
	document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight; // doesnt work on firefox
}

var connected = false; // make the first 'user connected' message triggered by current user not appear for them
// the above solution doesn't work if the server was restarted while the website was still open on a browser
var nickSet = false; // on first message the nickname is set to the message content and then you can message normally

$(function()
{
	var socket = io();

	
	
	$('#msg-form').submit(function()
	{
		if (!nickSet)
		{
			socket.emit('set nick', $('#msg').val());
			$('#msg').val('');
		}
		
		else
		{
			socket.emit('chat message', $('#msg').val());
			$('#msg').val('');
		}
		
		return false;
	});
	
	socket.on('chat message', function(msg)
	{
		$('#messages').append($('<li>').text(msg));
		scrollToBot();
	});
	
	socket.on('user connected', function(userConn)
	{
		/*if (connected)
		{
 			$('#messages').append($('<li>').text(userConn));
 			scrollToBot();
		}

		else
		{
			connected = true;
		}*/
		
		$('#messages').append($('<li>').text(userConn));
 		scrollToBot();
	});
	
	socket.on('user disconnected', function(userDisc)
	{
		$('#messages').append($('<li>').text(userDisc));
		scrollToBot();
	});
	
	socket.on('nick set', function(result)
	{
		socket.emit('user connected', "void");
		$('#messages').append($('<li>').text(result));
		nickSet = true;
	});
	
	socket.on('nick exists', function(result)
	{
		$('#messages').append($('<li>').text(result));
	});
});

