const db = require("../../db/utils");
const baseAppLoggingTag = `[PROJECTS]`;

const table = `projects`;

const insertProject = async ({title = '', description = '', website_url = ''} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[insertProject]`;
	let outcome;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const insertQuery = {
			name: `add-project`,
			text: `INSERT INTO ${table}(title, description, website_url) values($1, $2, $3)`,
			values: [title, description, website_url]
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
		const client = await db.connection.get();
		
		const getQuery = {
			name: `get-projects`,
			text: `SELECT * FROM ${table}`,
			values: []
		};
		
		console.info(`${loggingTag} getting projects...`);
		const result = await client.query(getQuery);
		projects = result.rows;
		console.info(`${loggingTag} got projects:`, projects);
		
	} catch(e){
		throw e;
	}
	return projects;
}

module.exports = {
	insert: insertProject,
	get: getProjects
}