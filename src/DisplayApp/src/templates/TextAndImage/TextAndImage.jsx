import React from 'react';
import PropTypes from 'prop-types';

import Eyebrow from '../../components/Eyebrow/Eyebrow';
import Header from '../../components/Header/Header';
import Paragraph from '../../components/Paragraph/Paragraph';

const Image = props => (
	<main className="text-and-image">
		<section className="text-and-image__header">
			<Eyebrow
				text={props.eyebrow}
				templateClass="text-and-image__eyebrow"
				accent
			/>
			<Header
				text={props.title}
				templateClass="text-and-image__title"
			/>
		</section>
		<img
			alt={props.title}
			className="text-and-image__img"
			src={props.image}
		/>
		<Paragraph
			templateClass="text-and-image__paragraph"
			text={props.subcopy}
			size="medium"
		/>
	</main>
);

Image.propTypes = {
	eyebrow: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	subcopy: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired
};

export default Image;
