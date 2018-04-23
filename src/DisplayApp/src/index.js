//
// File that imports all styles and bootstraps our app
//
import React from 'react';
import ReactDOM from 'react-dom';

// import our global sass file
import './styles/index.scss';

// import application React component
import App from './App';

// Render onto index.html
ReactDOM.render(<App />, document.querySelector('#root'));
