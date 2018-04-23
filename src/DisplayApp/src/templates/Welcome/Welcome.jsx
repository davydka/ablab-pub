import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Paragraph from '../../components/Paragraph/Paragraph';
import Squiggle from '../../components/Squiggle/Squiggle';

const Welcome = props => (
	<main className="welcome">
		<section
			className={classNames(
				'welcome__background',
				`welcome__background--${props.color}`
			)}
		>
			<svg
				className="welcome__svg"
				width="1080"
				height="1920"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
			>
				<linearGradient id="red" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#f26b21" />
					<stop offset="100%" stopColor="#ea1c2b" />
				</linearGradient>
				<linearGradient id="orange" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#fbab18" />
					<stop offset="100%" stopColor="#ff6b00" />
				</linearGradient>
				<linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#3fbfad" />
					<stop offset="100%" stopColor="#0d51a3" />
				</linearGradient>
				<linearGradient id="cyan" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#75cee0" />
					<stop offset="100%" stopColor="#33afa3" />
				</linearGradient>
				<linearGradient id="purple" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#ceb2d4" />
					<stop offset="100%" stopColor="#7ea4d9" />
				</linearGradient>
				<linearGradient id="green" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#8ecf43" />
					<stop offset="100%" stopColor="#44ba2d" />
				</linearGradient>
				<defs>
					<rect id="grad" x="0" y="0" width="100%" height="100%" fill={`url(#${props.color})`} />
					<filter id="welcome">
						<feImage xlinkHref="#grad" x="0" y="0" />
						<feBlend in="SourceGraphic" in2="floodFill" mode="screen" />
					</filter>
				</defs>

				<image
					alt="Welcome"
					className="welcome__img"
					xlinkHref={props.image}
					x="0"
					y="0"
					width="100%"
					height="100%"
					style={{ filter: 'url(#welcome)' }}
				/>
			</svg>
		</section>
		<section className="welcome__content">
			<Squiggle
				templateClass="welcome__accent"
			/>
			<h1
				className="welcome__title"
			>
				{props.title}
			</h1>
			<Paragraph
				text={props.subcopy}
				renderMarkup
				templateClass="welcome__subcopy"
				size="medium"
			/>
		</section>
	</main>
);

Welcome.propTypes = {
	title: PropTypes.string.isRequired,
	subcopy: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired
};

export default Welcome;
