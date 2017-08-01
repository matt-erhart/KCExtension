import React from "react";
import ReactDOM from "react-dom";
import * as _ from "lodash";
import * as firebase from "firebase";

import { popWindow } from "../chromeBGProcess/contextMenus";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { blue500, green400 } from "material-ui/styles/colors";
import Divider from "material-ui/Divider";
import { dbRef } from "./App";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";

const Input = ({ value, handleChange, stateVarName }) => {
  const color = stateVarName === "feedback" ? blue500 : green400;
  return (
    <TextField
      id="textarea"
      value={value}
      onChange={handleChange}
      floatingLabelText={stateVarName !== 'feedback' ? stateVarName:''}
      floatingLabelFixed={true}
      floatingLabelStyle={{ color: color }}
      floatingLabelFocusStyle={{ color: color }}
      underlineFocusStyle={{ borderColor: color }}
      multiLine={true}
      fullWidth={true}
    />
  );
};

class App extends React.Component {
  state = {
    user: "",
    project: "",
    purpose: "",
    feedback: "",
    feedbackSent: false,
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
    const { feedback, feedbackSent, ...inputs } = this.state;
    return (
      <div>
        <RaisedButton
          backgroundColor={green400}
          onClick={e => {
            popWindow("open", "");
          }}
          fullWidth={true}
        >
          Create Snippet
        </RaisedButton>

        <div>
          {_.map(inputs, (val, key) => {
            return (
              <Input
                key={key}
                value={val}
                handleChange={e => this.handleChange(e, key)}
                stateVarName={key}
              />
            );
          })}
        </div>
        <Card>
          <CardHeader title="Feedback" actAsExpander={true}
      showExpandableButton={true}/>
      <CardText expandable={true}>
          <Input
            key={"feedback"}
            value={feedback}
            handleChange={e => this.handleChange(e, "feedback")}
            stateVarName={"feedback"}
          />
          <RaisedButton
            backgroundColor={blue500}
            onClick={e => {
              if (this.state.feedback)
                dbRef.child("feedback").push({feedback: this.state.feedback, user: this.state.user || '', created: Date.now().toString()});
              this.setState({ feedback: "", feedbackSent: true });
            }}
            fullWidth={true}
          >
            Send Us Feedback
          </RaisedButton>
          {this.state.feedbackSent && <div>Feedback sent</div>}
          </CardText>
        </Card>
      </div>
    );
  }
}

chrome.storage.local.get("state", obj => {
  ReactDOM.render(
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>,
    document.querySelector("#root")
  );
});