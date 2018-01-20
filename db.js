var Sequelize = require('sequelize');
var environment = process.env.NODE_env || 'development';
var sequelize;

if(environment === 'production'){
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined,undefined,undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/todo-api.sqlite'
	});
}

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo-api.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize

module.exports = db;