import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';

import Eyebrow from '../../components/Eyebrow/Eyebrow';
import Paragraph from '../../components/Paragraph/Paragraph';
import Circle from '../../components/Circle/Circle';
import Squiggle from '../../components/Squiggle/Squiggle';

const SplitText = require('../../vendor/SplitText.min.js');

class Community extends Component {
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
		this.splitText = new SplitText('.community__body', { type: 'lines' });
		this.timeline = new TimelineLite();

		// Get animation classes to determine if coming or going
		const currentClasses = document.querySelector('.community').classList;

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
		const { profile, body, color } = this.props;

		return (
			<main className="community">
				<Circle
					templateClass="community__circle"
					image={profile.image}
					fullOpacity
					fillColor={color}
				/>
				<Paragraph
					templateClass="community__body"
					size="large"
					text={`“${body}”`}
				/>
				<Squiggle
					templateClass="community__accent"
				/>
				<section className="community__subcopy">
					<Eyebrow
						templateClass="community__profile-name"
						bold={false}
						text={profile.display_name}
					/>
					<Eyebrow
						templateClass="community__profile-title"
						bold={false}
						text={profile.position}
					/>
				</section>
			</main>
		);
	}
}

Community.propTypes = {
	body: PropTypes.string.isRequired,
	profile: PropTypes.object.isRequired,
	color: PropTypes.string.isRequired
};

export default Community;
