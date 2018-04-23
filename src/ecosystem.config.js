const config = require('dotenv').load();
const os = require('os');

if (config.error) {
	throw config.error;
}

const {
	APP_ID,
	NODE_ENV,
	OF_ENABLED,
	SCREEN_NUMBER,
	BACKGROUND
} = process.env;

const isDev = NODE_ENV.indexOf('dev') !== -1;

const apps = [];

if (APP_ID === 'display' || APP_ID === 'dual') {
	apps.push({
		name: 'displayApp',
		script: 'npm',
		watch: false,
		interpreter: 'none',
		args: 'run process:electron',
		autorestart: !isDev // true for all env's except dev
	});
}

if (isDev && APP_ID === 'display') {
	apps.push({
		name: 'webpackDevServer',
		script: 'npm',
		watch: false,
		interpreter: 'none',
		args: 'run process:display:dev',
		autorestart: !isDev
	});
}

if (!isDev) {
	apps.push({
		name: 'newRelicPlugin',
		script: 'npm',
		watch: false,
		interpreter: 'none',
		args: 'run process:newrelic',
		autorestart: !isDev
	});
}

if ((OF_ENABLED === 'true' && APP_ID === 'display') || (OF_ENABLED === 'true' && APP_ID === 'dual')) {
	switch(BACKGROUND) {
		case 'strengthendurance':
			apps.push({
				name: 'displayBackground',
				script: 'npm',
				watch: false,
				interpreter: 'none',
				args: `run process:background:strengthendurance:${os.platform()}`,
				autorestart: !isDev
			});
			break;
		case 'armshands':
			apps.push({
				name: 'displayBackground',
				script: 'npm',
				watch: false,
				interpreter: 'none',
				args: `run process:background:armshands:${os.platform()}`,
				autorestart: !isDev
			});
			break;
		case 'legswalking':
			apps.push({
				name: 'displayBackground',
				script: 'npm',
				watch: false,
				interpreter: 'none',
				args: `run process:background:legswalking:${os.platform()}`,
				autorestart: !isDev
			});
			break;
		case 'thinkspeak':
			apps.push({
				name: 'displayBackground',
				script: 'npm',
				watch: false,
				interpreter: 'none',
				args: `run process:background:thinkspeak:${os.platform()}`,
				autorestart: !isDev
			});
			break;
		case 'pediatrics':
			apps.push({
				name: 'displayBackground',
				script: 'npm',
				watch: false,
				interpreter: 'none',
				args: `run process:background:pediatrics${SCREEN_NUMBER}:${os.platform()}`,
				autorestart: !isDev
			});
			break;
		case 'global':
		default:
			apps.push({
				name: 'displayBackground',
				script: 'npm',
				watch: false,
				interpreter: 'none',
				args: `run process:background:global${SCREEN_NUMBER}:${os.platform()}`,
				autorestart: !isDev
			});
			break;
	}
}

if (APP_ID === 'master' || APP_ID === 'dual') {
	apps.push({
		name: 'masterController',
		script: 'npm',
		watch: false,
		interpreter: 'none',
		args: 'run process:master',
		autorestart: true
	}, {
		name: 'masterHttpServer',
		script: 'npm',
		watch: false,
		interpreter: 'none',
		args: 'run process:master:httpserver',
		autorestart: true
	}, {
		name: 'masterApiEndPoint',
		script: 'npm',
		watch: false,
		interpreter: 'none',
		args: 'run process:master:apiendpoint',
		autorestart: true
	});
}


module.exports = {
	apps
};
