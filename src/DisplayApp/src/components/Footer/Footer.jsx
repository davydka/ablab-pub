import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class Footer extends Component {
	componentDidMount() {
		// Spinner object for use elsewhere
		// We'll add a DOM selection and circumfrence later
		this.spinner = {
			circle: document.querySelector('.footer-spinner__progress'),
			circumference: parseInt(document.querySelector('.footer-spinner__progress').getAttribute('r'), 10) * Math.PI * 2,
			step: 17 // Roughly 60fps, must be whole number
		};

		// Start at 1
		this.currentCard = 1;

		// Start with a delay
		this.initialCycle = true;
	}

	componentWillUpdate() {
		// When first beginning transition, save next card index
		// (Selector will return 2 when transitioning)
		if (document.querySelectorAll('.app > main').length > 1) {
			this.currentCard = this.props.currentCard;
		}
	}

	componentDidUpdate() {
		// Don't restart animation until first slide is gone
		// (Selector will return 2 when transitioning)
		if (document.querySelectorAll('.app > main').length === 1) {
			// Apply delay to first animation to wait for fade in
			const delay = (this.initialCycle) ? 1000 : 0;
			setTimeout(() => {
				// Stop animation
				if (this.spinner.cycle !== undefined) {
					clearInterval(this.spinner.cycle);
				}

				// Restart animaton if cycling on prop change
				if (this.props.interval !== -1) {
					this.startCycle();
				}

				this.initialCycle = false;
			}, delay);
		}
	}

	startCycle() {
		// See if current slide is even or odd
		const indexIsEven = this.props.currentCard % 2 === 0;

		// Restart animation
		this.spinner.t = 0;
		this.spinner.cycle = setInterval(() => {
			this.animate(indexIsEven, this.props.interval);
		}, this.spinner.step);
	}

	animate(indexIsEven, interval) {
		if (interval === -1) {
			this.clearAnimation();
		}
		else {
			// Calculate progress as percent
			const progress = this.spinner.t / interval;

			// Start empty or filled based on current card even/odd
			const startOffset = (indexIsEven) ? 0 : this.spinner.circumference;

			// Apply style and add to delta time
			this.spinner.circle.style.strokeDashoffset = ((progress * this.spinner.circumference) + startOffset) * -1;

			// Time marches ever forward
			this.spinner.t += this.spinner.step;
		}
	}

	clearAnimation() {
		// Hide if interval is stopped
		this.spinner.t = 0;
		this.spinner.circle.style.strokeDashoffset = this.spinner.circumference;
		setTimeout(() => {
			this.initialCycle = true;
		}, 1000);
	}

	renderProgress() {
		const { totalCards, currentCard } = this.props;

		// Spinner SVG
		const spinner = (
			<svg className="footer-spinner">
				<circle
					className="footer-spinner__border"
					r="19"
					cx="20"
					cy="20"
				/>
				<circle
					className="footer-spinner__progress"
					r="7"
					cx="20"
					cy="20"
				/>
			</svg>
		);

		// Text, if able to determine
		let text = '';
		if (currentCard !== undefined
			&& Number.isInteger(currentCard)
			&& totalCards !== undefined
			&& totalCards !== 0) {
			text = (
				<span>
					<span className="footer__card-number">
						{ this.currentCard }
					</span>
					&nbsp;<em className="serif">of</em>&nbsp;
					<span className="footer__card-number">
						{ totalCards }
					</span>
				</span>
			);
		}

		return (
			<section className="footer__column">
				<p className="footer__counter">
					{ spinner }
					{ text }
				</p>
			</section>
		);
	}

	renderCTA() {
		let cta = '';

		if (this.props.url !== '' && this.props.url !== null) {
			cta = (
				<section className="footer__column footer__column--right">
					<p className="small footer__cta">
						{ this.props.label }
						<br />
						<span className="footer__url">
							{ this.props.url }
						</span>
					</p>
				</section>
			);
		}

		return cta;
	}

	render() {
		return (
			<CSSTransitionGroup
				component="footer" // wrapper tag
				className="footer" // wrapper class
				transitionName="footer" // animation class
				transitionAppear
				transitionAppearTimeout={2000}
				transitionEnterTimeout={2000}
				transitionLeaveTimeout={1000}
			>
				{ this.renderProgress() }
				{ this.renderCTA() }
			</CSSTransitionGroup>
		);
	}
}

Footer.propTypes = {
	currentCard: PropTypes.number.isRequired,
	totalCards: PropTypes.number.isRequired,
	interval: PropTypes.number.isRequired,
	label: PropTypes.string,
	url: PropTypes.string
};

Footer.defaultProps = {
	label: '',
	url: ''
};

export default Footer;
