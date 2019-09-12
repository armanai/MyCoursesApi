import Sequelize from 'sequelize'

export default class User extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				email: {
					type: DataTypes.STRING,
					unique: true
				},
				firstName: {
					type: DataTypes.STRING
				},
				lastName: {
					type: DataTypes.STRING
				},
				password: {
					type: DataTypes.STRING(60)
				}
			},
			{
				sequelize,
				modelName: 'user'
			}
		)
	}

	static async getUser(email) {
		return this.findOne({ where: { email } })
	}

	static createUser({ email, firstName, lastName, password }) {
		return this.create({ email, firstName, lastName, password })
	}
}
