import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

chrome.storage.local.get('state', (obj) => {
  ReactDOM.render(
    <App/>,
    document.querySelector('#root')
  );
});

  // const { state } = obj;
  // const initialState = JSON.parse(state || '{}');
  // const createStore = require('../../app/store/configureStore');
  // <Root store={createStore(initialState)} />