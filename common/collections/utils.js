const db = require("../../db/mongo");//connecting to mongodb private service
const baseLoggingTag = `[COLLECTIONS]`;

const getCollection = async () => {
	const loggingTag = `${baseLoggingTag}[getCollection]`;
	try{
		
		try{
			const client = await db.init();
			console.info(`${loggingTag} db client initialized!`);
		} catch(e){
			throw e;
		}
		
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
}

module.exports = {
	get: getCollection
}