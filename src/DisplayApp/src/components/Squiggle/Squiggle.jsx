import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Squiggle = props => (
	<svg
		className={classNames(
			'squiggle',
			props.templateClass
		)}
		viewBox="0 0 90 25"
	>
		<path
			className="squiggle__path"
			d="M1,6 C9.389,6 9.389,20.4 17.777,20.4 C26.169,20.4 26.169,6 34.561,6 C42.952,6 42.952,20.4 51.344,20.4 C59.737,20.4 59.737,6 68.13,6 C76.523,6 76.523,20.4 84.917,20.4"
		/>
	</svg>
);

Squiggle.propTypes = {
	templateClass: PropTypes.string
};

Squiggle.defaultProps = {
	templateClass: null
};

export default Squiggle;
