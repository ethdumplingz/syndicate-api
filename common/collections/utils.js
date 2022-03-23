const db = require("../../db/mongo");//connecting to mongodb private service
const axios = require("axios");
require("dotenv").config();

const baseURIs = {
	os: "https://api.opensea.io/api"
}

const baseLoggingTag = `[COLLECTIONS]`;


const getCollectionFromDB = async ({address = ''} = {}) => {
	const loggingTag = `${baseLoggingTag}[getCollection]`;
	let item = false;
	try{
		
		try{
			const client = await db.init();
			console.info(`${loggingTag} db client initialized!`);
			try{
				
				const	collection = await db.collection.init({client, collection:{name: db.collection.names.collections}});
				const cursor = await collection.find({
					_id:address
				});
				
				while(await cursor.hasNext()){
					item = await cursor.next();
				}
				
			} catch(e){
				throw e;
			}
		} catch(e){
			throw e;
		}
		
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return item;
}

const upsertCollectionIntoDB = async ({collection} = {}) => {
	const loggingTag = `${baseLoggingTag}[upsertCollection]`;
	try{
		if(Object.keys(collection).length === 0){
			throw new Error(`No collection information to insert!`);
		} else {
			try{
				const client = await db.init();
				console.info(`${loggingTag} db client initialized!`);
				
				try{
					const collectionID = collection._id;
					const	dbCollection = await db.collection.init({client, collection:{name: db.collection.names.collections}});
					console.info(`${loggingTag} inserting a project w/ ID ${collectionID} into the db...`);
					let result = await dbCollection.upsert({
						id: collectionID,
						document: collection,
						collection: dbCollection
					});
					console.info(`${loggingTag} result of upsert`, result);
				} catch(e){
					throw e;
				} finally {
					db.close({client});
				}
			} catch(e){
				throw e;
			}
		}
	} catch(e){
		throw e;
	}
}

const getCollectionContractInfo = async ({address=""}) => {
	const loggingTag = `[getCollectionContractInfo]`;
	let info;
	if(address.length > 0){
		try{
			let result = await axios.get(`${baseURIs.os}/v1/asset_contract/${address}`,{
				headers:{
					'X-API-KEY': process.env.OS_API_KEY
				}
			});
			console.info(`${loggingTag} response code: ${result.status}`);
			
			if(result.status === 200){
				console.info(`${loggingTag} `)
				info = result.data.collection;
			} else {
				throw new Error(`Unrecognized status from OS: ${result.status}`);
			}
			
			
		} catch (e){
			console.error(`${loggingTag} Error:`, e);
			throw e;
		}
	} else {
		throw new Error("Missing contract address to query for!");
	}
	return info;
}

const getCollectionStats = async ({slug = "", collection:collectionInfo = {}, address = ''}) => {
	const loggingTag = `[getCollectionStats]`;
	let stats;
	try{
		if(typeof slug !== "string"){
			throw new Error(`${loggingTag} Unrecognized slug data type: ${typeof slug}`);
		} else if(slug.length < 1){
			throw new Error(`${loggingTag} slug missing!`);
		} else {
			//valid slug
			let result = await axios.get(`${baseURIs.os}/v1/collection/${slug}/stats`,{
				headers:{
					'X-API-KEY': process.env.OS_API_KEY
				}
			});
			
			if(result.status === 200){
				const payload = stats = result.data;
				console.info(`${loggingTag} full payload`, payload);
			} else {
				throw new Error(`${loggingTag} Response error received:`, result);
			}
			
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return stats;
}

const fetchCollectionInfoAndUpsert = async ({id = ""} = {}) => {
	const loggingTag = `${baseLoggingTag}[fetchCollectionInfoAndUpsert][id:${id}]`;
	try{
		let timerLabel = `${loggingTag} time to fetch and upsert collection`;
		console.time(timerLabel);
		console.info(`${loggingTag} Getting contract info...`);
		let collectionInfo = await getCollectionContractInfo({address:id});
		console.info(`${loggingTag} Got contract info!`, collectionInfo);
		const collectionSlug = collectionInfo.slug;
		console.info(`${loggingTag} Getting collection stats...`);
		let stats = await getCollectionStats({slug: collectionSlug});
		console.info(`${loggingTag} got collection stats!`, stats);
		let finalRow = Object.assign(collectionInfo, stats);
		finalRow._id = id;
		console.info(`${loggingTag} upseting collection into db...`);
		let upsertResult = await upsertCollectionIntoDB({collection: finalRow});
		console.info(`${loggingTag} upsert result`, upsertResult);
		console.timeEnd(timerLabel);
	} catch(e){
		throw e;
	}
}

module.exports = {
	get: getCollectionFromDB,
	add: upsertCollectionIntoDB,
	fetch: fetchCollectionInfoAndUpsert
}