import React from 'react';
import PropTypes from 'prop-types';

import Eyebrow from '../../components/Eyebrow/Eyebrow';
import Header from '../../components/Header/Header';
import Subheader from '../../components/Subheader/Subheader';
import Icon from '../../components/Icon/Icon';

const Research = props => (
	<main className="research">
		<Icon
			templateClass="research__icon"
			color={props.color}
			shape={props.shape}
			key="icon"
		/>
		<section className="research__title">
			{/* This extra div is necessary for bottom-aligning researchs with long titles and centering everything else */}
			<div className="research__centerer">
				<Eyebrow
					templateClass="research__eyebrow"
					text={props.eyebrow}
					accent
				/>
				<Header
					templateClass="research__header"
					text={props.title}
				/>
			</div>
		</section>
		<section className="research__details">
			<Subheader
				templateClass="research__subheader"
				text={props.header}
				caps
			/>
			<section
				className="research__subcopy"
				dangerouslySetInnerHTML={{ __html: props.subcopy }} // eslint-disable-line
			/>
		</section>
	</main>
);

Research.propTypes = {
	eyebrow: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	header: PropTypes.string.isRequired,
	subcopy: PropTypes.string.isRequired,
	shape: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired
};

export default Research;
