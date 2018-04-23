import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TweenLite, Quint } from 'gsap';
import classNames from 'classnames';

class Animation extends Component {
	componentDidMount() {
		this.initialDelay = 1000; // this should match leavetimeout in app.jsx;
		// Wait for fade out delay
		this.visible = false;
		setTimeout(() => {
			if (this.props.type === 'helix') {
				// Init helix animation
				this.helixInit();
			}
			else if (this.props.type === 'head') {
				// Init head animation
				this.headInit();
			}
		}, this.initialDelay);
	}

	componentWillUnmount() {
		if (this.props.type === 'helix') {
			// Stop animation cycle
			TweenLite.ticker.removeEventListener('tick', this.helixTick, this);
		}
	}
	//
	// Head/eye animation
	//

	headInit() {
		// Set svg size
		this.svgWidth = 627;
		this.svgHeight = 286;
		this.svg.setAttribute('width', this.svgWidth);
		this.svg.setAttribute('height', this.svgHeight);

		// Start to animate in shapes after previous slide has faded out
		setTimeout(() => {
			this.headAnimate();
		}, 1000);
	}

	headAnimate() {
		// Element selectors
		const leftCircle = document.querySelector('.animation__head-circle--left');
		const rightCircle = document.querySelector('.animation__head-circle--right');
		const leftTriangle = document.querySelector('.animation__triangle--left');
		const rightTriangle = document.querySelector('.animation__triangle--right');

		// Set initial transforms
		// TODO: figure out why we need gsap for this
		TweenLite.to(leftCircle, 0, { transformOrigin: 'center center', scale: 0, x: '65px' });
		TweenLite.to(rightCircle, 0, { transformOrigin: 'center center', scale: 0 });
		TweenLite.to(leftTriangle, 0, { transformOrigin: 'right center', scale: 0 });
		TweenLite.to(rightTriangle, 0, { transformOrigin: 'right center', scaleX: 0 });

		// Define delays and durations in seconds
		const delay0 = 1.2 - (this.initialDelay / 1000); // milliseconds to seconds
		const delay1 = delay0 + 0.3;
		const delay2 = delay1 + 0.15;

		const durationShort = 0.5;
		const durationLong = 2;

		// Animate!
		TweenLite.to(rightCircle, durationShort, { ease: Quint.easeOut, delay: delay0, scale: 1 });
		TweenLite.to(rightTriangle, durationShort, { ease: Quint.easeOut, delay: delay1, scaleX: 1 });
		TweenLite.to(leftCircle, durationLong, {
			ease: Quint.easeOut, delay: delay2, scale: 1, x: '0px'
		});
		TweenLite.to(leftTriangle, durationLong, { ease: Quint.easeOut, delay: delay2, scale: 1 });
	}

	//
	// Helix animation
	//

	helixInit() {
		// Set canvas size and save context
		this.canvasWidth = 300;
		this.canvasHeight = 400;
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
		this.ctx = this.canvas.getContext('2d');

		// Wave properties
		this.phase = 0; // this will be incremented over time
		this.phaseShift = 0.26; // how much to increment each frame
		this.step = 34; // milleseconds between frames
		this.rarity = 4; // height / rarity = number of circles

		this.amplitude = 100; // wave amplitude
		this.freq = 0.016; // angular frequency
		this.width = 40; // width of wave
		this.height = 350; // height of wave

		// Helix colors per body color/theme
		const themes = {
			// Theme 1
			orange: {
				front: '#FEC760',
				back: '#FAB336'
			},
			// Theme 2
			red: {
				front: '#F9A21A',
				back: '#F58830'
			},
			blue: {
				front: '#F9A21A',
				back: '#F58830'
			},
			// Theme 3
			cyan: {
				front: '#FFDB77',
				back: '#FFCD45'
			},
			purple: {
				front: '#FFDB77',
				back: '#FFCD45'
			},
			green: {
				front: '#FFDB77',
				back: '#FFCD45'
			}
		};

		this.frontColor = themes[this.props.color].front;
		this.backColor = themes[this.props.color].back;

		this.origin = {
			x: this.canvasWidth - this.amplitude - (this.width / 2),
			y: this.width / 2
		};

		// Storage for wave arrays and wave peak y positions
		this.wave1 = [];
		this.wave2 = [];
		this.rightFlipPoint = 0;
		this.leftFlipPoint = 0;

		// Create circle objects and add to arrays
		for (let i = 0; i < (this.height / this.rarity); i++) {
			const circle = {
				cy: (i * this.rarity) + this.origin.y
			};

			this.wave1.push({ ...circle });
			this.wave2.push({ ...circle });
		}

		// Begin animation cycle
		TweenLite.ticker.addEventListener('tick', this.helixTick, this);
	}

	// Function passed to gsap
	helixTick() {
		this.helixUpdate();
		this.helixDraw();
	}

	// Runs every frame
	// Calculate all circle positions, record wave peak positions
	helixUpdate() {
		// Loop over all y positions on both waves
		for (let i = 0; i < (this.height / this.rarity); i++) {
			// Get and set new x for wave1
			const newX = (Math.sin(this.freq * ((i + this.phase) * this.rarity)) * this.amplitude) + this.origin.x;
			this.wave1[i].cx = newX;

			// Also update corresponding circle on wave2
			const newXReverse = (Math.sin(this.freq * ((i + this.phase) * this.rarity)) * (-1 * this.amplitude)) + this.origin.x;
			this.wave2[i].cx = newXReverse;

			// Save Y position of peaks
			if (Math.ceil(newX) >= this.origin.x + this.amplitude) {
				this.rightFlipPoint = this.wave1[i].cy;
			}
			else if (Math.floor(newX) <= this.origin.x - this.amplitude) {
				this.leftFlipPoint = this.wave1[i].cy;
			}
		}
	}

	// Helper for drawing a circle at a position
	drawCircle(circle, front) {
		this.ctx.beginPath();
		this.ctx.arc(
			circle.cx, // center x
			circle.cy, // center y
			this.width / 2, // radius
			0, // start angle
			Math.PI * 2 // end angle
		);
		this.ctx.closePath();
		this.ctx.fillStyle = (front) ? this.frontColor : this.backColor;
		this.ctx.fill();
	}

	// Helper for determining if wave1 circles should overlap wave2 at a given y position
	shouldOverlap(circle) {
		return (
			(
				circle.cy >= this.rightFlipPoint
				&& circle.cy < this.leftFlipPoint
			) || (
				this.rightFlipPoint > this.leftFlipPoint
				&& circle.cy < this.leftFlipPoint
			) || (
				this.rightFlipPoint > this.leftFlipPoint
				&& circle.cy > this.rightFlipPoint
			)
		);
	}

	// Runs every frame, after update
	// Use positions to draw in context
	helixDraw() {
		// Clear canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw wave1 circles which do not overlap
		this.wave1.forEach((circle) => {
			if (!this.shouldOverlap(circle)) {
				this.drawCircle(circle);
			}
		});

		// Draw wave2
		this.wave2.forEach((circle) => {
			this.drawCircle(circle, true);
		});

		// Draw wave1 circles which do overlap
		this.wave1.forEach((circle) => {
			if (this.shouldOverlap(circle)) {
				this.drawCircle(circle);
			}
		});

		// Increment phase over time
		// Negative = waves flowing down
		this.phase -= this.phaseShift;
	}

	//
	// Render markup
	//

	renderAnimation() {
		const { type } = this.props;
		let animation = '';

		if (type === 'helix') {
			animation = (
				<canvas
					className="animation__canvas"
					ref={(node) => {
						this.canvas = node;
					}}
				/>
			);
		}
		else if (type === 'head') {
			animation = (
				<svg
					className="animation__svg"
					viewBox="0 0 143 65"
					ref={(node) => {
						this.svg = node;
					}}
				>
					<polygon
						className={classNames(
							'animation__triangle',
							'animation__triangle--left'
						)}
						points="35,2 91,25 35,48"
					/>
					<circle
						className={classNames(
							'animation__head-circle',
							'animation__head-circle--left'
						)}
						style={{
							transition: 'none'
						}}
						r="25"
						cx="25"
						cy="25"
					/>
					<path
						className="animation__head"
						fillRule="evenodd"
						d="M6.687 25.398C6.687 13.472 16.347 0 32.878 0c.198 0 .394.01.591.016C47.26.336 59 11.843 59 26c0 12.387-6.092 18.158-6.092 18.158L52.684 65H13.909c-3.573 0-6.467-2.958-6.467-6.61V44.69H0l6.687-19.293z"
					/>
					<polygon
						className={classNames(
							'animation__triangle',
							'animation__triangle--right'
						)}
						points="105.5,18.5 90.5,25 105.5,31.5"
					/>
					<circle
						className={classNames(
							'animation__head-circle',
							'animation__head-circle--right'
						)}
						r="7"
						cx="108"
						cy="25"
					/>
				</svg>
			);
		}

		return animation;
	}

	render() {
		const { type, templateClass } = this.props;

		return (
			<div
				className={classNames(
					'animation',
					`animation--${type}`,
					templateClass
				)}
			>
				{ this.renderAnimation() }
			</div>
		);
	}
}

Animation.propTypes = {
	type: PropTypes.string.isRequired,
	templateClass: PropTypes.string,
	color: PropTypes.string.isRequired
};

Animation.defaultProps = {
	templateClass: ''
};

export default Animation;
