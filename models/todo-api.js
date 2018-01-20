module.exports = function(sequelize,data){
	return sequelize.define('todo', {
		description: {
			type: data.STRING,
			allowNull: false,
			validate: {
				len: [1,300]
			}
		}, 
		completed: {
			type: data.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};