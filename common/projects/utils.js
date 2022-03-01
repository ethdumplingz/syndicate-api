const db = require("../../db/utils");
const baseAppLoggingTag = `[PROJECTS]`;

const table = `projects`;

const insertProject = async ({title = '', description = '', website_url = '', twitter_url = '', discord_url= '', is_discord_open= true, presale_price = 0, sale_unit = "ETH", ts_presale_start = 0, ts_presale_end = 0, wl_register_url = ""} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[insertProject]`;
	let outcome;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const insertQuery = {
			name: `add-project`,
			text: `INSERT INTO ${table}(title, description, website_url, twitter_url, discord_url, is_discord_open, presale_price, sale_unit, ts_presale_start, ts_presale_end, wl_register_url) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
			values: [title, description, website_url, twitter_url, discord_url, is_discord_open, presale_price, sale_unit, ts_presale_start, ts_presale_end, wl_register_url]
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

const getProjects = async ({} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getProjects]`;
	let projects = [];
	try {
		let client;
		try{
			client = await db.connection.get();
			const getQuery = {
				name: `get-projects`,
				text: `SELECT * FROM ${table}`,
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

module.exports = {
	insert: insertProject,
	get: getProjects
}