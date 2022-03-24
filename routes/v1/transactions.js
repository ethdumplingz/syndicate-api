const express = require('express'),
	router = express.Router();
const transactionsUtils = require("../../common/transactions/utils");
const Queue = require("bull");
const transactionsQueue = new Queue('transactions', process.env.INTERNALREDISCONNECTIONSTR);

router.post(`/get`, async(req, res) => {
	const loggingTag = `${req.path}`;
	let rj = {
		ok: false,
		transactions: [],
		errors: []
	},
		statusCode = 400;
	try{
		const {hashes} = req.body;
		const transactions = await transactionsUtils.get({hashes});
		if(transactions.length > 0){
			rj.transactions = transactions;
			rj.ok=true;
			statusCode=200;
		}
		
		console.info(`${loggingTag} looking for ${hashes.length} transactions, found ${transactions.length} transactions`);
		
		if(transactions.length !== hashes.length){//the size of the results did not match the num requested.
			// let's add items to the task queue for the items missing
			const hashesOfTransactionsFound = transactions.map(transaction => transaction.hash);
			console.info(`${loggingTag} hashes of transactions found`, hashesOfTransactionsFound);
			const hashesOfTransactionsToBeQueued = hashes.filter(hash => hashesOfTransactionsFound.indexOf(hash) === -1);
			hashesOfTransactionsToBeQueued.forEach(hash => {
				console.info(`${loggingTag}[hash:${hash}] Adding item to transactions queue to fetch from Alchemy API`);
				transactionsQueue.add({hash});//queue this with a delay from
			});
		}
		
	} catch(e){
		rj.errors.push(e);
	}
	res.status(statusCode).json(rj).end();
});

module.exports = router;