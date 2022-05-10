const express = require('express'),
	router = express.Router();

const commentsUtil = require("../../common/comments/utils"),
	usersUtil = require("../../common/users/utils");
const projectsUtil = require("../../common/projects/utils");

router.get(`/get/:projectID/:userID`, async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			project: '',
			user: '',
			comments: [],
			errors: []
		},
		statusCode = 400;
	
	try{
		const {userID, projectID} = req.params;
		rj.project = projectID;
		rj.user = userID;
		rj.comments = await commentsUtil.getByUserID({project: projectID, user: userID});
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
			outcome: [],
			errors: []
		},
		statusCode = 400;
	try{
		// rj.project = await projectsUtil.update(req.body);
		rj.ok = true;
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.status(statusCode).json(rj).end();
});

router.post("/add/", async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			outcome: false,
			errors: []
		},
		statusCode = 400;
	try{
		const {project, user, comment} = req.body;
		
		rj.outcome = await commentsUtil.add({project, user, comment});
		rj.ok = true;
		statusCode = 200;
		
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.status(statusCode).json(rj).end();
});

module.exports = router;