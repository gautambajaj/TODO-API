var express = require('express');
// middleware body-parser extracts the entire body portion of an incoming request stream and exposes it on request.body
var bodyParser = require('body-parser')
var server = express();
var PORT = process.env.PORT || 3000;

var todoCollection = [];
var nextTodoID = 1;

server.use(bodyParser.json());

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

// POST todo
server.post('/todos', function(request,response){
	var body = request.body;
	body.id = nextTodoID;
	++nextTodoID;

	todoCollection.push(body);
	response.json(body);
});

server.listen(PORT, function(){
	console.log('TODO API');
});