import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

chrome.storage.local.get('state', (obj) => {
  ReactDOM.render(
    <MuiThemeProvider><App/></MuiThemeProvider>,
    document.querySelector('#root')
  );
});

  // const { state } = obj;
  // const initialState = JSON.parse(state || '{}');
  // const createStore = require('../../app/store/configureStore');
  // <Root store={createStore(initialState)} />