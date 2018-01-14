var express = require('express');
var server = express();
var PORT = process.env.PORT || 3000;

var todoCollection = [{
	id: 'lectures',
	description: 'attend CS 240 lecture',
	completed: false
}, {
	id: 'shopping',
	description: 'do groceries',
	completed: true
}, {
	id: 'projects',
	description: 'finish TODO project',
	completed: false
}];

server.get('/', function(request,response){
	response.send('TODO API');
});

// GET todo
server.get('/todos', function(request,response){
	response.json(todoCollection);
});

// GET todo by ID
server.get('/todos/:id', function(request,response){
	var requiredID = request.params.id;
	var requiredTodo;

	todoCollection.forEach(function(todo){
		if(requiredID === todo.id){
			requiredTodo = todo;
		}
	});

	if(requiredTodo){
		response.json(requiredTodo);
	} else {
		response.status(404).send();
	}
});

server.listen(PORT, function(){
	console.log('TODO API');
});