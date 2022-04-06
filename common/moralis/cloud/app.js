const baseLoggingTag = `[MORALIS]`;

// const {MORALIS_SERVER_URL:serverUrl, MORALIS_APP_ID:appId, MORALIS_MASTER_KEY:masterKey} = process.env;

// Moralis.start({serverUrl, appId, masterKey});

Moralis.Cloud.define("calculateProfitLoss", async (req) => {
	const logger = Moralis.Cloud.getLogger();
	const address  = req.user.get("ethAddress");
	// const address  = "0x35f80420bbdb358b6bf274038aed03b49235e9fc";
	// onzdroid
	// const address  = "0x94073592368E838dD614FA629B37F60ec7b1c3a4";
	//king
	// const address = "0xdb27B0b5dE1a7e84ce6c677d70D0Be015431FF8a";
	logger.info(`user object: ${JSON.stringify(req.user)}`);
	
	const web3 = Moralis.ethersByChain("0x1");
	
	const query = new Moralis.Query("EthNFTOwners");
	// query.equalTo("owner_of", address.toLowerCase());
	query.exists("name");
	const normalizedAddress = address.toLowerCase();
	const pipeline = [
		// only transfers to or from userAddress
		{
			match: {
				"owner_of": normalizedAddress
			}
		},
		{
			sort: {
				"updatedAt": -1
			}
		},
		// {
		// 	group:{
		// 		objectId: "$token_address"
		// 	}
		// },
		// {match: {$expr: {$or: [
		// 				{$eq: ["$from_address", userAddress]},
		// 				{$eq: ["$to_address", userAddress]},
		// 			]}}},
		
		// join to Token collection on token_address
		{lookup: {
				from: "EthNFTTransfers",
				let: {
					tokenAddress: "$token_address",
					tokenId: "$token_id",
					walletAddress: normalizedAddress
				},
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{$eq: ["$token_address", "$$tokenAddress"] },
									{$eq: ["$token_id", "$$tokenId"] },
									{$or:[
											{ $eq: ["$to_address", "$$walletAddress"] },
											{ $eq: ["$from_address", "$$walletAddress"] },
										]
									},
								]
							}
						},
					},
					{
						$sort: {
							"block_timestamp": -1
						}
					},
					{
						$limit: 1
					},
					{
						$lookup: {
							from: "EthTransactions",
							localField: "transaction_hash",
							foreignField: "hash",
							as: "transaction"
						}
					}
				],
				as: "transfers"
			}
		},
		{
			lookup: {
				from: "EthNFTCollections",
				localField: "token_address",
				foreignField: "address",
				as: "collection"
			}
		},
		{
			lookup: {
				from: "EthNFTCollectionStats",
				localField: "token_address",
				foreignField: "token_address",
				as: "stats"
			}
		},
		{
			group:{
				objectId: {
					token_address: "$token_address",
					name: "$name",
					collection: "$collection",
					stats: "$stats",
				},
				// objectId: "$token_address",
				transfers: {
					$push: {
						"$first" : "$transfers"
					}
				}
			}
		}
		// {
		// 	limit: 10
		// }
	];
	
	const results = await query.aggregate(pipeline);
	
	// return results;
	const {ethers} = web3;
	
	//util function for defining transactions
	const calcTransactionFee = ({transaction = {}}) => {
		let fee = 0;
		try{
			fee = ethers.utils.formatEther(ethers.BigNumber.from(ethers.utils.formatUnits(transaction.gas_price, "wei")).mul(ethers.BigNumber.from(ethers.utils.formatUnits(transaction.receipt_gas_used, "wei"))));
		} catch(e){
			logger.error(`Unable to calculate the fee for transaction: ${JSON.stringify(transaction)}`);
			throw e;
		}
		return fee;
	}
	
	//begin calculation
	let finalResults = []
	
	
	for(let i =0; i < results.length; i++){
	// for(let i =0; i < 5; i++){
		const project = results[i];
		// let row = Object.assign({}, project);
		const {objectId:info, transfers} = project;
		const {name = "", token_address = "", collection = [], stats = []} = info;
		let row = {
			name,
			token_address,
			num_tokens: transfers.length
		};
		if(collection.length > 0){
			const {dev_seller_fee_basis_points, opensea_seller_fee_basis_points, image_url, slug} = collection[0];
			
			// const {floor}
			// const {name, transfers} = project;
			row = Object.assign(row, {
				dev_seller_fee_basis_points,
				opensea_seller_fee_basis_points,
				image_url,
				slug,
			});
		}
		
		if(stats.length > 0 && typeof stats[0].floor_price !== "undefined"){
			const {floor_price} = stats[0];
			row = Object.assign(row, {floor_price});
		} else {
			row = Object.assign(row, {floor_price:0});
		}

		for(let j = 0; j < transfers.length; j++){
			const {transaction:transactionArray = []} = transfers[j];
			let transactionFee = "0",
				transactionHash = "",
				transactionValue = "0";
			if(transactionArray.length > 0){
				let transaction = transactionArray[0];
				
				transactionValue = ethers.utils.formatEther(transaction.value);
				transactionHash = transaction.hash;
				try{
					
					// transactionFee = ethers.utils.formatEther(ethers.BigNumber.from(ethers.utils.formatUnits(transaction.gas_price, "wei")).mul(ethers.BigNumber.from(ethers.utils.formatUnits(transaction.receipt_gas_used, "wei"))));
					transactionFee = calcTransactionFee({transaction});
					
				} catch(e){
					logger.error(`An error occurred parsing the fee for this transaction: ${JSON.stringify(transaction)}`);
					const freshTransactionData = await Moralis.Web3API.native.getTransaction({
						chain: "eth",
						transaction_hash: transaction.hash
					});
					logger.info(`latest transaction from web3 api: ${JSON.stringify(freshTransactionData)}`);
					transactionFee = calcTransactionFee({transaction:freshTransactionData});
					
				}
				
			}

			row = Object.assign(row, {
				value: parseFloat(transactionValue),
				fee: parseFloat(transactionFee),
				total_cost: parseFloat(transactionValue) + parseFloat(transactionFee),
				hash: transactionHash,
			});

		}

		finalResults.push(row);
	}
	
	return finalResults;
},{
	field: ["address"],
	requireUser: true //temporarily false.   should be true for production
});

Moralis.Cloud.define("getAllOwnedCollections", async (req) => {
	const logger = Moralis.Cloud.getLogger();
	const pipeline = [
		{
			group: {
				objectId: "$token_address"
			}
		}
	];
	const query = new Moralis.Query("EthNFTOwners");
	const tokenAddresses = await query.aggregate(pipeline)

	logger.info(`num address: ${tokenAddresses.length}`);
	const config = await Moralis.Config.get({useMasterKey: true});
	const osAPIKey = config.get("OS_API_Key");
	const ethNFTCollection = Moralis.Object.extend("EthNFTCollections");
	for (let i = 0; i < tokenAddresses.length; i++) {
	// for (let i = 0; i < 5; i++) {
		const address = tokenAddresses[i].objectId;
		logger.info(`address found: "${address}"`);
		
		try{
			const result = await Moralis.Cloud.httpRequest({
				url: `https://api.opensea.io/api/v1/asset_contract/${address}`,
				headers: {
					'X-API-KEY': osAPIKey
				}
			});
			if(result.status === 200){
				const collectionObj = new ethNFTCollection();
				const collectionData = result.data;
				logger.info(`response: ${JSON.stringify(result.data)}`);
				
				// collectionObj.set("name", collectionData.name);
				// collectionObj.set("description", collectionData.description);
				// collectionObj.set("image_url", collectionData.image_url);
				// collectionObj.set("banner_image_url", collectionData.collection.banner_image_url);
				// collectionObj.set("opensea_seller_fee_basis_points", collectionData.opensea_seller_fee_basis_points);
				// collectionObj.set("seller_fee_basis_points", collectionData.seller_fee_basis_points);
				// collectionObj.set("external_link", collectionData.external_link);
				// collectionObj.set("address", collectionData.address);
				// collectionObj.set("slug", collectionData.collection.slug);
				// collectionObj.set("discord_url", collectionData.collection.discord_url);
				// collectionObj.set("twitter_username", collectionData.collection.twitter_username);
				// collectionObj.set("total_supply", collectionData.total_supply);
				await collectionObj.save(collectionData);
			}
			
		} catch(e){
			logger.error(`An error occurred: ${JSON.stringify(e)}`);
		}
		
		// alert(object.id + ' - ' + object.get('ownerName'));
	}
	
	return tokenAddresses;
});

Moralis.Cloud.job("updateEthCollectionsClass",  async (req) => {
	const { params, headers, log, message } = req;
	message(`Retrieving the collections currently held by our holders`);
	const specificTokenAddress = params.input.token_address;
	log.info(`token address to get: ${specificTokenAddress}`);
	// return;
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
	const tokenAddresses = typeof specificTokenAddress !== "undefined" && specificTokenAddress.length > 0 ? [{objectId:specificTokenAddress}] : await query.aggregate(pipeline);
	
	const delay = (delayInMS = 250) => {
		return new Promise(resolve => {
			setTimeout(()=>{
				resolve();
			}, delayInMS);
		});
	}
	log.info(`num addresses: ${tokenAddresses.length}`);
	
	for (let i = 0; i < tokenAddresses.length; i++) {
	// for (let i = 0; i < 5; i++) {
		const loggingTag = `[${i+1} of ${tokenAddresses.length}]`;
		const address = tokenAddresses[i].objectId;
		log.info(`address found: "${address}"`);
		const queryForExistingEthCollectionInfo = new Moralis.Query(ethNFTCollection);
		queryForExistingEthCollectionInfo.equalTo("address", address);
		const existingEthCollectionInfo = await queryForExistingEthCollectionInfo.find();
		
		try{
			log.info(`Making request to opensea...`)
			const result = await Moralis.Cloud.httpRequest({
				url: `https://api.opensea.io/api/v1/asset_contract/${address}`,
				headers: {
					'X-API-KEY': osAPIKey
				}
			});
			if(result.status === 200){
				const collectionObj = existingEthCollectionInfo.length > 0 ? existingEthCollectionInfo[0] : new ethNFTCollection();

				const collectionData = result.data;

				log.info(`${loggingTag} response: ${JSON.stringify(result.data)}`);
				log.info(`${loggingTag} Saving collection data...`);
				await collectionObj.save(collectionData);
				log.info(`${loggingTag} Saved collection data!`);

			}

		} catch(e){
			log.error(`${loggingTag} An error occurred: ${JSON.stringify(e)}`);
		} finally {
			await delay(350);//adding 250 ms delay between each iteration
		}
	}
	log.info(`Finished!`)
});

Moralis.Cloud.job("updateETHCollectionStats",  async (req) => {
	const { params, headers, log, message } = req;
	const {start = 0, limit = 10000, apiKeyConfig = "OS_API_Key"} = params.input;
	message(`Retrieving the collections currently held by our holders`);
	const specificTokenAddress = params.input.token_address;
	
	const config = await Moralis.Config.get({useMasterKey: true});
	const osAPIKey = config.get(apiKeyConfig);
	const ethNFTCollection = Moralis.Object.extend("EthNFTCollections");
	const query = new Moralis.Query(ethNFTCollection);
	// query.doesNotExist("stats");//temporary
	if(typeof specificTokenAddress === "string" && specificTokenAddress.length > 0){
		query.equalTo("address", specificTokenAddress);
	} else {
		query.skip(start);
		query.ascending("updatedAt");
		query.limit(limit);//by default the limit is 100 otherwise
	}
	const queryResults = await query.find();
	//artificial delay
	const delay = (delayInMS = 250) => {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, delayInMS);
		});
	}
	
	const ethNFTCollectionStats = Moralis.Object.extend("EthNFTCollectionStats");
	// log.info(`Num results found: ${queryResults.length}`);
	for (let i =0; i < queryResults.length; i++){
	// for (let i =0; i < 10; i++){
		const loggingTag = `[${i+1} of ${queryResults.length}]`;
		const existingCollectionObj = queryResults[i];
		
		const queryForExistingStats = new Moralis.Query(ethNFTCollectionStats);
		const tokenAddress = existingCollectionObj.get("address");
		log.info(`${loggingTag} query for collection stats where token_address = ${tokenAddress}`)
		queryForExistingStats.equalTo("token_address", tokenAddress);
		const existingCollectionStats = await queryForExistingStats.find();
		log.info(`${loggingTag} Num results found for "${tokenAddress}": ${existingCollectionStats.length}`);
		
		const ethCollectionStat = existingCollectionStats.length > 0 ? existingCollectionStats[0] : new ethNFTCollectionStats();
		
		
		try {
			const collectionInfo = existingCollectionObj.get("collection");
			log.info(`${loggingTag} collection slug: ${collectionInfo.slug}`);
			try{
				const result = await Moralis.Cloud.httpRequest({
					url: `https://api.opensea.io/api/v1/collection/${collectionInfo.slug}/stats`,
					headers: {
						'X-API-KEY': osAPIKey
					}
				});
				if(result.status === 200){
					// const collectionObj = new ethNFTCollection();
					const collectionStats = result.data;
					const {stats} = result.data;
					log.info(`${loggingTag} response: ${JSON.stringify(stats)}`);
					existingCollectionObj.set("stats", collectionStats.stats);
					log.info(`${loggingTag} Saving collection stats for slug: "${collectionInfo.slug}"`);
					let finalObjToSave = Object.assign({
						token_address: existingCollectionObj.get("address"),
						slug: collectionInfo.slug
					}, stats);
					await ethCollectionStat.save(finalObjToSave);
					log.info(`${loggingTag} Saved collection stats for slug: "${collectionInfo.slug}"!`);
				}
			} catch(e){
				log.error(`${loggingTag} Error: ${JSON.stringify(e)}`);
				if(typeof e.response === "object"){
					log.error(`${loggingTag} Error occurred! status code returned: ${e.response.status}`);
					if (e.response.status === 404){
						//this collection doesn't exist anymore.   let's delete it
						log.info(`${loggingTag} Collection w/ slug: ${collectionInfo.slug} returned a 404.   Deleting from cloud`);
						await existingCollectionObj.destroy();
					}
				}
			}

		} catch(e){
			log.error(`${loggingTag} Error occurred! status code returned: ${JSON.stringify(e)}`);
		} finally {
			const timeDelay = 250;
			log.info(`${loggingTag} waiting ${timeDelay}ms...`);
			await delay(timeDelay);//adding 250 ms delay between each iteration
			log.info(`${loggingTag} done waiting!`);
		}
	}
	log.info(`Finished!`);
});