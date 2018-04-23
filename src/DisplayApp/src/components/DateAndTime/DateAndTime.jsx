import React, { Component } from 'react';

class DateAndTime extends Component {
	componentWillMount() {
		// Start keeping track of time
		this.setDateAndTime();
		setInterval(this.setDateAndTime.bind(this), 5000);
	}

	setDateAndTime() {
		// Date object
		const now = new Date();

		// Date
		const date = now.getDate();
		const day = now.toLocaleString('en-us', { weekday: 'long' });
		const month = now.toLocaleString('en-us', { month: 'short' });

		// Time
		let hours = now.getHours();
		let minutes = now.getMinutes();
		minutes = minutes < 10 ? `0${minutes}` : minutes; // leading 0
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12; // 12 hour time
		hours = hours !== 0 ? hours : 12; // the hour '0' should be '12'

		this.setState({
			date: `${day}, ${month} ${date}`,
			time: `${hours}:${minutes} ${ampm}`
		});
	}

	render() {
		return (
			<header className="date-and-time">
				<p className="date-and-time__item">
					{ this.state.date }
				</p>
				<p className="date-and-time__item">
					{ this.state.time }
				</p>
			</header>
		);
	}
}

export default DateAndTime;
