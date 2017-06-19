import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  state = {
    currentGoal: ""
  };
  componentWillMount() {
    chrome.storage.local.get("currentGoal", goal => {
      if (goal) this.setState({ currentGoal: goal.currentGoal });
    });
  }
  render() {
    return (
      <div>
        <label htmlFor="textarea">What's your main goal?</label>
        <textarea
          id="textarea"
          style={{ width: "450px", height: "50px" }}
          value={this.state.currentGoal}
          onChange={e => {
            this.setState({ currentGoal: e.nativeEvent.srcElement.value });
            chrome.storage.local.set(
              { currentGoal: e.nativeEvent.srcElement.value },
              function() {
                console.log("saved");
              }
            );
          }}
        />
      </div>
    );
  }
}

chrome.storage.local.get("state", obj => {
  ReactDOM.render(<App />, document.querySelector("#root"));
});

// const { state } = obj;
// const initialState = JSON.parse(state || '{}');
// const createStore = require('../../app/store/configureStore');
// <Root store={createStore(initialState)} />
