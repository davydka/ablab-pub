import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TimelineLite } from 'gsap';

import Header from '../../components/Header/Header';
import Paragraph from '../../components/Paragraph/Paragraph';
import Icon from '../../components/Icon/Icon';
import Squiggle from '../../components/Squiggle/Squiggle';

const SplitText = require('../../vendor/SplitText.min.js');

const icons = {
	general: 'speech',
	alert: 'bell'
};

class Announcement extends Component {
	componentDidMount() {
		// Wait for fade out delay to accurately size lines
		this.visible = false;
		setTimeout(() => {
			this.animateAnnouncement(true);
		}, 1000); // this should match leavetimeout in app.jsx
	}

	componentDidUpdate() {
		// This component is updated when it's about to be removed
		if (this.visible) {
			this.animateAnnouncement();
		}
	}

	animateAnnouncement(initialLoad) {
		// Init splittext
		this.splitText = new SplitText('.announcement__body', { type: 'lines' });
		this.timeline = new TimelineLite();

		// Get animation classes to determine if coming or going
		const currentClasses = document.querySelector('.announcement').classList;

		// Fade in if initial load or if component re-appearing
		if (initialLoad || ([...currentClasses].indexOf('card-enter') !== -1 && !this.visible)) {
			// Animate
			this.timeline.staggerFrom(this.splitText.lines, 2, {
				delay: 0.6,
				opacity: 0,
				y: 40,
				ease: 'easeOutQuint'
			}, 0.1);

			this.visible = true;
		}
	}

	render() {
		return (
			<main className="announcement">
				<section
					className={classNames(
						'announcement__icon-wrap',
						`announcement__icon-wrap--${this.props.color}`
					)}
				>
					<Icon
						templateClass="announcement__icon"
						shape={icons[this.props.type]}
					/>
				</section>
				<Header
					templateClass="announcement__body"
					text={this.props.body}
				/>
				<Squiggle
					templateClass="announcement__accent"
				/>
				<Paragraph
					templateClass="announcement__subcopy"
					text={this.props.subcopy}
				/>
			</main>
		);
	}
}

Announcement.propTypes = {
	type: PropTypes.string.isRequired,
	body: PropTypes.string.isRequired,
	subcopy: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired
};

export default Announcement;
