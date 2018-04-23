import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Define max character count before switching to smaller style
const characterMaxForLargeStyle = 80;

const Header = props => (
	<h2 className={classNames(
		'header',
		props.templateClass,
		{ caps: props.caps },
		{ 'header--long': props.text.length >= characterMaxForLargeStyle }
	)}
	>
		{ props.text }
	</h2>
);

Header.propTypes = {
	text: PropTypes.string.isRequired,
	caps: PropTypes.bool,
	templateClass: PropTypes.string
};

Header.defaultProps = {
	caps: false,
	templateClass: null
};

export default Header;
