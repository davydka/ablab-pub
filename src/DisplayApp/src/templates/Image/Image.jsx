import React from 'react';
import PropTypes from 'prop-types';

const Image = props => (
	<main className="image">
		<img
			className="image__img"
			src={props.image}
			alt="Floorplan"
		/>
	</main>
);

Image.propTypes = {
	image: PropTypes.string.isRequired
};

export default Image;
