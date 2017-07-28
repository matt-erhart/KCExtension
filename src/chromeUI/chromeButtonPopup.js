import React from "react";
import ReactDOM from "react-dom";
import * as _ from "lodash";
const Input = ({ value, handleChange, stateVarName }) => {
  return (
    <textarea
      id="textarea"
      style={{ width: "450px", height: "50px" }}
      value={value}
      onChange={handleChange}
      placeholder={stateVarName}
    />
  );
};

class App extends React.Component {
  state = {
    user: "",
    project: "",
    purpose: ""
  };

  handleChange = (e, stateVarName) => {
    this.setState({ [stateVarName]: e.nativeEvent.srcElement.value });
    chrome.storage.local.set(
      { [stateVarName]: e.nativeEvent.srcElement.value },
      function() {
        console.log(stateVarName);
      }
    );
  };

  componentWillMount() {
    _.map(this.state, (val, key) => {
      chrome.storage.local.get(key, storedVar => {
        if (storedVar) this.setState({ [key]: storedVar[key] });
      });
    });
  }
  render() {
    return (

      <div>
        
        {_.map(this.state, (val, key) => {
          return <Input key={key} value={val} handleChange={e => this.handleChange(e,key)} stateVarName={key}/>
        })}
        
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
