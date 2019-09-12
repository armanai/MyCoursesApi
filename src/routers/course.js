import Router from 'koa-router'
import models from '../models'
import { NotFoundError } from '../errors'

async function getCourses(ctx) {
	const params = ctx.params

	let courses = await models.Course.getCourses(params.userId)

	if (!courses) {
		throw new NotFoundError({
			message: 'Could not find courses of user with id:' + params.userId
		})
	}

	ctx.status = 200
	ctx.body = { courses }
}

async function getCourse(ctx) {
	const params = ctx.query

	let course = await models.Course.getCourse(params.id)

	if (!course) {
		throw new NotFoundError({
			message: 'Could not find course with id:' + params.id
		})
	}

	ctx.status = 200
	ctx.body = { course }
}

async function createCourse(ctx) {
	const courseData = ctx.request.body.course

	const newCourse = await models.Course.create(courseData)

	ctx.status = 200
	ctx.body = { course: newCourse }
}

async function deleteCourse(ctx) {
	const params = ctx.params

	const deletedCourse = await models.Course.deleteCourse(params.id)

	ctx.status = 200
	ctx.body = { course: deletedCourse }
}

async function updateCourse(ctx) {
	const courseData = ctx.request.body.course

	let course = await models.Course.updateCourse(courseData)

	ctx.status = 200
	ctx.body = { course }
}

export function routes() {
	const router = new Router({
		prefix: '/course'
	})

	router
		.get('/single', getCourse)

		.get('/:userId', getCourses)

		.post('/', createCourse)

		.put('/', updateCourse)

		.delete('/:id', deleteCourse)

	return router
}
