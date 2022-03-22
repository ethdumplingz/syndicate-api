const express = require('express'),
	router = express.Router();

const projectsUtil = require("../../common/projects/utils"),
	usersUtil = require("../../common/users/utils");

router.get("/get/:projectID", async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			project: [],
			errors: []
		},
		statusCode = 400;
	try{
		const id = req.params.projectID;
		rj.project = await projectsUtil.getSingle({id});
		rj.ok = true;
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.get("/get/:projectID/score", async (req, res, next) => {
    const loggingTag = `[path:${req.path}]`;
    let rj = {
            ok: false,
            score: {},
            errors: []
        },
        statusCode = 400;
    try {
        const id = req.params.projectID;
        rj.score = await projectsUtil.getScore({id});
        rj.ok = true;
        statusCode = 200;
    } catch (e) {
        console.error(`${loggingTag} Error:`, e);
        rj.errors.push(e);
    }
    res.json(rj).status(statusCode).end();
});

router.get("/get", async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			projects: [],
			errors: []
		},
		statusCode = 400;
	// console.info(`${loggingTag} req.query`);
	try{
		const user = req.query.user;
		rj.projects = await projectsUtil.get({user});
		rj.ok = true;
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.get("/:address", (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			address: '',
			contracts:[],
			errors: []
		},
		statusCode = 400;
	try{
		rj.address = req.params.address;
		res.json(rj).status(statusCode).end();
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
});

router.post("/add", async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			errors: []
		},
		statusCode = 400;
	try{
		console.info(`${loggingTag} body`, req.body);
		await projectsUtil.insert(req.body);
		statusCode = 200;
		rj.ok = true;
		
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.post("/edit/", async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			project: [],
			errors: []
		},
		statusCode = 400;
	try{
		rj.project = await projectsUtil.update(req.body);
		rj.ok = true;
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.post("/delete/", async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			errors: []
		},
		statusCode = 400;
	try{
		const {id, user} = req.body;
		if(await usersUtil.isTeam({user})){
			await projectsUtil.delete({id});
			rj.ok = true;
			statusCode = 200;
		} else {
			rj.errors.push("Error: user is not an admin.");
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.post(["/hide/", "/show/"], async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			errors: []
		},
		statusCode = 400;
	try{
		console.info(`${loggingTag} path?`);
		const {id, user} = req.body;
		if(await usersUtil.isTeam({user:user.toLowerCase()})){
			if(req.path.startsWith("/hide")){
				await projectsUtil.hide({id});
			} else {
				await projectsUtil.show({id});
			}
			
			rj.ok = true;
			statusCode = 200;
		} else {
			rj.errors.push("Error: user is not an admin.");
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

//modules added for csv upload
const multer = require("multer"),
	fs = require("fs"),
	readline = require('readline'),
	upload = multer({dest:"tmp/csv/"}),
	db = require("../../db/utils"),
	copyFrom = require('pg-copy-streams').from;

router.post("/bulk/add/", upload.single("file"), async (req, res) => {
	let rj = {
			ok: false,
			rowsAdded: 0,
			errors: []
		},
		statusCode = 400;

	const loggingTag = `[path:${req.path}]`;
	console.info(`${loggingTag} Upload projects from csv!`);
	try {
		console.info(`${loggingTag} file path:`);

		const client = await db.connection.get();

		let inputStream = fs.createReadStream(req.file.path);
		const reader = readline.createInterface({ input: inputStream });
		const header = await new Promise((resolve) => {
			reader.on('line', (line) => {
				reader.close();
				resolve(line);
			});
		});
		console.info(`Importing csv with header: ${header}`);

		const dbStream = client.query(copyFrom(`COPY projects (${header}) FROM STDIN CSV HEADER`))
			.on('error', (e) => {
				rj.errors.push(e);
				console.error(`${loggingTag} error occurred`, e);
			})
			.on('end', () => {
				console.info(`Completed loading data into projects table`);
				client.release();
			});

		fs.createReadStream(req.file.path)
			.on("data", () => {
				rj.rowsAdded++;
			})
			.on("error", (e) => {
				rj.errors.push(e);
				console.error(`${loggingTag} error occurred`, e);
			})
			.on("end", (rowCount) => {
				console.info(`${loggingTag} num rows added: ${rj.rowsAdded}`);
				if (rj.errors.length < 1) {
					rj.ok = true;
					statusCode = 200;
				}

				try {
					fs.unlinkSync(req.file.path);
					console.info(`${loggingTag} temp file deleted!`);
				} catch (e) {
					rj.errors.push(e);
					console.error(`${loggingTag} Error:`, e);
				}
				res.status(statusCode).json(rj).end();
			})
			.pipe(dbStream);
	} catch (e) {
		rj.errors.push(e);
		console.error(`${loggingTag} Error:`, e);
		res.status(statusCode).json(rj).end();
	}
});

module.exports = router;
