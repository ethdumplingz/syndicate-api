const Moralis = require('moralis/node');
const axios = require("axios");
require("dotenv").config();
const {ethers} = require("ethers");

const baseLoggingTag = `[MORALIS]`;

const {MORALIS_SERVER_URL:serverUrl, MORALIS_APP_ID:appId, MORALIS_MASTER_KEY:masterKey} = process.env;

const getNFTsOwnedByAddress = async ({address = ""} = {}) => {
	const loggingTag = `${baseLoggingTag}[getNFTsOwnedByAddress][addr:${address}]`;
	let results = [];
	try{
		await Moralis.start({serverUrl, appId, masterKey});
		const EthTransactions = Moralis.Object.extend("EthNFTOwners");
		const query = new Moralis.Query(EthTransactions);
		query.equalTo("owner_of", address.toLowerCase());
		query.limit(1000);
		results = await query.find();//executing the query
		console.info(`${loggingTag} results found!`, results.length);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return results;
}


const getNFTTransfersFromAddress = async ({address = ""} = {}) => {
	const loggingTag = `${baseLoggingTag}[getNFTTransfersFromAddress][addr:${address}]`;
	try{
		await Moralis.start({serverUrl, appId, masterKey});
		const EthTransactions = Moralis.Object.extend("EthNFTTransfers");
		const toAddressQuery = new Moralis.Query(EthTransactions);
		toAddressQuery.equalTo("to_address", address);
		
		const fromAddressQuery = new Moralis.Query(EthTransactions);
		fromAddressQuery.equalTo("from_address", address);
		
		const query = Moralis.Query.or(toAddressQuery,fromAddressQuery);
		query.equalTo("from_address", address);
		
		query.limit(1000);
		const results = await query.find();//executing the query
		console.info(`${loggingTag} results found!`, results.length);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
}

const getTransactionsForAddress = async ({ address = ""} = {}) => {
	const loggingTag = `${baseLoggingTag}[getTransactionsForAddress][addr:${address}]`;
	try{
		await Moralis.start({serverUrl, appId, masterKey});
		const EthTransactions = Moralis.Object.extend("EthTransactions");
		const query = new Moralis.Query(EthTransactions);
		query.equalTo("from_address", address);
		query.limit(1000);
		const results = await query.find();//executing the query
		console.info(`${loggingTag} results found!`, results.length);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
}

const testMoralisSpeed = async ({address = ""} = {}) => {
	const loggingTag = `${baseLoggingTag}[testMoralisSpeed]`;
	const timerLabel = `Whole process took`;
	console.time(timerLabel);
	let normalizedAddress = address.toLowerCase();
	
	const results = await getNFTsOwnedByAddress({address:normalizedAddress});
	
	console.info(`${loggingTag} num results:`, results.length);
	await getNFTTransfersFromAddress({address:normalizedAddress});
	await getTransactionsForAddress({address:normalizedAddress});
	console.timeEnd(timerLabel);
}

// testMoralisSpeed({address: "0x35f80420bbDB358b6bf274038aeD03B49235E9fC"})

const delay = (delayInMS = 250) => {
	return new Promise(resolve => {
		setTimeout(()=>{
			resolve();
		}, delayInMS);
	});
}

const cacheOSCollectionData = async ({} = {}) => {
	const loggingTag = `${baseLoggingTag}[cacheOSCollectionData]`
	// console.info(`${loggingTag} process env`, process.env);
	// console.info(`${loggingTag} server url: ${serverUrl}, app id: ${appId}, master key: ${masterKey}`);
	await Moralis.start({serverUrl, appId, masterKey});
	const config = await Moralis.Config.get({useMasterKey: true});
	const osAPIKey = config.get("OS_API_Key");
	const ethNFTCollection = Moralis.Object.extend("EthNFTCollections");
	
	const query = new Moralis.Query("EthNFTOwners");
	const pipeline = [
		{
			group: {
				objectId: "$token_address"
			}
		}
	];
	const tokenAddresses = await query.aggregate(pipeline);
	
	const delay = (delayInMS = 250) => {
		return new Promise(resolve => {
			setTimeout(()=>{
				resolve();
			}, delayInMS);
		});
	}
	console.info(`num addresses: ${tokenAddresses.length}`);
	
	for (let i = 0; i < tokenAddresses.length; i++) {
	// for (let i = 0; i < 5; i++) {
		const {objectId: address} = tokenAddresses[i];
		const loggingTag = `[${i+1} of ${tokenAddresses.length}]`;
		
		// console.info(`address found: "${address}"`);
		const queryForExistingEthCollectionInfo = new Moralis.Query(ethNFTCollection);
		queryForExistingEthCollectionInfo.equalTo("address", address);
		const existingEthCollectionInfo = await queryForExistingEthCollectionInfo.find();
		if(address.toLowerCase() === "0xea5f32ed4044c44c44ab833d8071e672aad142ff"){
			console.info(`${loggingTag} Found this fucking address! ${address}`);
		}
		try{
			const result = await axios({
				url: `https://api.opensea.io/api/v1/asset_contract/${address}`,
				headers: {
					'X-API-KEY': osAPIKey
				}
			});
			if(result.status === 200){
				const collectionObj = existingEthCollectionInfo.length > 0 ? existingEthCollectionInfo[0] : new ethNFTCollection();
				
				const collectionData = result.data;
				
				console.info(`${loggingTag} response: ${JSON.stringify(result.data)}`);
				console.info(`${loggingTag} Saving collection data...`);
				await collectionObj.save(collectionData);
				console.info(`${loggingTag} Saved collection data!`);
				
			}
			
		} catch(e){
			console.error(`${loggingTag} An error occurred:`, e);
		} finally {
			await delay(100);//adding 250 ms delay between each iteration
		}
	}
}

cacheOSCollectionData();