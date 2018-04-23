import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Paragraph = (props) => {
	if (props.renderMarkup) {
		return (
			<p
				className={classNames(
					props.size,
					props.templateClass
				)}
				dangerouslySetInnerHTML={{ __html: props.text }} // eslint-disable-line
			/>
		);
	}

	return (
		<p
			className={classNames(
				props.size,
				props.templateClass
			)}
		>
			{ props.text }
		</p>
	);
};

Paragraph.propTypes = {
	text: PropTypes.string.isRequired,
	size: PropTypes.string,
	templateClass: PropTypes.string,
	renderMarkup: PropTypes.bool
};

Paragraph.defaultProps = {
	size: '',
	templateClass: null,
	renderMarkup: false
};

export default Paragraph;
