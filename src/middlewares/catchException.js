export default function catchException() {
	return async function middleware(ctx, next) {
		try {
			await next()
		} catch (exception) {
			ctx.status = exception.status || 500
			ctx.body = { message: exception.message }
		}
	}
}
