const net = require('net');
const fetch = require('node-fetch');
const schedule = require('node-schedule');
const config = require('dotenv').load();
const electron = require('electron');

const { app, BrowserWindow, dialog } = electron;

if (config.error) {
	throw config.error;
}

// Disable error dialogs by overriding
dialog.showErrorBox = function(title, content) {
	// FLAG_LOGGING
	console.log(`${title}\n${content}`);
};

const {
	OF_ENABLED,
	BACKGROUND,
	MASTER_HTTP_HOST,
	MASTER_HTTP_PORT,
	NODE_ENV,
	FEED,
	API_ENDPOINT,
	SCREEN_NUMBER,
	IN_GROUP_OF
} = process.env;

const isDev = NODE_ENV.indexOf('dev') !== -1;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function getColor(theme) {
	switch(theme) {
		case 'legswalking':
			return 'orange';
		case 'strengthendurance':
			return 'blue';
		case 'armshands':
			return 'cyan';
		case 'thinkspeak':
			return 'purple';
		case 'pediatrics':
			return 'green';
		case 'global':
		default:
			return 'red';
	}
}

function createWindow() {
	const displays = electron.screen.getAllDisplays();
	const selectedDisplay = displays[displays.length - 1];

	mainWindow = new BrowserWindow({
		x: selectedDisplay.bounds.x,
		y: selectedDisplay.bounds.y,
		resizeable: false,
		moveable: false,
		alwaysOnTop: !isDev, // true for all env's except dev
		frame: false,
		hasShadow: false,
		show: false,
		transparent: true,
		width: 1080,
		height: 1920
	});

	// Build URL string
	let mainUrl = `http://${MASTER_HTTP_HOST}:${MASTER_HTTP_PORT}`;

	// Load dev index and unlock dev tools if in dev mode
	if (!OF_ENABLED) {
		mainUrl += '/index-dev.html';
		mainWindow.webContents.openDevTools({ mode: 'undocked' });
	}

	// Defaults for API URL and screen position
	const apiUrl = API_ENDPOINT || 'qa.sralab.codeandtheory.net/api/v1/signage-feed/ground_floor';
	const screenIndex = SCREEN_NUMBER || 1;
	const groupNumber = IN_GROUP_OF || 1;
	const color = getColor(BACKGROUND);

	// Append parameters
	if (isDev) {
		mainUrl += `?api=http://${apiUrl}/${FEED}&screen=${screenIndex}&group=${groupNumber}&color=${color}`;
	} else {
		mainUrl += `?api=http://${apiUrl}/${FEED}/data.json&screen=${screenIndex}&group=${groupNumber}&color=${color}`;
	}

	// Load concatinated URL
	mainWindow.loadURL(mainUrl);

	mainWindow.on('closed', function () {
		mainWindow = null;
	});

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});
}

let timer = null;
let job = null;
function connect() {
	const socket = net.createConnection(MASTER_HTTP_PORT, `${MASTER_HTTP_HOST}`, function(err) {
		// FLAG_LOGGING
		console.log('connecting');
		clearTimeout(timer);
		createWindow();
		job = schedule.scheduleJob('*/5 * * * * *', pollForUpdates);
	});

	socket.on('error', function(err) {
		// FLAG_LOGGING
		console.log('retry connection');
		clearTimeout(timer);
		timer = setTimeout(connect, 500);
	});
}

let fetching = false;
let bundled_at = 0;
function pollForUpdates() {
	if (fetching) {
		return;
	}
	fetching = true;

	let url = '';
	if (isDev) {
		url = `http://${API_ENDPOINT}/${FEED}/`;
	} else {
		url = `http://${API_ENDPOINT}/${FEED}/data.json`;
	}

	fetch(url)
		.then(res => {
			if (!res.ok) {
				// FLAG LOGGING
				console.log('poll error response', res);
			}
			fetching = false;
			return res;
		})
		.then(res => res.json())
		.then((json) => {
			fetching = false;
			if (!bundled_at) {
				bundled_at = json.bundled_at;
			} else if (json.bundled_at != bundled_at) {
				bundled_at = json.bundled_at;
				mainWindow.webContents.send('update', 'update');
				setTimeout(() => {
					// hide, reload, then wait to show
					// to prevent flash of white
					mainWindow.hide();
					mainWindow.reload();
					setTimeout(() => {
						mainWindow.show();
					}, 200);
				}, 1000);
			}
		})
		.catch((err) => {
			// FLAG LOGGING
			console.log('poll error', err);
			bundled_at = 1;
			fetching = false;
		});

}

app.on('ready', connect);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});
