import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Subheader = props => (
	<h4 className={classNames(
		'subheader',
		props.templateClass,
		{ caps: props.caps }
	)}
	>
		{ props.text }
	</h4>
);

Subheader.propTypes = {
	text: PropTypes.string.isRequired,
	caps: PropTypes.bool,
	templateClass: PropTypes.string
};

Subheader.defaultProps = {
	caps: false,
	templateClass: null
};

export default Subheader;
