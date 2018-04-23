import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Index extends Component {
	renderItem(item, i) {
		return (
			<li
				className="index__item"
				key={i}
			>
				<h4
					className="index__link"
					data-card-index={i}
				>
					{ item.type }
				</h4>
			</li>
		);
	}

	render() {
		return (
			<main className="index">
				<h2 className="index__title">
					Card Template Index
				</h2>
				<ul className="index__list">
					{ this.props.cards.map(this.renderItem) }
				</ul>
			</main>
		);
	}
}

Index.propTypes = {
	cards: PropTypes.array.isRequired
};

export default Index;
