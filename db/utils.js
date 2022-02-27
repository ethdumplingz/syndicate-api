const { Pool } = require("pg");
require("dotenv").config();

const dbLoggingTag = `[db]`;

// console.info(process.env);

const tables = [
	'alpha'
]

const poolOptions = {
	connectionString: process.env.NODE_ENV === "development" ? process.env.EXTERNALPGCONNECTIONSTR : process.env.INTERNALPGCONNECTIONSTR,
	ssl:{
		rejectUnauthorized: false
	}
};

const pool = new Pool(poolOptions);

pool.on("error", (err, client) => {
	const loggingTag = `${dbLoggingTag}[pool error]`;
	try{
		console.error(`${loggingTag} Unexpected/Unhandled error on db client:`, err);
		process.exit(-1);
	} catch(e){
		console.error(`${loggingTag} Unable to log error on pool connection because:`, e);
	}
});

const connectToDB = async ({table = "alpha"} = {}) => {
	const loggingTag = `${dbLoggingTag}[connectToDB]`;
	
	try{
		
		const client = await pool.connect();
		
		try{
			const res = await client.query('SELECT $1::text as message', ['Hello world!'])
			console.info(`query results: `, res.rows[0].message) // Hello world!
		} catch(e){
			console.error(`${loggingTag} Error occurred querying db:`, e);
		} finally {
			console.info(`${loggingTag} Releasing connection back into the pool...`);
			await client.release();
		}
	} catch(e){
		console.error(`${loggingTag} Error connecting to the database:`, e);
	}
}

const getConnection = async ({} = {}) => {
	const loggingTag = `${dbLoggingTag}[getConnection]`;
	let connection;
	try{
		console.info(`${loggingTag} Getting connection from pool...`);
		connection = await pool.connect();
		console.info(`${loggingTag} Got connection from pool`);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return connection;
}

const releaseConnection = async ({client} = {}) => {
	const loggingTag = `${dbLoggingTag}[releaseConnection]`;
	
	try{
		if(typeof client  === "object"){
			console.info(`${loggingTag} releasing connection...`);
			await client.release();
			console.info(`${loggingTag} connection released!`);
		} else {
			console.error(`${loggingTag} Missing a connection to release`);
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
}

module.exports = {
	connect: connectToDB,
	connection:{
		get: getConnection,
		release: releaseConnection
	}
}