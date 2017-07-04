function scrollToBot()
{
	document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight; // doesnt work on firefox
}

var connected = false; // make the first 'user connected' message triggered by current user not appear for them
// the above solution doesn't work if the server was restarted while the website was still open on a browser
$(function()
{
	var socket = io();

	$('form').submit(function()
	{
		socket.emit('chat message', $('#msg').val());
		$('#msg').val('');
		return false;
	});
	socket.on('chat message', function(msg)
	{
		$('#messages').append($('<li>').text(msg));
		scrollToBot();
	});
	socket.on('user connected', function(userConn)
	{
		if (connected)
		{
 			$('#messages').append($('<li>').text(userConn));
 			scrollToBot();
		}

		else
		{
			connected = true;
		}
	});
	socket.on('user disconnected', function(userDisc)
	{
		$('#messages').append($('<li>').text(userDisc));
		scrollToBot();
	});
});

