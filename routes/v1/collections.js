const express = require('express'),
	router = express.Router();

const Queue = require("bull");
const collectionsQueue = new Queue('collections', process.env.INTERNALREDISCONNECTIONSTR);
const collectionsUtils = require("../../common/collections/utils");

router.get(`/get/:id`, async (req, res, next) => {
	const loggingTag = `[path: ${req.path}]`;
	let rj = {
		ok: false,
		collection: false,
		errors: []
	},
		statusCode = 400;
	
	try{
		const {id} = req.params;
		try{
			const result = await collectionsUtils.get({address:id});
			if(result){
				rj.collection = result;
				rj.ok = true;
				statusCode = 200;
			} else {//no error, collection just wasn't found in our db.   we should try to fetch it from the OS API
				// collectionsUtils.fetch({id});
				//add an item to the queue
				console.info(`${loggingTag}[id:${id}] Adding item to collections queue to fetch info from OS`);
				
				collectionsQueue.add({id});
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