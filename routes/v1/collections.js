const express = require('express'),
	router = express.Router();

const Queue = require("bull");
const collectionsQueue = new Queue('collections', process.env.INTERNALREDISCONNECTIONSTR);
const collectionsUtils = require("../../common/collections/utils");
const transactionsUtils = require("../../common/transactions/utils");

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

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
				const queueDelay = getRandomInt(10000);
				console.info(`${loggingTag}[id:${id}] Adding item to collections queue (w/ a delay of ${queueDelay}ms) to fetch info from OS`);
				
				collectionsQueue.add({id}, {delay: queueDelay});//queue this with a delay from
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

router.post(`/get-bulk`, async(req, res) => {
	const loggingTag = `${req.path}`;
	let rj = {
			ok: false,
			collections: [],
			errors: []
		},
		statusCode = 400;
	try{
		const {addresses} = req.body;
		const collections = await collectionsUtils.get({addresses});
		if(collections.length > 0){
			rj.collections = collections;
			rj.ok = true;
			statusCode=200;
		}
		
		console.info(`${loggingTag} looking for ${addresses.length} collections, found ${collections.length} collections`);
		
		if(collections.length !== addresses.length){//the size of the results did not match the num requested.
			// let's add items to the task queue for the items missing
			const addressesOfCollectionsFound = collections.map(collection => collection._id);
			console.info(`${loggingTag} ${addressesOfCollectionsFound.length} collections found`);
			const addressesOfCollectionToBeQueued = addresses.filter(address => addressesOfCollectionsFound.indexOf(address) === -1);
			console.info(`${loggingTag} queuing ${addressesOfCollectionToBeQueued.length} collections to be fetched...`);
			addressesOfCollectionToBeQueued.forEach(address => {
				const queueDelay = getRandomInt(10000);
				console.info(`${loggingTag}[address:${address}] Adding item to collections queue (w/ a delay of ${queueDelay}ms) to fetch info from OS`);
				collectionsQueue.add({id:address}, {delay: queueDelay});//queue this with a delay from
			});
		}
		
	} catch(e){
		rj.errors.push(e);
	}
	res.status(statusCode).json(rj).end();
});

module.exports = router;