const asynchandler = (func) => async (req, res, next) => {
	try {
		await func(req, res, next);
	} catch (error) {
		const statusCode = error?.statuscode || error?.statusCode || 500;
		return res.status(statusCode).json({
			success: false,
			message: error?.message || "Internal Server Error",
		});
	}
};
export default asynchandler;
