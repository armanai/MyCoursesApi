import Koa from 'koa'
import Router from 'koa-router'
import registerRoutes from './routers'
import catchException from './middlewares/catchException'
import jwt from './middlewares/jwt'
import models from './models'
import koaBody from 'koa-body'
import cors from 'kcors'

const app = new Koa()
let router = Router()

app.use(catchException())

registerRoutes(router)

app
	.use(cors())
	.use(koaBody())
	.use(router.routes())

app.listen(5000, () => {
	console.log(`Server running on port 5000`)

	models.sequelize
		.authenticate()
		.then(() => {
			console.log('Connection has been established successfully.')
		})
		.catch(err => {
			console.error('Unable to connect to the database.', err)
		})

	models.sequelize.sync()
})
