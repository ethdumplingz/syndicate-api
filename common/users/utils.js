const db = require("../../db/utils");
const baseAppLoggingTag = `[PROJECTS]`;

const table = `team`;

const checkIfUserIsPartOfTeam = async ({user:address = ""} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[checkIfUserIsPartOfTeam]`;
	let check = false;
	try{
		const client = await db.connection.get();
		const getQuery = {
			text: `SELECT * FROM ${table} WHERE wallet_address = $1`,
			values: [address]
		};
		console.info(`${loggingTag} check if user ${address} is an admin...`);
		try{
			const result = await client.query(getQuery);
			check = result.rows.length > 0;
			// console.info(`${loggingTag} result:`, result);
			console.info(`${loggingTag} is user admin?`, check);
		} finally {
			await db.connection.release({client});
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return check;
}

module.exports = {
	isTeam: checkIfUserIsPartOfTeam
}