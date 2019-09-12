import Sequelize from 'sequelize'
import { omit } from 'lodash'

export default class Course extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				userId: {
					type: DataTypes.INTEGER
				},
				name: {
					type: DataTypes.STRING
				},
				credits: {
					type: DataTypes.STRING
				},
				instructorName: {
					type: DataTypes.STRING
				}
			},
			{
				sequelize,
				modelName: 'course'
			}
		)
	}

	static async getCourses(userId) {
		return this.findAll({ where: { userId } })
	}

	static async getCourse(id) {
		return this.findOne({ where: { id } })
	}

	static async deleteCourse(id) {
		const condition = { where: { id } }

		return this.findOne(condition).then(result =>
			this.destroy(condition).then(() => result)
		)
	}

	static async updateCourse(course) {
		const condition = { where: { id: course.id } }

		const returnCondition = {
			where: { id: course.id }
		}

		const courseToUpdate = omit(course, 'id')

		return this.update(courseToUpdate, condition).then(() =>
			this.findOne(returnCondition)
		)
	}
}
