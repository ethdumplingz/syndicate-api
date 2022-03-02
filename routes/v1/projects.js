const express = require('express'),
	router = express.Router();

const contractUtil = require("../../common/projects/utils");

router.get("/get/:projectID", async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			project: []
		},
		statusCode = 400;
	try{
		const id = req.params.projectID;
		rj.project = await contractUtil.getSingle({id});
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.get("/get", async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			projects: []
		},
		statusCode = 400;
	try{
		rj.projects = await contractUtil.get();
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
			contracts:[]
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
		await contractUtil.insert(req.body);
		statusCode = 200;
		rj.ok = true;
		
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

module.exports = router;
