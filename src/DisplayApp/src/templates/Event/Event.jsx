import React from 'react';
import PropTypes from 'prop-types';

import Eyebrow from '../../components/Eyebrow/Eyebrow';
import Header from '../../components/Header/Header';
import Subheader from '../../components/Subheader/Subheader';
import Paragraph from '../../components/Paragraph/Paragraph';
import Circle from '../../components/Circle/Circle';

const Event = props => (
	<main className="event">
		<Circle
			templateClass="event__circle"
			image={props.background_image}
			fillColor={props.color}
		/>
		<section className="event__content">
			{/* This extra div is necessary for bottom-aligning events with long titles and centering everything else */}
			<div className="event__centerer">
				<Eyebrow
					templateClass="event__eyebrow"
					text={props.eyebrow}
					accent
				/>
				<Header
					templateClass="event__header"
					text={props.title}
				/>
				<Subheader
					templateClass="event__subheader event__subheader--date"
					text={props.date}
					caps
				/>
				<Subheader
					templateClass="event__subheader event__subheader--time"
					text={props.time}
					caps
				/>
				<Subheader
					templateClass="event__subheader event__subheader--location"
					text={props.location}
					caps
				/>
			</div>
		</section>
		<Paragraph
			templateClass="event__paragraph"
			text={props.subcopy}
		/>
	</main>
);

Event.propTypes = {
	eyebrow: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired,
	time: PropTypes.string.isRequired,
	location: PropTypes.string.isRequired,
	subcopy: PropTypes.string.isRequired,
	background_image: PropTypes.string,
	color: PropTypes.string.isRequired
};

Event.defaultProps = {
	background_image: null
};

export default Event;
