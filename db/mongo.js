const appLoggingTag = `[db]`;
const { MongoClient } = require('mongodb');
const {logger:log} = require('../common/logs/utils');
require("dotenv").config();

// Connection URL
const url = process.env.MONGO_CONNECT_URL;


const dbName = `syndicate`,
	tableNames = {
		items: `collections`
	}

// Database Name

async function main({} = {}) {
	
	const client = new MongoClient(url);
	// Use connect method to connect to the server
	await client.connect();
	console.log('Connected successfully to server');
	const db = client.db(dbName);
	
	// the following code examples can be pasted here...
	
	return client;
}

const initCollection = async ({client = false, collection:collectionInfo = {}} = {}) => {
	const loggingTag = `${appLoggingTag}[initCollection]`;
	try{
		const db = client.db(dbName);
		return db.collection(collectionInfo.name);
	} catch(e){
		log.error(`${loggingTag} Error occurred init-ing collection`, e);
		throw e;
	}
}

const insertRows = async ({rows = [], collection} = {}) => {
	const loggingTag = `${appLoggingTag}[insertRows]`;
	try{
		if(typeof collection === "undefined"){
			return new Error('missing collection!');
		} else if (rows.length < 1){
			return new Error('missing rows to inset');
		} else {
			const insertResult = await collection.insertMany(rows);
			console.log('Inserted documents =>', insertResult);
		}
	} catch(e){
		log.error(`${loggingTag} Error`, e);
		return e;
	}
}

const upsertDocument = async ({id = '', document, collection} = {}) => {
	const loggingTag = `${appLoggingTag}[insertRows]`;
	try{
		if(typeof collection === "undefined"){
			return new Error('missing collection!');
		} else if (typeof document !== "object"){
			return new Error('missing document to insert');
		} else {
			const insertResult = await collection.updateOne(
				{_id: id},
				{$set: document},
				{upsert: true}
			)
			log.info(`${loggingTag} Successfully upserted document w/ ID: "${id}"`);
			// console.log('Inserted documents =>', insertResult);
			return insertResult;
		}
	} catch(e){
		log.error(`${loggingTag} Error`, e);
		return e;
	}
}

const initDB = async ({name = dbName} = {}) => {
	const loggingTag = `${appLoggingTag}[initDB]`;
	try{
		log.info(`${loggingTag} db name: ${name}`);
		return main({name});
	} catch(e){
		log.error(`${loggingTag} Error`, e)
		throw e;
	}
}

const closeDB = ({client}) => {
	const loggingTag = `${appLoggingTag}[closeDB]`
	try{
		client.close();
		log.info(`${loggingTag} client closed!`);
	} catch(e){
		log.error(`${loggingTag} error:`, e);
	}
}

const updateDocument = async  ({id = '', options, collection} = {}) => {
	const loggingTag = `${appLoggingTag}[insertRows]`;
	try{
		if(typeof collection === "undefined"){
			throw new Error('missing collection!');
		} else {
			const insertResult = await collection.updateOne(
				{_id: id},
				options,
				{
					upsert:true
				}
			)
			log.info(`${loggingTag} Successfully upserted document w/ ID: "${id}"`);
			console.log('Inserted documents =>', insertResult);
		}
	} catch(e){
		log.error(`${loggingTag} Error`, e);
		throw e;
	}
}

module.exports = {
	init: initDB,
	collection:{
		init:initCollection,
		upsert: upsertDocument,
		update: updateDocument,
		names: tableNames
	},
	close: closeDB,
	name: dbName
}