import jwt from 'koa-jwt'
import config from '../config'

export default jwt({
	secret: config.JWT_KEY
})
