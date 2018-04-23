# Installation Project
Master Controller and Display Application for installation project.

![Tech Diagram](tech_diagram.png?raw=true "Tech Diagram")

## Display Application - Getting Started
* `git clone https://github.com/davydka/ablab-pub`
*  `cd` into `/src`
* `npm install`
*  Copy `.env.example.display.dev` to `.env`: `cp .env.example.display.dev .env`
* `npm start` will run all 
* `npm stop`
* Use `npm run logs` to print NPM and Webpack messages in the terminal

## Display Application
The Display application is a simple React app within an Electron window. The Display App cycles through JSON card data over a given interval. The Display App is agnostic of feed or location and will simply iterate over supplied data. The only "awareness" maintained by the app is its position within a set of screens -- the interval, delay, and division of data display is a function of where the application appears in a set of one, two, or four screens. 

State is managed by the parent App component and  card "template" components are displayed according their type. Templates in turn pull a number of functional display components. CSS classes are applied during transitions to achieve most animation, but some more complex animations (line-by-line text, canvas) are managed with Greensock tweens. 

Data is pulled from the Master Controller asynchronously. The app begins its cycle once data has been pulled and manipulated as necessary for a give screen position in a group. The app also has a "restart" function which will trigger a new data call and a new animation cycle. 

For testing, users may click the footer CTA URL to open an index of all cards present in the retrieved JSON (if the card has no footer CTA, click the bottom right corner where the URL would be). If the cycle should be restarted, click the "spinner" animation in the bottom left corner of the footer. Note that clicking around cards quickly might overlap animations. 

In production, the Electron window of the Display Application is set to transparent and the background animations are handled by OpenFrameworks applications and/or VLC. In development, the Electron window shows a simple css gradient.


## Master Controller - Getting Started
* `git clone https://github.com/codeandtheory/abilitylab-signage-hardware`
*  `cd` into `/src`
* `npm install`
*  Copy `.env.example.mastercontroller` to `.env`: `cp .env.example.mastercontroller .env`
* `npm start` will run all 
* `npm stop`
* Use `npm run logs` to print NPM and Webpack messages in the terminal

## Master Controller
The Master Controller is a utility machine that exists onsite at the hospital. It serves a few different purposes. 
  1) The Master Controller acts as a local cache of data and images from the CMS. 
  2) The Master Controller serves as a guard against corrupt data and images should the CMS serve faulty data. This prevents bad information from propagating down the Display Applications. An example of this is the Master Controller loops through the data json from the CMS and attempts to download and store all images. If any images are unable to be synced the Master Controller will not store the new data.json until the problem has been corrected. 
  3) The Master Controller acts as a local webserver to serve it's stored data and assets out to the Display Applications. If there's any problems with the Internet or with the CMS, the onsite Display Applications will continue to display content while any network issues are resolved. 
  4) The Master Controller will be the VPN point of entry for administering and maintaining the Display Applications. It does this through Jenkins and Ansible.
  
## Example CMS API Endpoints
  * http://xxx/api/v1/active-feeds
  * http://xxx/api/v1/signage-feed/[FEED_NAME] (i.e. http://xxx/api/v1/signage-feed/ground_floor)
  
## Environment Variables and PM2
This code repository essentially contains 2 applications with 2 codebases (not counting the OpenFrameworks Backgrounds). To manage which application you will be running we use a combination of environment variables and PM2 for process management. Most environment variables are set inside a `.env` file at the root of the src folder. Any environment variables that are set in a user's `~/.profile` will take precedence over anything in the dot-env file. The default install for a production Display Application has the `BACKGROUND` environment variable in the `.profile` so that Ansible compiles the correct background animation on the initial install. If your change your environment variable inside `.profile` you need to run `source ~/.profile` in each console window for your changes to take effect (until you reboot the machine).


### Shared Env Vars
At the top of each `.env.example.*` file there is an entry for `APP_ID`. This entry should either be `display` or `master` to kick off either application when running `npm start`. The main place where this kickoff happens is inside `ecosystem.config.js` which is a "process file" that PM2 uses to fine tune the behaviour and options for each process it will be managing. Note: there is a third APP_ID option `dual` to run both a Display App and a Master Controller at the same time if you want to do testing or development.

The next section in the `.env` file are shared Master Controller variables for both the Display app and the Master Controller.
  * `MASTER_HTTP_HOST` - The IP address or URL for pointing to the master controller. The Display App uses this value to point itself to the Master Controller for assets, json, and html files. The Master Controller uses this value to modify the incoming data.json assets entries to point to the proper location. (i.e. incoming data shows http://qa.sralab.com/images/123.jsg, this gets replaced to http://[MASTER_HTTP_HOST]/images/123.jpg).
  * `MASTER_HTTP_PORT` - Port number for serving html files and bundled JS files.
  * `MASTER_API_PORT` - Port number for serving assets and data.json.

After declaring your application identity, the next sections in the `.env` file show options for either Display or Master. 

### Display Env Vars
Notable vars for Display are `OF_ENABLED`, `API_ENDPOINT`, `SCREEN_NUMBER`, `IN_GROUP_OF`, `BACKGROUND`, and `FEED`. 
  * `OF_ENABLED` - Sets the Electron window to transparent and works in conjunction with `BACKGROUND`.
  * `API_ENDPOINT` - The URL to point to for assets and data.json files (TODO: fix redundancy between shared environment variables listed above, namely `MASTER_HTTP_HOST`).
  * `SCREEN_NUMBER` - Which screen index it is in it's group. Values range from 1-4 (not zero-based index)
  * `IN_GROUP_OF` - Groups are either 1, 2, or 4.
  * `BACKGROUND` - Sets the colorscheme/theme for the Display and sets with background animation program to run.
  * `FEED` - Which feed to point to (ground_floor, outpatient, etc.)


### Master Env Vars
Notable vars for Master are `AMQP_HOST` and the other ampq settings. The Master Controller receives messages to sync data when the user in the CMS click "Publish to Displays". The `API_BASE_PATH` is the url to the CMS and the `MASTER_BASE_ASSETS_PATH` is the directory where it will be storing assets and JSON files locally.

Lastly, the `NODE_ENV` is currently being used for two things. 1) Whether to append `data.json` to it's `MASTER_HTTP_HOST` for api calls (TODO: reevaluate this use of the var) and 2) To tell PM2 whether it should automatically restart a process once it exits (which is annoying on local dev).

## Package.json Notes
There are a lot of processes listed in the `package.json` file and it works in conjunction with the `ecosystem.config.js` file. `npm start` and `npm stop` are self explanatory and there are a few PM2 shortcuts there in case you don't have PM2 install globally, i.e. `npm run monit` and `npm run logs`.

There are several entries for build processes. The most used one with be `npm run build:display` with does the webpack bundling for the html/css/js portion of the Display App. The `build:background` entries are for compiling the OpenFrameworks background animations.

Next are the `process` entries. 
  * `process:newrelic` pipes PM2 logs output to New Relic. Can run on both Master Controller and Display App.
  * `process:master` is the main Master Controller node process.
  * `process:master:apiendpoint` and `process:master:httpserver` are the 2 web servers running on the Master Controller. (TODO: consolidate these into 1 web server)
  * `process:display:dev` runs the webpack dev seever for local development.
  * `process:electron` fires up Electron and displays content. It is used both on local development and in production.
  * `process:background:*` these entries are for the various animated background. Entries with and index (i.e. pediatrics1) are used to pass arguments to the app so that it positions the animation correctly in groups of screens that are larger than 1.
  
