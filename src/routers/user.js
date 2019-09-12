import Router from 'koa-router'
import models from '../models'
import bcrypt from 'bcrypt'
import { pick } from 'lodash'
import jsonwebtoken from 'jsonwebtoken'
import config from '../config'
import { ConflictError } from '../errors'

async function register(ctx, next) {
	const user = ctx.request.body

	user.password = await bcrypt.hash(user.password, 5)
	const existUser = await models.User.getUser(user.email)

	if (existUser) {
		throw new ConflictError({ message: 'User Exists' })
	}

	const newUser = await models.User.createUser(user)

	ctx.status = 200
	ctx.body = {
		user: pick(newUser, ['id', 'email', 'firstName', 'lastName']),
		token: jsonwebtoken.sign(
			{
				data: { ...pick(newUser, ['id', 'email', 'firstName', 'lastName']) }
			},
			config.JWT_KEY
		)
	}
}

async function login(ctx, next) {
	const credentials = ctx.request.body

	const user = await models.User.getUser(credentials.email)

	if (!user) {
		throw Error('Authentication failed')
	}

	const { password, ...userWithoutPassword } = pick(user.dataValues, [
		'id',
		'password',
		'email',
		'firstName',
		'lastName'
	])

	if (await bcrypt.compare(credentials.password, password)) {
		ctx.status = 200
		ctx.body = {
			user: { data: { ...userWithoutPassword } },
			token: jsonwebtoken.sign(
				{
					data: { ...userWithoutPassword }
				},
				config.JWT_KEY
			)
		}
	} else {
		throw Error('Authentication failed')
	}
}

async function loadFromToken(ctx) {
	const params = ctx.query

	let tokenUser = null

	try {
		tokenUser = jsonwebtoken.verify(params.token, config.JWT_KEY)
	} catch (error) {
		throw new Error('Authentication failed')
	}

	const user = await models.User.getUser(tokenUser.data.email)

	if (!user) {
		throw Error('Authentication failed')
	}

	const { password, ...userWithoutPassword } = pick(user.dataValues, [
		'id',
		'password',
		'email',
		'firstName',
		'lastName'
	])

	ctx.status = 200
	ctx.body = {
		user: { data: { ...userWithoutPassword } },
		token: jsonwebtoken.sign(
			{
				data: { ...userWithoutPassword }
			},
			config.JWT_KEY
		)
	}
}

export function routes() {
	const router = new Router({
		prefix: '/user'
	})

	router
		.post('/register', register)
		.post('/login', login)
		.get('/token', loadFromToken)

	return router
}
