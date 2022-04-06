const express = require('express'),
	router = express.Router();

const usersUtil = require("../../common/users/utils");
const projectsUtil = require("../../common/projects/utils");

router.get(`/:user/team/check`, async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,

		},
		statusCode = 400;
	try{
		const {user} = req.params;
		rj.ok = await usersUtil.isTeam({user:user.toLowerCase()});
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.get(`/:user/projects/:projectID/following`, async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			is_following: false
		},
		statusCode = 400;
	try{
		const user = req.params.user,
			projectID = req.params.projectID;

		rj.ok = true;
		rj.is_following = await usersUtil.projects.isFollowing({user,project_id:projectID});
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.get(`/:user/projects/:projectID/vote`, async (req, res, next) => {
    const loggingTag = `[path:${req.path}]`;
    let rj = {
            ok: false,
            vote: 0,
            errors: []
        },
        statusCode = 400;
    try {
        const user = req.params.user,
			project_id = req.params.projectID;
        rj.ok = true;
        rj.vote = await usersUtil.projects.actions.latestVote({user, project_id});
        statusCode = 200;
    } catch (e) {
        console.error(`${loggingTag} Error:`, e);
        rj.errors.push(e);
    }
    res.json(rj).status(statusCode).end();
});

router.get(`/:user/projects/:projectID/actions/latest`, async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			stage: false,
			errors: []
		},
		statusCode = 400;
	try{
		const user = req.params.user,
			projectID = req.params.projectID;
		rj.ok = true;
		rj.stage = await usersUtil.projects.actions.latest({user,project_id:projectID});
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.get(`/:user/projects/active`, async (req, res) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			projects: [],
			errors: []
		},
		statusCode = 400;
	try{
		const user = req.params.user.toLowerCase();
		rj.ok = true;
		rj.projects = await usersUtil.projects.get({id: user});
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.post(`/projects/follow`, async (req, res, next) => {
	let rj = {
			ok: false,
			errors: []
		},
		statusCode = 400;
	try{
		const user = req.body.user,
			projectID = req.body.project_id;

		rj.ok = await usersUtil.projects.follow({user, project_id:projectID});
		statusCode = 200;

	} catch(e){
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.post(`/projects/unfollow`, async (req, res, next) => {
	let rj = {
			ok: false,
			errors: []
		},
		statusCode = 400;
	try{
		const user = req.body.user,
			projectID = req.body.project_id;

		rj.ok = await usersUtil.projects.unfollow({user, project_id:projectID});
		statusCode = 200;

	} catch(e){
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});


router.post(`/projects/actions/update`, async (req, res, next) => {
	let rj = {
			ok: false,
			errors: []
		},
		statusCode = 400;
	try{
		const {user, project_id, action, value} = req.body;

		rj.ok = await usersUtil.projects.actions.update({user, project_id, action, value});
		statusCode = 200;

	} catch(e){
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.post(`/projects/stages/add`, async (req, res, next) => {
	let rj = {
			ok: false,
			errors: []
		},
		statusCode = 400;
	try{
		const user = req.body.user,
			projectID = req.body.project_id,
			stage = req.body.stage;
		const result = await usersUtil.projects.stages.add({user, project_id:projectID, stage});

		rj.ok = result.rowCount === 1;

		statusCode = 200;

	} catch(e){
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

router.post(`/projects/vote`, async (req, res, next) => {
	let rj = {
			ok: false,
			score: {},
			errors: []
		},
		statusCode = 400;
	try {
		const {user, project_id, vote} = req.body;

		rj.ok = await usersUtil.projects.actions.vote({user, project_id, vote});
		rj.score = await projectsUtil.getScore({id: project_id});
		statusCode = 200;

	} catch (e) {
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
});

module.exports = router;
