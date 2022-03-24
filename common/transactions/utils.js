const db = require("../../db/mongo");//connecting to mongodb private service
require("dotenv").config();

const baseLoggingTag = `[TRANSACTIONS]`;

const getTransactionsFromDB = async ({hashes = []} = {}) => {
	const loggingTag = `${baseLoggingTag}[getTransactionsFromDB]`;
	let items = [];
	try{
		
		try{
			const client = await db.init();
			console.info(`${loggingTag} db client initialized!`);
			try{
				
				const	collection = await db.collection.init({client, collection:{name: db.collection.names.transactions}});
				const cursor = await collection.find({
					hash: {
						$in: hashes
					}
				});
				
				while(await cursor.hasNext()){
					const item = await cursor.next();
					items.push(item);
				}
				
			} catch(e){
				throw e;
			} finally {
				db.close({client});
			}
			
		} catch(e){
			throw e;
		}
		
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return items;
}

module.exports = {
	get: getTransactionsFromDB
}