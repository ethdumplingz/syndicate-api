const log = require('loglevel');
const prefix = require('loglevel-plugin-prefix');

//setting up logger
prefix.reg(log);
log.enableAll();

prefix.apply(log, {
	template: '[%t] %l (%n) static text:',
	levelFormatter(level) {
		return level.toUpperCase();
	},
	nameFormatter(name) {
		return name || 'global';
	},
	timestampFormatter(date) {
		return date.toISOString();
	},
});
//end logger setup

module.exports = {
	logger: log
}