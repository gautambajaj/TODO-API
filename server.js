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
	var requiredID = parseInt(request.params.id,10);

	db.todo.findById(requiredID).then(function(todo){
		if(!!todo){
			response.json(todo.toJSON());
		} else{
			response.status(404).send();
		}	
	}, function(e){
		response.status(500).send();
	});
});

// GET todo by query parameters
server.get('/todos', function(request,response){
	var query = request.query;
	var where = {};

	if(query.hasOwnProperty('completed') && query.completed === 'true'){
		where.completed = true;
	} else if(query.hasOwnProperty('completed') && query.completed === 'false'){
		where.completed = false;
	}

	if(query.hasOwnProperty('q') && query.q.length > 0){
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function(todoCollection){
		response.json(todoCollection);
	}, function(e){
		response.status(500).send();
	});
});


// delete todo by ID
server.delete('/todos/:id', function(request,response){
	var requiredID = parseInt(request.params.id,10);

	db.todo.destroy({
		where: {
			id: requiredID
		}
	}).then(function(numDeletedRows){
		if(numDeletedRows === 0){
			response.status(404).json({
				error: 'id not found'
			})
		} else {
			response.status(204).send();
		}
	}, function(){
		response.status(500).send();
	});
});


// POST todo
server.post('/todos', function(request,response){
	var body = _.pick(request.body, 'description', 'completed');

	db.todo.create(body).then(function(todo){
		response.json(todo.toJSON());
	}), function(e){
		response.status(400).json(e);
	}
});

// PUT todo by ID
server.put('/todos/:id', function(request,response){
	var body = _.pick(request.body, 'description', 'completed');
	var requiredID = parseInt(request.params.id,10);
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

	db.todo.findById(requiredID).then(function(todo){
		if(todo){
			todo.update(putAttributes).then(function(todo){
				response.json(todo.toJSON());
			}, function(e){	// failure callback
				response.status(400).json(e);
			});

		} else {
			response.status(404).send();
		}
	}, function(){	// success callback
		response.status(500).send();
	}); 
});

db.sequelize.sync().then(function() {
	server.listen(PORT, function(){
		console.log('TODO API');
	});
})