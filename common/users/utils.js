const db = require("../../db/utils");
const baseAppLoggingTag = `[PROJECTS]`;

const table = `team`;
const actionsTable = `user_project_actions`;
const stagesTable = `user_project_stage`;

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

const isFollowingProject = async ({user: address, project_id:projectID} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[isFollowingProject]`;
	let check = false;
	try{
		const client = await db.connection.get();
		const getQuery = {
			text: `SELECT * FROM ${actionsTable} WHERE user_address = $1 AND project_id = $2 AND action IN ('follow', 'unfollow') ORDER BY occurred_at DESC LIMIT 1`,
			values: [address, projectID]
		};
		console.info(`${loggingTag} check if user ${address} is an admin...`);
		try{
			const result = await client.query(getQuery);
			console.info(`${loggingTag} result:`, result);
			console.info(`${loggingTag} action: ${result.rows[0].action} row:`, result.rows[0]);
			check = result.rows.length > 0 && result.rows[0].action  === "follow";
			console.info(`${loggingTag} is user following?`, check);
		} finally {
			await db.connection.release({client});
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return check;
}

const getLatestProjectStage = async ({user: address, project_id:projectID} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getLatestProjectStage]`;
	let stage = "unknown";
	try{
		const client = await db.connection.get();
		const getQuery = {
			text: `SELECT * FROM ${stagesTable} WHERE user_address = $1 AND project_id = $2 ORDER BY occurred_at DESC LIMIT 1`,
			values: [address, projectID]
		};
		console.info(`${loggingTag} get latest stage of user ${address} for project: ${projectID}`);
		try{
			const result = await client.query(getQuery);
			console.info(`${loggingTag} result:`, result);
			stage = result.rows.length > 0 ? result.rows[0].stage : stage;
			console.info(`${loggingTag} latest stage`, stage);
		} finally {
			await db.connection.release({client});
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return stage;
}

const addProjectAction = async ({user, project_id: projectID, action = ""} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[addProjectAction]`;
	let outcome;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const insertQuery = {
			text: `INSERT INTO ${actionsTable}(user_address, project_id, action) values($1, $2, $3)`,
			values: [user, projectID, action]
		};
		console.info(`${loggingTag} adding project action. query`, insertQuery);
		const result = outcome = await client.query(insertQuery);
		console.info(`${loggingTag} project action added! result:`, result);
		await db.connection.release({client});
	} catch(e){
		// console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return outcome;
}

const addProjectStage = async ({user, project_id: projectID, stage = ""} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[addProjectStage]`;
	let outcome;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const insertQuery = {
			text: `INSERT INTO ${stagesTable} (user_address, project_id, stage) values($1, $2, $3)`,
			values: [user, projectID, stage]
		};
		console.info(`${loggingTag} adding project stage. query`, insertQuery);
		const result = outcome = await client.query(insertQuery);
		console.info(`${loggingTag} project stage added! result:`, result);
		await db.connection.release({client});
	} catch(e){
		// console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return outcome;
}

module.exports = {
	isTeam: checkIfUserIsPartOfTeam,
	projects : {
		isFollowing: isFollowingProject,
		actions : {
			add: addProjectAction
		},
		stages : {
			add: addProjectStage,
			latest: getLatestProjectStage
		}
	}
	
}