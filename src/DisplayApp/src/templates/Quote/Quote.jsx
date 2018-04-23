import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';

import Eyebrow from '../../components/Eyebrow/Eyebrow';
import Paragraph from '../../components/Paragraph/Paragraph';
import Icon from '../../components/Icon/Icon';
import Animation from '../../components/Animation/Animation';

const SplitText = require('../../vendor/SplitText.min.js');

class Quote extends Component {
	componentDidMount() {
		// Wait for fade out delay to accurately size lines
		this.visible = false;
		setTimeout(() => {
			this.animateQuote(true);
		}, 1000); // this should match leavetimeout in app.jsx
	}

	componentDidUpdate() {
		// This component is updated when it's about to be removed
		if (this.visible) {
			this.animateQuote();
		}
	}

	animateQuote(initialLoad) {
		// Init splittext
		this.splitText = new SplitText('.quote__subcopy', { type: 'lines' });
		this.timeline = new TimelineLite();

		// Get animation classes to determine if coming or going
		const currentClasses = document.querySelector('.quote').classList;

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
			<main className="quote">
				<section className="quote__content">
					<Icon
						templateClass="quote__icon"
						shape="quote"
					/>
					<Paragraph
						templateClass="quote__subcopy"
						text={this.props.body}
						size="huge"
					/>
					<Eyebrow
						templateClass="quote__eyebrow"
						text={this.props.subcopy}
						bold={false}
					/>
				</section>
				<Animation
					templateClass="quote__illustration"
					type={this.props.animation}
					color={this.props.color}
				/>
			</main>
		);
	}
}

Quote.propTypes = {
	body: PropTypes.string.isRequired,
	subcopy: PropTypes.string.isRequired,
	animation: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired
};

export default Quote;
