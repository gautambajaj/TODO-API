var express = require('express');
// middleware body-parser extracts the entire body portion of an incoming request stream and exposes it on request.body
var bodyParser = require('body-parser')
var server = express();
var _ = require('underscore');
var db = require('./db.js');

var PORT = process.env.PORT || 3000;
var todoCollection = [];
var nextTodoID = 1;

server.use(bodyParser.json());

server.get('/', function(request,response){
	response.send('TODO API');
});

// GET todo by ID
server.get('/todos/:id', function(request,response){
	var requiredID = paramsseInt(request.params.id,10);
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

// GET todo by query parameters
server.get('/todos', function(request,response){
	var queries = request.query;
	var todosFiltered = todoCollection;
	
	if(queries.hasOwnProperty('completed') && queries.completed === 'true'){
		todosFiltered = _.where(todosFiltered, {completed: true});
	} else if(queries.hasOwnProperty('completed') && queries.completed === 'false'){
		todosFiltered = _.where(todosFiltered, {completed: false});
	}

	if(queries.hasOwnProperty('q') && queries.q.length > 0){
		todosFiltered = _.filter(todosFiltered, function(todo){
			return todo.description.indexOf(queries.q) != -1;
		});
	}

	response.json(todosFiltered);
});


// delete todo by ID
server.delete('/todos/:id', function(request,response){
	var requiredID = parseInt(request.params.id,10);
	var requiredTodo;

	todoCollection.forEach(function(todo){
		if(requiredID === todo.id){
			requiredTodo = todo;
		}
	});

	if(requiredTodo){
		todoCollection = _.without(todoCollection,requiredTodo);
		response.json(requiredTodo);
	} else {
		response.status(404).send();
	}
});


// POST todo
server.post('/todos', function(request,response){
	var body = _.pick(request.body, 'description', 'completed');

	db.todo.create(body).then(function(todo){
		response.json(todo.toJSON());
	}), function(e){
		response.status(400).json(e);
	}
	/*if(!_.isString(body.description) || !_.isBoolean(body.completed)){
		return response.status(400).send(); // bad request
	}

	body.id = nextTodoID;
	++nextTodoID;

	todoCollection.push(body);
	response.json(body);*/
});

// PUT todo by ID
server.put('/todos/:id', function(request,response){
	var body = _.pick(request.body, 'description', 'completed');

	var requiredID = parseInt(request.params.id,10);
	var requiredTodo;
	todoCollection.forEach(function(todo){
		if(requiredID === todo.id){
			requiredTodo = todo;
		}
	});

	if(!requiredTodo){
		return response.status(404).send();
	}

	var putAttributes = {};

	if(body.hasOwnProperty('description') && _.isString(body.description)){
		putAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')){
		return response.status(400).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		putAttributes.completed = body.completed; 
	} else if(body.hasOwnProperty('completed')){
		return response.status(400).send();
	}

	_.extend(requiredTodo,putAttributes);
	response.json(requiredTodo);
});

db.sequelize.sync().then(function() {
	server.listen(PORT, function(){
		console.log('TODO API');
	});
})