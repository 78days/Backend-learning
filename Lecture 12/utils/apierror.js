export class apierrorhandler extends Error {
	constructor(
		statuscode = 500,
		message = "error message in apierror",
		errors = [],
	) {
		super(message);
		this.statuscode = statuscode;
		this.errors = errors;
		this.data = null;
	}
}
