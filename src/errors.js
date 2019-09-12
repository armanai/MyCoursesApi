export class BaseError extends Error {
	constructor(ExtendedError, data = {}) {
		super()

		Object.assign(this, data)
		Error.captureStackTrace(this, ExtendedError)
	}
}

export class ConflictError extends BaseError {
	constructor(data = {}) {
		super(ConflictError, {
			name: 'ConflictError',
			status: 409,
			message: 'The same item already exists',
			...data
		})
	}
}
