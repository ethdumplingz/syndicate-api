const express = require('express'),
	router = express.Router();

const collectionUtils = require("../../common/collections/utils");

router.get(`/test`, async (req, res, next) => {
	const loggingTag = `[path: ${req.path}]`;
	let rj = {
		ok: false,
		errors: []
	},
		statusCode = 400;
	
	try{
		const result = await collectionUtils.get();
		rj.ok = true;
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.status(statusCode).json(rj).end();
});

module.exports = router;