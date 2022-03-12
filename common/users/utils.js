const db = require("../../db/utils");
const baseAppLoggingTag = `[PROJECTS]`;

const table = `team`;
const actionsTable = `user_project_actions`;
const userActiveProjectsTable = `user_active_projects`;
const usersFollowedProjectsTable = `users_followed_projects`;
const voteTable = `user_project_latest_vote`;

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
			// console.info(`${loggingTag} result:`, result);
			if(result.rows.length > 0){
				console.info(`${loggingTag} action: ${result.rows[0].action} row:`, result.rows[0]);
			}
			check = result.rows.length > 0 && result.rows[0].action  === "follow";//if out of the last 2 actions above, "follow" is the latest, then they are following
			console.info(`${loggingTag} is user following?`, check);
		} finally {
			await db.connection.release({client});
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return check;
}

const getLatestProjectAction = async ({user: address, project_id:projectID} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getLatestProjectAction]`;
	let action = "unknown";
	try{
		const client = await db.connection.get();
		const getQuery = {
			text: `SELECT * FROM ${actionsTable} WHERE user_address = $1 AND project_id = $2 ORDER BY occurred_at DESC LIMIT 1`,
			values: [address, projectID]
		};
		console.info(`${loggingTag} get latest stage of user ${address} for project: ${projectID}`);
		try{
			const result = await client.query(getQuery);
			console.info(`${loggingTag} result:`, result);
			action = result.rows.length > 0 ? result.rows[0].action : action;
			console.info(`${loggingTag} latest action`, action);
		} finally {
			await db.connection.release({client});
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return action;
}

const getLatestProjectVote = async ({user: address, project_id:projectID} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getLatestProjectVote]`;
	let vote = "N/A";
	try{
		const client = await db.connection.get();
		const getQuery = {
			text: `SELECT * FROM ${voteTable} WHERE user_address = $1 AND project_id = $2`,
			values: [address, projectID]
		};
		console.info(`${loggingTag} get latest vote of user ${address} for project: ${projectID}`);
		try{
			const result = await client.query(getQuery);
			console.info(`${loggingTag} result:`, result);
			vote = result.rows.length > 0 ? result.rows[0].vote : "N/A";
			console.info(`${loggingTag} latest vote`, vote);
		} finally {
			await db.connection.release({client});
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return vote;
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

const removeProjectAction = async ({user, project_id: projectID, action = ""} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[removeProjectAction]`;
	let outcome;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const insertQuery = {
			text: `DELETE FROM ${actionsTable} WHERE user_address = $1 AND project_id = $2 AND action = $3`,
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

const getUsersActiveProjects = async ({id:userID=""} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getUsersActiveProjects]`;
	let projects = [];
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const query = {
			text: `SELECT * FROM ${userActiveProjectsTable} WHERE user_address = $1 AND (ts_presale_end >= current_date - interval '7 day' OR date_part('epoch', ts_presale_start) = 0) ORDER BY ts_presale_start`,
			values: [userID]
		};
		console.info(`${loggingTag} Getting user's active projects. query`, query);
		const result = await client.query(query);
		projects = result.rows;
		console.info(`${loggingTag} Retrieved user's active projects!`);
		// console.info(`${loggingTag} Retrieved user's active projects! result:`, result);
		await db.connection.release({client});
	} catch(e){
		throw e;
	}
	return projects;
}

const followProject = async ({user = '', project_id = ''} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[followProject]`;
	let result = false;
	try{
		if(user.length < 1){
			throw new Error('Missing user!');
		} else if (project_id.length < 1){
			throw new Error('Missing project!');
		} else {
			const client = await db.connection.get();
			// console.info(`${loggingTag} got client`, client);
			try{
				const query = {
					text: `INSERT INTO ${usersFollowedProjectsTable}(user_address, project_id) values($1, $2)`,
					values: [user, project_id]
				};
				console.info(`${loggingTag} Getting user's active projects. query`, query);
				const queryResult = await client.query(query);
				result = queryResult;
				console.info(`${loggingTag} Retrieved user's active projects!`);
				// console.info(`${loggingTag} Retrieved user's active projects! result:`, result);
			} finally {
				await db.connection.release({client});
			}
		}
	} catch(e){
		throw e;
	}
	return result;
}

const unfollowProject = async ({user = '', project_id = ''} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[unfollowProject]`;
	let result = false;
	try{
		if(user.length < 1){
			throw new Error('Missing user!');
		} else if (project_id.length < 1){
			throw new Error('Missing project!');
		} else {
			const client = await db.connection.get();
			// console.info(`${loggingTag} got client`, client);
			try{
				const query = {
					text: `DELETE FROM ${usersFollowedProjectsTable} WHERE user_address = $1 AND project_id = $2`,
					values: [user, project_id]
				};
				console.info(`${loggingTag} deleting record in ${usersFollowedProjectsTable} for user: ${user} and project_id: ${project_id}`, query);
				const queryResult = await client.query(query);
				result = queryResult;
				console.info(`${loggingTag} Retrieved user's active projects!`);
				// console.info(`${loggingTag} Retrieved user's active projects! result:`, result);
			} finally {
				await db.connection.release({client});
			}
		}
	} catch(e){
		throw e;
	}
	return result;
}

const updateUserProject = async ({user = '', project_id = '', action = '', value} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[updateUserProject]`;
	let result = false;
	try{
		if(user.length < 1){
			throw new Error('Missing user!');
		} else if (project_id.length < 1){
			throw new Error('Missing project!');
		} else {
			const client = await db.connection.get();
			// console.info(`${loggingTag} got client`, client);
			try{
				const query = {
					text: `UPDATE ${usersFollowedProjectsTable} SET ${action} = $1 WHERE user_address = $2 AND project_id = $3`,
					values: [value, user, project_id]
				};
				console.info(`${loggingTag} updating record in ${usersFollowedProjectsTable} for user: ${user} and project_id: ${project_id}`, query);
				const queryResult = await client.query(query);
				console.info(`${loggingTag} query result`, queryResult);
				result = queryResult;
				console.info(`${loggingTag} Retrieved user's active projects!`);
				// console.info(`${loggingTag} Retrieved user's active projects! result:`, result);
			} catch(e){
				throw e;
			} finally {
				await db.connection.release({client});
			}
		}
	} catch(e){
		throw e;
	}
	return result;
}

module.exports = {
	isTeam: checkIfUserIsPartOfTeam,
	projects : {
		get: getUsersActiveProjects,
		follow: followProject,
		unfollow: unfollowProject,
		isFollowing: isFollowingProject,
		actions : {
			update: updateUserProject,
			add: addProjectAction,
			remove: removeProjectAction,
			latest: getLatestProjectAction,
			latestVote: getLatestProjectVote
		},
	}
	
}