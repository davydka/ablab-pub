import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Circle = (props) => {
	let image = '';

	if (props.image !== '') {
		// Just return image if no effect
		if (props.fullOpacity) {
			image = <img alt="Card Background" className="circle__image" src={props.image} />;
		}
		else {
			// Wrap image in SVG for blending
			const contrast = 1.7;
			image = (
				<svg
					className="circle__svg"
					width="875"
					height="875"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<linearGradient id="red" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#EF6823" />
						<stop offset="100%" stopColor="#EA232D" />
					</linearGradient>
					<linearGradient id="orange" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#FC9B12" />
						<stop offset="100%" stopColor="#ea232d" />
					</linearGradient>
					<linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#3D9CAB" />
						<stop offset="100%" stopColor="#2162A5" />
					</linearGradient>
					<linearGradient id="cyan" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#64C6D1" />
						<stop offset="100%" stopColor="#46B8B4" />
					</linearGradient>
					<linearGradient id="purple" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#B2ADD6" />
						<stop offset="100%" stopColor="#7EA4D9" />
					</linearGradient>
					<linearGradient id="green" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#79C51C" />
						<stop offset="100%" stopColor="#5DC027" />
					</linearGradient>
					<defs>
						<rect id="grad" x="0" y="0" width="100%" height="100%" fill={`url(#${props.fillColor})`} />
						<filter id="circle">
							<feColorMatrix in="SourceGraphic" result="grayscale-filter" type="saturate" values="0" />
							<feComponentTransfer in="grayscale-filter" result="contrast-filter">
								<feFuncR type="linear" slope={contrast} intercept={-(0.1 * contrast) + 0.1} />
								<feFuncG type="linear" slope={contrast} intercept={-(0.1 * contrast) + 0.1} />
								<feFuncB type="linear" slope={contrast} intercept={-(0.1 * contrast) + 0.1} />
							</feComponentTransfer>
							<feImage result="gradient" xlinkHref="#grad" x="0" y="0" />
							<feBlend in="contrast-filter" in2="gradient" mode="multiply" />
						</filter>
					</defs>

					<image
						alt="Card Background"
						className="circle__image"
						xlinkHref={props.image}
						x="0"
						y="0"
						width="100%"
						height="100%"
						style={{ filter: 'url(#circle)' }}
					/>
				</svg>
			);
		}
	}

	return (
		<div
			className={classNames(
				'circle',
				{ 'circle--full-opacity': props.fullOpacity },
				{ 'circle--with-image': props.image },
				props.templateClass,
				`circle--${props.fillColor}`
			)}
		>
			{ image }
		</div>
	);
};

Circle.propTypes = {
	image: PropTypes.string,
	templateClass: PropTypes.string,
	fullOpacity: PropTypes.bool,
	fillColor: PropTypes.string.isRequired
};

Circle.defaultProps = {
	image: null,
	templateClass: null,
	fullOpacity: false
};

export default Circle;
