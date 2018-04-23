const config = require('dotenv').load();
const amqp = require('amqplib/callback_api');
const fetch = require('node-fetch');
const download = require('download');
const schedule = require('node-schedule');
const url = require('url');
const fs = require('fs');
const path = require('path');

if (config.error) {
	throw config.error;
}

const {
	AMQP_HOST,
	AMQP_PORT,
	AMQP_USER,
	AMQP_PASS,
	API_BASE_PATH,
	ACTIVE_FEEDS,
	MASTER_BASE_ASSETS_PATH,
	MASTER_HTTP_HOST,
	MASTER_API_PORT,
	NODE_ENV
} = process.env;

// const isDev = NODE_ENV.indexOf('dev') !== -1;
const LOCAL_ASSETS_PATH = `${__dirname}/${MASTER_BASE_ASSETS_PATH}`;

const feeds = [
];

function reconnect() {
	return setTimeout(connect, 1000); // eslint-disable-line no-use-before-define
}

function connect() {
	amqp.connect(`amqp://${AMQP_USER}:${AMQP_PASS}@${AMQP_HOST}:${AMQP_PORT}/`, (err, conn) => {
		if (err) {
			// FLAG_LOGGING
			console.log('error connection to message queue', err);
			return reconnect();
		}

		conn.on('error', (conErr) => {
			
			if(conErr.code === 404) {
				// FLAG_LOGGING
				console.log('channel not found');
			}
			
			if (conErr.message !== 'Connection closing' && conErr.code !== 404) {
				// FLAG_LOGGING
				console.log('amqp connection error', conErr);
			}
			return 'error';
		});

		conn.on('close', () => {
			console.error('[AMQP] reconnecting');
			return reconnect();
		});

		conn.createChannel((createErr, ch) => {
			const q = 'master_controller';
			// ch.deleteQueue(q);
			ch.assertQueue(q, { autoDelete: true });

			if(createErr) {
				// FLAG_LOGGING
				console.log(createErr);
			}

			// FLAG_LOGGING
			console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q);

			ch.consume(q, (msg) => {
				// FLAG_LOGGING
				console.log(' [x] Received %s', msg.content.toString());
				handleMessage(JSON.parse(msg.content.toString())); // eslint-disable-line no-use-before-define
			}, { noAck: true });
		});

		return 'connect';
	});
}

function handleMessage(message) {
	const feed = feeds.find((item) => {
		return item.slug === message.slug;
	});
	if (!feed) {
		// FLAG_LOGGING
		console.log('unhandled message', message);
	} else if (message.bundled_at > feed.remote_bundled_at) {
		grabFeed(feed.slug); // eslint-disable-line no-use-before-define
	}
}

function grabFeed(slug) {
	fetch(`http://${API_BASE_PATH}/${slug}`)
		.then(res => {
			if (!res.ok) {
				// FLAG_LOGGING
				console.log('fetch error res', res);
			}
			return res;
		})
		.then(res => res.json())
		.then(json => handleJSON(json, slug))
		.catch((err) => {
			// FLAG_LOGGING
			console.log('fetch error err', err);
		});
}

function appendAsset(assetUrl, slug, type) {
	console.log('append', assetUrl);
	console.log('append', slug);
	console.log('append', type);
	const filename = path.basename(assetUrl);
	const filepath = `${LOCAL_ASSETS_PATH}/${slug}/${filename}`;
	if (fs.existsSync(filepath)) {
		// file exists, updating metadata so master controller does not purge once 6 months old
		fs.open(filepath, 'r', (err, fd) => {
			fs.futimes(fd, new Date(), new Date(), (err) => {
				// FLAG_LOGGING
				if ( err ) console.log('utimes update ERROR: ' + err);
			});
			fs.close(fd,(err) => {
				// FLAG_LOGGING
				if ( err ) console.log('file close ERROR: ' + err);
			});
		});
	} else {
		// files does not exist, let's add it to the ledger and go get it
		const feed = feeds.find((item) => {
			return item.slug === slug;
		});
		if (feed && !feed.assetLedger.includes(assetUrl)) {
			feed.assetLedger.push(assetUrl);
		}
	}
}

function handleAssets(slug) {
	const feed = feeds.find((item) => {
		return item.slug === slug;
	});
	if (feed.assetLedger.length) {
		feed.assetLedger.map((assetURL) => {
			const asset = url.parse(assetURL);
			// download(asset.href, `${LOCAL_ASSETS_PATH}/${slug}`).then(() => {
			download(asset.href).then(data => {
				const dirname = `${LOCAL_ASSETS_PATH}/${slug}/`;
				if(!fs.existsSync(dirname)) {
					fs.mkdirSync(dirname);
				}
				let filename = decodeURIComponent(path.basename(asset.href));
				filename = filename.split("?")[0];
				fs.writeFileSync(`${LOCAL_ASSETS_PATH}/${slug}/${filename}`, data);
				const index = feed.assetLedger.indexOf(assetURL);
				feed.assetLedger.splice(index, 1);
				if (!feed.assetLedger.length) {
					handleAssetSyncComplete(feed);
				}
			});
		})
	} else {
		handleAssetSyncComplete(feed);
	}
}

function handleAssetSyncComplete(feed) {
	// FLAG_LOGGING
	console.log(`${feed.slug} assets complete`);
	if (feed.local_bundled_at !== feed.remote_bundled_at) {
		const localjsonpath = `${LOCAL_ASSETS_PATH}/${feed.slug}/data.json`;
		fs.writeFile(localjsonpath, JSON.stringify(feed.tmp_data), (err) => {
			if (err) {
				// FLAG_LOGGING
				console.log('error saving json', err);
			}
			feed.local_bundled_at = feed.remote_bundled_at;
			// FLAG_LOGGING
			console.log(`updated ${feed.slug} data saved`);
			// todo: send refresh message to ${feed} display applications
		});
	}
}

function handleJSON(json, slug) {
	if (json.error) {
		// FLAG_LOGGING
		console.log(`${slug} \n feed error`, json);
		return;
	}

	const feed = feeds.find((item) => {
		return item.slug === slug;
	});
	feed.remote_bundled_at = json.bundled_at;
	if (!Number.isInteger(parseInt(feed.remote_bundled_at))) {
		// FLAG_LOGGING
		console.log(`${slug} \n feed bundled_at error`, json);
		return;
	}
	feed.tmp_data = json;
	feed.tmp_data.content.map((item) => {
		switch (item.type) {
			case 'event':
				if(item.data.background_image) {
					const imageUrl = item.data.background_image;
					appendAsset(item.data.background_image, slug, item.type);
					item.data.background_image = `http://${MASTER_HTTP_HOST}:${MASTER_API_PORT}/${MASTER_BASE_ASSETS_PATH}/${slug}/${path.basename(imageUrl)}`;
				}
				break;
			case 'community':
				if(item.data.profile.image) {
					const imageUrl = item.data.profile.image;
					appendAsset(imageUrl, slug, item.type);
					item.data.profile.image = `http://${MASTER_HTTP_HOST}:${MASTER_API_PORT}/${MASTER_BASE_ASSETS_PATH}/${slug}/${path.basename(imageUrl)}`;
				}
				break;
			case 'image':
			case 'welcome':
			case 'text_image':
				if(item.data.image) {
					const imageUrl = item.data.image;
					appendAsset(item.data.image, slug, item.type);
					item.data.image = `http://${MASTER_HTTP_HOST}:${MASTER_API_PORT}/${MASTER_BASE_ASSETS_PATH}/${slug}/${path.basename(imageUrl)}`;
				}
				break;
			default:
				break;
		}
		return item;
	});
	// console.log(JSON.stringify(feed.tmp_data));
	handleAssets(slug);
}

function start() {
	const cb = () => {
		feeds.map((feed) => {
			const localjsonpath = `${LOCAL_ASSETS_PATH}/${feed.slug}/data.json`;
			if (fs.existsSync(localjsonpath)) {
				const localjson = JSON.parse(fs.readFileSync(localjsonpath, 'utf8'));
				feed.local_bundled_at = localjson.bundled_at;
			}
			console.log('start', feed.slug);
			grabFeed(feed.slug);
			return feed;
		});
	};
	updateActiveFeeds(cb);
}

function updateActiveFeeds(cb) {
	fetch(`http://${ACTIVE_FEEDS}`)
		.then(res => {
			if (!res.ok) {
				// FLAG_LOGGING
				console.log('active fetch error res', res);
			}
			return res;
		})
		.then(res => res.json())
		.then(json => {
			json.map((activeSlug) => {
				console.log(activeSlug);
				const feed = feeds.find((item) => {
					return item.slug === activeSlug;
				});
				if (!feed) {
					const returnItem = {
						slug: activeSlug,
						local_bundled_at: 0,
						remote_bundled_at: 0,
						tmp_data: {},
						assetLedger: []
					};
					feeds.push(returnItem);
				}
			});
			if(cb) cb();
			console.log(feeds);
		})
		.catch((err) => {
			// FLAG_LOGGING
			console.log('active fetch error err', err);
		});
}

function getAll() {
	const cb = () => {
		feeds.map((feed) => {
			if (feed.assetLedger.length) {
				console.log('check for bad images');
				console.log(feed.assetLedger);
			}
			grabFeed(feed.slug);
			return feed;
		});
	};

	updateActiveFeeds(cb);
}

function cleanupOldAssets() {
	feeds.map((feed) => {
		const cleanup_path = `${LOCAL_ASSETS_PATH}/${feed.slug}/`;
		let files = [];
		try {
			files = fs.readdirSync(cleanup_path);
		} catch(err) {
			// FLAG_LOGGING
			if (err) console.log('clean up error: ' + err);
		}
		const maxAge = 15552000000; // 6 months in ms

		files.map((file) => {
			const stats = fs.statSync(`${cleanup_path}${file}`, function(err){
				// FLAG_LOGGING
				if ( err ) console.log('cleanup map ERROR: ' + err);
			});

			if(!stats){
				return;
			}
			const mTime = Date.parse(stats.mtime);
			const now = Date.now();
			const age = now - mTime;

			if(age > maxAge){
				// FLAG_LOGGING
				console.log(`cleaning up old asset: ${file}`);
				if(fs.existsSync(`${cleanup_path}${file}`)){
					fs.unlinkSync(`${cleanup_path}${file}`);
				}
			}
		});
	});
}

connect();
start();
cleanupOldAssets();

// Once a day, cleanup old assets
const scheduledCleanup = schedule.scheduleJob('* 4 * * *', function(){
	cleanupOldAssets();
});

const scheduledGet = schedule.scheduleJob('*/1 * * * *', function(){
	getAll();
});
