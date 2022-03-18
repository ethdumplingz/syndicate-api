const db = require("../../db/utils");
const baseAppLoggingTag = `[PROJECTS]`;

const table = `projects`;
const statusesTable = `user_project_statuses`;
const scoreTable = `project_user_scores`;
const fullInfoTable = `project_full_info_view`;

const insertProject = async ({id, title = '', description = '', website_url = '', twitter_url = '', discord_url= '', role_acquisition_url = '', wallet_submission_url = '', is_discord_open= true, presale_price = 0, sale_unit = "ETH", ts_presale_start = 0, ts_presale_end = 0, ts_public_sale= 0, wl_register_url = "", max_supply = 0, max_per_transaction = 0, max_per_wallet = 0} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[insertProject]`;
	let outcome;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const insertQuery = {
			name: `add-project`,
			text: `INSERT INTO ${table}(id, title, description, website_url, twitter_url, discord_url, is_discord_open, presale_price, sale_unit, ts_presale_start, ts_presale_end, ts_public_sale, wl_register_url, max_supply, max_per_transaction, max_per_wallet, role_acquisition_url, wallet_submission_url) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
			values: [id, title, description, website_url, twitter_url, discord_url, is_discord_open, presale_price, sale_unit, ts_presale_start, ts_presale_end, ts_public_sale, wl_register_url, max_supply, max_per_transaction, max_per_wallet, role_acquisition_url, wallet_submission_url]
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

const updateProject = async ({id, title = '', description = '', website_url = '', twitter_url = '', discord_url= '', role_acquisition_url='', wallet_submission_url, is_discord_open= true, presale_price = 0, sale_unit = "ETH", ts_presale_start = 0, ts_presale_end = 0, ts_public_sale = 0, wl_register_url = "", max_supply = 0, max_per_transaction = 0, max_per_wallet = 0} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[updateProject]`;
	let outcome = false;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const updateQuery = {
			text: `UPDATE ${table} SET title = $2, description = $3, website_url = $4, twitter_url = $5, discord_url = $6, is_discord_open = $7, presale_price = $8, sale_unit = $9, ts_presale_start = $10, ts_presale_end = $11, ts_public_sale = $12, wl_register_url = $13, max_supply = $14, max_per_transaction = $15, max_per_wallet = $16, role_acquisition_url = $17, wallet_submission_url = $18 WHERE id = $1`,
			values: [id, title, description, website_url, twitter_url, discord_url, is_discord_open, presale_price, sale_unit, ts_presale_start, ts_presale_end, ts_public_sale, wl_register_url, max_supply, max_per_transaction, max_per_wallet, role_acquisition_url, wallet_submission_url]
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

const hideProject = async ({id} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[hideProject]`;
	let outcome = false;
	try{
		outcome = await updateProjectVisibility({id, is_active: false});
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return outcome;
}
const showProject = async ({id} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[showProject]`;
	let outcome = false;
	try{
		outcome = await updateProjectVisibility({id, is_active: true});
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return outcome;
}

const updateProjectVisibility = async ({id, is_active:isActive = false} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[updateProjectVisibility]`;
	let outcome = false;
	try{
		const client = await db.connection.get();
		// console.info(`${loggingTag} got client`, client);
		const updateQuery = {
			text: `UPDATE ${table} SET is_active = $2 WHERE id = $1`,
			values: [id, isActive]
		};
		console.info(`${loggingTag} updating project is_active to ${isActive}. query`, updateQuery);
		try{
			const result = outcome = await client.query(updateQuery);
			console.info(`${loggingTag} project hidden! result:`, result);
		} finally {
			await db.connection.release({client});
		}
		
	} catch(e){
		// console.error(`${loggingTag} Error:`, e);
		throw e;
	}
	return outcome;
}

const getProjects = async ({user = ''} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getProjects]`;
	let projects = [];
	
	try {
		let client;
		try{
			client = await db.connection.get();
			const getQuery = {
				name: `get-projects-for-user`,
				text: `SELECT p.id, p.title, p.presale_price, p.public_price, p.ts_presale_start, p.max_supply, p.website_url, p.website_url, p.twitter_url, p.discord_url, p.wl_register_url, p.score, p.upvotes, p.downvotes,
							  CASE WHEN ufp.user_address IS NOT NULL THEN true ELSE false END AS is_following,
							  CASE WHEN upv.vote IS NOT NULL THEN upv.vote ELSE 0 END AS vote
					   FROM ${fullInfoTable} p
							LEFT JOIN users_followed_projects ufp ON ufp.project_id = p.id AND ufp.user_address = $1
							LEFT JOIN user_project_votes upv ON upv.project_id = p.id AND upv.user_address = $1
					   WHERE p.ts_presale_start > NOW() OR date_part('epoch', p.ts_presale_start) = 0
					   ORDER BY p.ts_presale_start`,
				values: [user]
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

const getProjectScore = async ({id = ""} = {}) => {
	const loggingTag = `${baseAppLoggingTag}[getProjectScore]`;
	let score = {};
	if (id.length < 1) {
		throw new Error("Missing ID of project to retrieve");
	} else {
		try {
			const client = await db.connection.get();
			const getQuery = {
				name: `get-score-${id}`,
				text: `SELECT *
                       FROM ${scoreTable}
                       WHERE project_id = $1`,
				values: [id]
			};

			console.info(`${loggingTag} getting project score...`);
			try {
				const result = await client.query(getQuery);
				score = result.rows.length > 0 ? result.rows[0] : {
					project_id: id,
					score: 0,
					upvotes: 0,
					downvotes: 0
				};
				console.info(`${loggingTag} got project score:`, score);
			} finally {
				await db.connection.release({client});
			}

		} catch (e) {
			throw e;
		}
	}

	return score;
}

module.exports = {
    insert: insertProject,
    update: updateProject,
    delete: deleteProject,
		hide: hideProject,
		show: showProject,
    get: getProjects,
    getSingle: getSingleProject,
    getScore: getProjectScore,
}