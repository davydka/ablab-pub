// Import dependencies
import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import schedule from 'node-schedule';

// Import global components
import DateAndTime from './components/DateAndTime/DateAndTime';
import Footer from './components/Footer/Footer';

// Import all possible card templates
import Index from './templates/Index/Index';
import Welcome from './templates/Welcome/Welcome';
import Announcement from './templates/Announcement/Announcement';
import Research from './templates/Research/Research';
import Quote from './templates/Quote/Quote';
import Community from './templates/Community/Community';
import Image from './templates/Image/Image';
import TextAndImage from './templates/TextAndImage/TextAndImage';
import Event from './templates/Event/Event';
import List from './templates/List/List';
import Blank from './templates/Blank/Blank';

const queryString = require('query-string');

// eslint-disable-next-line no-unused-vars
require('electron').ipcRenderer.on('update', (event, message) => {
	document.body.classList.add('update');
});

class App extends Component {
	componentWillMount() {
		// Initialize state
		this.setState({
			interval: -1,
			cards: []
		});

		// Animation constants
		this.enterTimeout = 3000;
		this.leaveTimeout = 1000;
		this.startingInterval = 0;
		this.delay = 0;

		// Card Counts
		this.cardsTimeCountArray = [];
		this.delayTimeout = setTimeout(() => {}, 10);
		this.transitioning = false;

		// Get URL params
		const params = queryString.parse(window.location.search);

		this.color = document.querySelector('body').getAttribute('data-color') || params.color;

		// Define API endpoint
		this.apiEndpoint = params.api;

		// Flags for setting up app as one of many
		this.screenNumber = parseInt(params.screen, 10);
		this.inGroupOf = parseInt(params.group, 10);

		// Random icon for research card
		// Possible string values taken from Icon.jsx
		this.researchIcons = ['head', 'helix'];
		this.animations = ['head', 'helix'];

		// Function to start the app from scratch
		this.initializeDisplay();
	}

	componentDidMount() {
		// Testing only: click events for jumping around templates
		document.querySelector('.app').addEventListener('click', this.handleClick.bind(this));
	}

	componentDidUpdate() {
		this.transitioning = false;
	}

	//
	// Asyc call for app JSON data
	//

	getCardData() {
		const app = this;

		const request = new XMLHttpRequest();
		// request.open('GET', '/dist/json/sample_feed_2.json', true);
		request.open('GET', this.apiEndpoint, true);

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				const data = JSON.parse(request.responseText);
				app.wrangleData(data);
			}
			else {
				// FLAG LOGGING
				console.log('return error');
				setTimeout(app.getCardData.bind(app), 1000);
			}
		};

		request.onerror = function() {
			// FLAG LOGGING
			console.log('connection error');
			setTimeout(app.getCardData.bind(app), 1000);
		};

		request.send();
	}

	getMsSinceMidnight(d) {
		const e = new Date(d);
		return d - e.setHours(0, 0, 0, 0);
	}

	initializeDisplay() {
		// Get card data on app mount
		this.getCardData();
	}

	// Function for restarting with new data
	restart() {
		// Stop cycle
		this.stopCycling();

		// Reset data to empty state and restart
		this.setState({
			cards: []
		}, () => {
			setTimeout(this.initializeDisplay.bind(this), this.leaveTimeout);
		});
	}

	//
	// Modify data before starting cycle
	// Modifications based on screen's position in a group
	//

	wrangleData(data) {
		// Default: just use all cards in JSON
		let cards = data.content;
		cards = data.content.map((item, i) => {
			const returnItem = item;
			returnItem.key = i;
			return returnItem;
		});

		const interval = parseInt(data.cycle_duration, 10) * 1000; // seconds to miliseconds
		this.startingInterval = interval; // save for restoring if cycle is stopped for testing

		// Delay for cycle, only used on groups of two screens
		// Note that groups of four do not have a delay because they have blanks
		this.delay = 0;

		// If this is in a group of two screens
		if (this.inGroupOf === 2) {
			// Delay as function of screen index
			this.delay = (interval / this.inGroupOf) * (this.screenNumber - 1);

			// Odd-numbered screens show even numbered indexes
			const oddScreen = this.screenNumber % 2 === 1;

			// Filter to either even or odd cards based on screen index
			// eslint-disable-next-line arrow-body-style
			cards = data.content.filter((word, i) => {
				return (oddScreen) ? i % 2 === 0 : i % 2 === 1;
			});
		}
		// If this is in a group of four screens, replace every other card with blank
		else if (this.inGroupOf === 4) {
			// Left or right (i.e. screens 1 and 2 vs screens 3 and 4)
			// determines if even or odd slides are shown
			const inLeftHalf = this.screenNumber < 3;

			// Filter to either even or odd cards based on screen index
			// eslint-disable-next-line arrow-body-style
			const filteredCards = data.content.filter((word, i) => {
				return (inLeftHalf) ? i % 2 === 0 : i % 2 === 1;
			});

			// Shuffle in blanks
			// eslint-disable-next-line arrow-body-style
			cards = filteredCards.map((item, i) => {
				return ((this.screenNumber + i) % 2 === 0) ? { type: 'blank' } : item;
			});

			// Determine if app should be hidden on first slide
			this.currentIsBlank = this.screenNumber % 2 === 0;
		}

		const midnight = new Date();
		midnight.setHours(23, 59, 59, 0);
		let cardsTimeCount = 0;
		for (let i = 0; i < 86400 * 1000; i++) {
			if (i % interval === 0) {
				this.cardsTimeCountArray.push([i / 1000, cardsTimeCount]);
				cardsTimeCount++;
				if (cardsTimeCount > cards.length - 1) {
					cardsTimeCount = 0;
				}
			}
		}

		const currentCard = 0; // change this value for testing a particular template, cycle won't start

		// Save data and start cycle (after optional delay)
		this.setState({ cards, interval, currentCard }, () => {
			// Don't start cycling if testing with manual currentCard
			if (currentCard === 0) {
				this.startCycling();
			}
		});
	}

	//
	// Click events for testing only
	//

	handleClick(e) {
		// Footer link click
		if (e.target.classList.contains('footer') || e.target.classList.contains('footer__url')) {
			// Stop cycle and show index
			this.setState({
				currentCard: -1
			});
			this.stopCycling();
		}

		// Index item click
		if (e.target.classList.contains('index__link')) {
			// Show selected card template
			this.setState({
				currentCard: e.target.getAttribute('data-card-index')
			});
		}

		// Footer spiner click
		if (e.target.classList.contains('footer-spinner')) {
			// Restart cycle
			// We don't use restart() because we don't need new data
			this.setState({
				interval: this.startingInterval,
				currentCard: 0
			});
			this.startCycling();
		}
	}

	//
	// Cycling between cards
	//

	startCycling() {
		this.rotationInterval = schedule.scheduleJob('*/5 * * * * *', () => {
			this.rotateCard();
		});
	}

	stopCycling() {
		// Clear interval for changing car
		if (this.rotationInterval !== undefined) {
			this.rotationInterval.cancel();
		}

		// Set interval to -1, to pass to footer
		this.setState({
			interval: -1
		});
	}

	rotateCard() {
		const { cards } = this.state;

		let now = this.getMsSinceMidnight(new Date());
		now = Math.round(now / this.state.interval);

		const newCard = this.cardsTimeCountArray[now][1];

		if (newCard !== this.state.currentCard) {
			// See if new card is blank to hide app
			this.currentIsBlank = cards[newCard].type === 'blank';

			// Update state to refresh
			if (this.delay && !this.transitioning) {
				this.transitioning = true;
				clearTimeout(this.delayTimeout);
				this.delayTimeout = setTimeout(() => {
					this.setState({ currentCard: newCard });
				}, this.delay);
			}
			if (!this.delay) {
				this.setState({ currentCard: newCard });
			}
		}
	}

	//
	// Rendering, markup
	//

	renderCard(cardIndex) {
		// Return index for special index
		if (this.state.currentCard === -1) {
			return <Index cards={this.state.cards} />;
		}

		let cardTemplate;
		const card = this.state.cards[cardIndex];

		if (card !== undefined) {
			switch (card.type) {
				case 'welcome':
					cardTemplate = (
						<Welcome {...card.data} key={card.key} name={card.type} color={this.color} />
					);
					break;
				case 'announcement':
					cardTemplate = (
						<Announcement {...card.data} key={card.key} name={card.type} color={this.color} />
					);
					break;
				case 'research':
					cardTemplate = (
						<Research {...card.data} key={card.key} name={card.type} shape={this.researchIcons[Math.floor(Math.random() * this.researchIcons.length)]} color={this.color} />
					);
					break;
				case 'quote':
					cardTemplate = (
						<Quote {...card.data} key={card.key} name={card.type} animation={this.animations[Math.floor(Math.random() * this.animations.length)]} color={this.color} />
					);
					break;
				case 'community':
					cardTemplate = (
						<Community {...card.data} key={card.key} name={card.type} color={this.color} />
					);
					break;
				case 'image':
					cardTemplate = (
						<Image {...card.data} key={card.key} name={card.type} color={this.color} />
					);
					break;
				case 'text_image':
					cardTemplate = (
						<TextAndImage {...card.data} key={card.key} name={card.type} color={this.color} />
					);
					break;
				case 'event':
					cardTemplate = (
						<Event {...card.data} key={card.key} name={card.type} color={this.color} />
					);
					break;
				case 'list':
					cardTemplate = (
						<List {...card.data} key={card.key} name={card.type} color={this.color} />
					);
					break;
				default:
					cardTemplate = <Blank key="blank" color={this.color} />;
					break;
			}
		}

		return cardTemplate;
	}

	render() {
		const { currentCard, cards, interval } = this.state;
		if (!cards.length) {
			// return null;
			document.body.classList.add('update');
		}
		else {
			document.body.classList.remove('update');
		}

		// Count cards and get current
		const footerTotal = cards.length;
		const footerCurrent = parseInt(currentCard, 10) + 1;

		// Get CTA URL from card
		const url = (cards[currentCard] !== undefined) ? cards[currentCard].footer_url : '';
		const label = (cards[currentCard] !== undefined) ? cards[currentCard].footer_label : '';

		return (
			<CSSTransitionGroup
				component="section" // wrapper tag
				className="app" // wrapper class
				data-hidden={this.currentIsBlank}
				transitionName="card" // animation class
				transitionAppear // necessary to animate header/footer
				transitionAppearTimeout={this.enterTimeout}
				transitionEnterTimeout={this.enterTimeout}
				transitionLeaveTimeout={this.leaveTimeout}
			>
				<DateAndTime />
				{ this.renderCard(currentCard) }
				<Footer
					currentCard={footerCurrent}
					totalCards={footerTotal}
					label={label}
					url={url}
					interval={interval}
				/>
			</CSSTransitionGroup>
		);
	}
}

export default App;
