const express = require('express'),
	router = express.Router();

const usersUtil = require("../../common/users/utils");

router.get(`/:user/team/check`, async (req, res, next) => {
	const loggingTag = `[path:${req.path}]`;
	let rj = {
			ok: false,
			
		},
		statusCode = 400;
	try{
		const user = req.params.user;
		rj.ok = await usersUtil.isTeam({user});
		statusCode = 200;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		rj.errors.push(e);
	}
	res.json(rj).status(statusCode).end();
})
module.exports = router;
