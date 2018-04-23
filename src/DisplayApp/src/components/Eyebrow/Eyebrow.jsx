import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Squiggle from '../Squiggle/Squiggle';

const Eyebrow = (props) => {
	// Basic eyebrow content
	let content = props.text;

	// Include squiggle accent
	if (props.accent) {
		content = (
			<span>
				<Squiggle templateClass="eyebrow__accent" />
				<span className="eyebrow__text">
					{props.text}
				</span>
			</span>
		);
	}

	return (
		<h5 className={classNames(
			'eyebrow',
			{ bold: props.bold },
			props.templateClass
		)}
		>
			{content}
		</h5>
	);
};

Eyebrow.propTypes = {
	text: PropTypes.string.isRequired,
	templateClass: PropTypes.string,
	accent: PropTypes.bool,
	bold: PropTypes.bool
};

Eyebrow.defaultProps = {
	templateClass: null,
	accent: false,
	bold: true
};

export default Eyebrow;
