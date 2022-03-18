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

module.exports = router;
