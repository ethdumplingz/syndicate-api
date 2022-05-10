const db = require("../../db/utils");
const baseAppLoggingTag = `[PROJECTS]`;

const table = `user_project_comments`;

const getByUserID = async ({project = '', user = ''} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getByUserID]`;
	let comments = false;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		try{
			const query = {
				name: `comments-${project}-${user}`,
				text: `SELECT * FROM ${table} WHERE project_id = $1 AND user_id = $2 ORDER BY ts_created_at`,
				values: [project, user]
			};
			console.info(`${loggingTag} getting project comments.`, query);
			const result = await client.query(query);
			console.info(`${loggingTag} comments retrieved. result:`, result);
			comments = result.rows;
		} catch (e){
			console.error(`${loggingTag} error:`, e);
		} finally {
			await db.connection.release({client});
		}
	} catch (e){
		console.error(`${loggingTag} Error:`, e);
	}
	return comments;
}

const addComment = async ({project = '', user = '', comment = ''} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[addComment]`;
	let outcome = false;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		try{
			const query = {
				text: `INSERT INTO ${table} (project_id, user_id, comment) VALUES($1, $2, $3)`,
				values: [project, user, comment]
			};
			console.info(`${loggingTag} adding comments for user: ${user} for project: ${project}.  query:`, query);
			const result = await client.query(query);
			console.info(`${loggingTag} comment added. result:`, result);
		} catch (e){
			console.error(`${loggingTag} error:`, e);
		} finally {
			await db.connection.release({client});
		}
	} catch (e){
		console.error(`${loggingTag} Error:`, e);
	}
	return outcome;
}

module.exports = {
	getByUserID,
	add: addComment
}
