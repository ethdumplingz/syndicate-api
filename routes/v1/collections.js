const express = require('express'),
	router = express.Router();

const collectionUtils = require("../../common/collections/utils");

router.get(`/get/:id`, async (req, res, next) => {
	const loggingTag = `[path: ${req.path}]`;
	let rj = {
		ok: false,
		errors: []
	},
		statusCode = 400;
	
	try{
		const {id} = req.params;
		try{
			const result = await collectionUtils.get({address:id});
			if(result){
				rj.ok = true;
				statusCode = 200;
			} else {//no error, collection just wasn't found in our db.   we should try to fetch it from the OS API
				collectionUtils.fetch({id});
			}
		} catch(e){
			rj.errors.push(e);
		}
		
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.status(statusCode).json(rj).end();
});

module.exports = router;