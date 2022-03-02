const express = require('express');
const router = express.Router();


const projectsRouter = require('./projects');
router.use('/projects', projectsRouter);

const usersRouter = require('./users');
router.use('/users', usersRouter);

module.exports = router;