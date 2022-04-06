
const express = require('express'),
	router = express.Router();

router.get(`/profit-loss`, async (req, res) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			collections: [],
			errors: []
		},
		statusCode = 400;
	
	try{
		const {address} = req.query;
		console.info(`${loggingTag} wallet address: ${address}`);
		
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.status(statusCode).json(rj).end();
});

module.exports = router;