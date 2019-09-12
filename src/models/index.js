import Sequelize from 'sequelize'
import config from '../config'
import User from './User'
import Course from './Course'

const sequelize = new Sequelize(
	config.db.dbname,
	config.db.username,
	config.db.password,
	{
		host: config.db.hostname,
		dialect: 'mysql',
		port: config.db.port,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		}
	}
)

const models = {
	User: User.init(sequelize, Sequelize),
	Course: Course.init(sequelize, Sequelize)
}

const db = {
	...models,
	sequelize
}

export default db
