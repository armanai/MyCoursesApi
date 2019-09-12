import { routes as userRouter } from './user'
import { routes as courseRouter } from './course'

export default function registerRoutes(router) {
	router.use('/api', userRouter().routes())
	router.use('/api', courseRouter().routes())
}
