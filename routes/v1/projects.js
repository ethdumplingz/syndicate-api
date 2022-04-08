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
	res.status(statusCode).json(rj).end();
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
    res.status(statusCode).json(rj).end();
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
		const {user, admin = false} = req.query;
		rj.projects = await projectsUtil.get({user, admin});
		rj.ok = true;
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.status(statusCode).json(rj).end();
});

router.get("/exists", async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			exists: false,
			errors: []
		},
		statusCode = 400;
	try{
		const {twitter} = req.query;
		rj.exists = await projectsUtil.exists({twitter});
		rj.ok = true;
		
		statusCode = 200;
	} catch(e){
		rj.errors.push(e);
		console.error(`${loggingTag} Error:`, e);
	}
	res.status(statusCode).json(rj).end();
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
	res.status(statusCode).json(rj).end();
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
	res.status(statusCode).json(rj).end();
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
	res.status(statusCode).json(rj).end();
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
	res.status(statusCode).json(rj).end();
});

//modules added for csv upload
const multer = require("multer"),
	csv = require("fast-csv"),
	fs = require("fs"),
	upload = multer({dest:"tmp/csv/"});

router.post("/bulk/add/", upload.single("file"), (req, res) => {
	let rj = {
		ok: false,
		rows_added: 0,
		errors:[]
	},
		statusCode = 400;
	const loggingTag = `[path:${req.path}]`;
	console.info(`${loggingTag} here!!!`);
	const fileRows = [];
	try{
		console.info(`${loggingTag} file path:`);
		fs.createReadStream(req.file.path)
			.pipe(csv.parse({headers:true}))
			.on("data", (row) => {
				fileRows.push(row);
			})
			.on("error", (e) => {
				rj.errors.push(e);
				console.error(`${loggingTag} error occurred`, e);
			})
			.on("end", (rowCount) => {
				console.info(`${loggingTag} num rows processed: ${rowCount}`);
				console.info(`${loggingTag} File rows:`, fileRows);
				if(rj.errors.length < 1){
					rj.ok = true;
					statusCode = 200;
				}
				
				try{
					fs.unlinkSync(req.file.path);
					console.info(`${loggingTag} temp file deleted!`);
				} catch(e){
					rj.errors.push(e);
					console.error(`${loggingTag} Error:`, e);
				}
				res.status(statusCode).json(rj).end();
			});
	} catch(e){
		rj.errors.push(e);
		console.error(`${loggingTag} Error:`, e);
		res.status(statusCode).json(rj).end();
	}
	
});

module.exports = router;
