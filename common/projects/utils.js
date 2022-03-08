const db = require("../../db/utils");
const baseAppLoggingTag = `[PROJECTS]`;

const table = `projects`;
const statusesTable = `user_project_statuses`;

const insertProject = async ({id, title = '', description = '', website_url = '', twitter_url = '', discord_url= '', is_discord_open= true, presale_price = 0, sale_unit = "ETH", ts_presale_start = 0, ts_presale_end = 0, wl_register_url = "", max_supply = 0, max_per_transaction = 0, max_per_wallet = 0} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[insertProject]`;
	let outcome;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const insertQuery = {
			name: `add-project`,
			text: `INSERT INTO ${table}(id, title, description, website_url, twitter_url, discord_url, is_discord_open, presale_price, sale_unit, ts_presale_start, ts_presale_end, wl_register_url, max_supply, max_per_transaction, max_per_wallet) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
			values: [id, title, description, website_url, twitter_url, discord_url, is_discord_open, presale_price, sale_unit, ts_presale_start, ts_presale_end, wl_register_url, max_supply, max_per_transaction, max_per_wallet]
		};
		console.info(`${loggingTag} adding project. query`, insertQuery);
		const result = outcome = await client.query(insertQuery);
		console.info(`${loggingTag} project added! result:`, result);
		await db.connection.release({client});
	} catch(e){
		// console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return outcome;
}

const updateProject = async ({id, title = '', description = '', website_url = '', twitter_url = '', discord_url= '', is_discord_open= true, presale_price = 0, sale_unit = "ETH", ts_presale_start = 0, ts_presale_end = 0, wl_register_url = "", max_supply = 0, max_per_transaction = 0, max_per_wallet = 0} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[updateProject]`;
	let outcome;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const updateQuery = {
			text: `UPDATE ${table} SET title = $2, description = $3, website_url = $4, twitter_url = $5, discord_url = $6, is_discord_open = $7, presale_price = $8, sale_unit = $9, ts_presale_start = $10, ts_presale_end = $11, wl_register_url = $12, max_supply = $13, max_per_transaction = $14, max_per_wallet = $15 WHERE id = $1`,
			values: [id, title, description, website_url, twitter_url, discord_url, is_discord_open, presale_price, sale_unit, ts_presale_start, ts_presale_end, wl_register_url, max_supply, max_per_transaction, max_per_wallet]
		};
		
		console.info(`${loggingTag} updating project. query`, updateQuery);
		try{
			const result = outcome = await client.query(updateQuery);
			console.info(`${loggingTag} project update! result:`, result);
		} finally {
			await db.connection.release({client});
		}
		
	} catch(e){
		// console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return outcome;
}

const deleteProject = async ({id = ""} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[deleteProject]`;
	let outcome = false;
	try{
		const client = await db.connection.get();
		
		try{
			const deleteProjectStatusesQuery = {
				text: `DELETE FROM ${statusesTable} where project_id = $1`,
				values: [id]
			}
			await client.query(deleteProjectStatusesQuery);//deleting the associated project statuses because of a foreign key constraint
			
			const deleteQuery = {
				text: `DELETE FROM ${table} WHERE id = $1`,
				values: [id]
			}
			const result = outcome = await client.query(deleteQuery);
			console.info(`${loggingTag} project delete! result:`, result);
		} finally {
			await db.connection.release({client});
		}
		
	} catch (e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return outcome;
}

const getProjects = async ({} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getProjects]`;
	let projects = [];
	
	try {
		let client;
		try{
			client = await db.connection.get();
			const getQuery = {
				name: `get-projects`,
				text: `SELECT * FROM ${table} WHERE ts_presale_end >= NOW() ORDER BY ts_presale_start ASC`,
				values: []
			};
			
			console.info(`${loggingTag} getting projects...`);
			const result = await client.query(getQuery);
			projects = result.rows;
			console.info(`${loggingTag} got projects:`, projects);
		} finally {
			db.connection.release({client});
		}
		
	} catch(e){
		throw e;
	}
	return projects;
}

const getSingleProject = async ({id=""} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getSingleProject]`;
	let projects = [];
	if(id.length < 1){
		throw new Error("Missing ID of project to retrieve");
	} else {
		try {
			
			const client = await db.connection.get();
			const getQuery = {
				name: `get-project-${id}`,
				text: `SELECT * FROM ${table} WHERE id = $1`,
				values: [id]
			};
			
			console.info(`${loggingTag} getting projects...`);
			try{
				const result = await client.query(getQuery);
				projects = result.rows;
				console.info(`${loggingTag} got projects:`, projects);
			} finally {
				await db.connection.release({client});
			}
			
		} catch(e){
			throw e;
		}
	}
	
	return projects;
}

module.exports = {
	insert: insertProject,
	update: updateProject,
	delete: deleteProject,
	get: getProjects,
	getSingle: getSingleProject,
}