import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../../components/Header/Header';
import Subheader from '../../components/Subheader/Subheader';
import Paragraph from '../../components/Paragraph/Paragraph';

class List extends Component {
	renderItem(item, i) {
		return (
			<li
				className="list-item"
				key={i}
			>
				<Subheader
					templateClass="list-item__title"
					text={item.title}
				/>
				<Paragraph
					templateClass="list-item__subcopy"
					text={item.subcopy}
				/>
			</li>
		);
	}

	render() {
		const { header, list_items } = this.props;

		return (
			<main className="list">
				<Header
					text={header}
					templateClass="list__header"
				/>
				<ul className="list__wrapper">
					{ list_items.map((item, i) => this.renderItem(item, i)) }
				</ul>
			</main>
		);
	}
}

List.propTypes = {
	header: PropTypes.string.isRequired,
	list_items: PropTypes.array.isRequired
};

export default List;
