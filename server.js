var express = require('express');
var server = express();
var PORT = process.env.PORT || 3000;

server.get('/', function(request,response){
	response.send('TODO API');
});

server.listen(PORT, function(){
	console.log('TODO API');
});