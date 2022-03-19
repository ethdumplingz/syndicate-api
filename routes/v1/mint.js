const express = require('express'),
	router = express.Router();

router.get("/status", (req, res) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			errors: [],
			live: false
		},
		statusCode = 400;
	
	try{
		rj.ok = true;
		const tsMintLiveInMs = 1647814380000
		rj.live = new Date().getTime() > tsMintLiveInMs;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	res.status(statusCode).json(rj).end();
});

module.exports = router;