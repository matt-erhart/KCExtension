import React, { Component, PropTypes } from "react";
import Rx from "rxjs";
import * as firebase from "firebase";
import * as _ from "lodash";
var config = {
  apiKey: "AIzaSyDOBWE5a-0bO8k_hBbfJjXlr2dfRAMfkK4",
  authDomain: "knowledgecollector-20674.firebaseapp.com",
  databaseURL: "https://knowledgecollector-20674.firebaseio.com",
  projectId: "knowledgecollector-20674",
  storageBucket: "knowledgecollector-20674.appspot.com",
  messagingSenderId: "441463277516"
};

var fire = firebase.initializeApp(config);
var storageRef = firebase.storage().ref();
export var dbRef = firebase.database().ref();
import uid from "uid-safe";
import moment from "moment";

import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { blue500, green400 } from "material-ui/styles/colors";
import Divider from "material-ui/Divider";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";

const resizeCenterAspect = (img, canvas) => {
  var hRatio = canvas.width / img.width;
  var vRatio = canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);
  var centerShift_x = (canvas.width - img.width * ratio) / 2;
  var centerShift_y = (canvas.height - img.height * ratio) / 2;
  return { ratio, centerShift_x, centerShift_y };
};

class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasHeight: 1,
      canvasWidth: 1,
      dragSelect: { x: null, y: null, width: null, height: null },
      crop: false,
      display: "absolute"
    };
  }
  updateCanvas = () => {
    const pixRatio = window.devicePixelRatio || 1;
    const ctx = this.refs.canvas.getContext("2d");
    if (this.props.img !== undefined) {
      var img = new Image();
      img.src = this.props.img;
      
      img.onload = () => {
        const imgH = Math.round(img.height / pixRatio);
      const imgW = Math.round(img.width / pixRatio);
        if (this.state.canvasHeight === 1)
          this.setState({ canvasHeight: imgH, canvasWidth: imgW });
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (this.state.crop && this.state.dragSelect.x !== null) {
          const { x, y, width, height } = this.state.dragSelect;
          var hRatio = ctx.canvas.width / imgW;
          var vRatio = ctx.canvas.height / imgH;
          var ratio = Math.min(hRatio, vRatio);
          ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        }
        if (!this.state.crop) {
          ctx.drawImage(
            img,
            0,
            0,
            imgW,
            imgH,
            0,
            0,
            imgW,
            imgH
          );
        }
      };
    }
  };

  componentDidMount() {
    let body = document.getElementsByTagName("body")[0];

    body.style.cursor = "crosshair";
    this.updateCanvas();

    const mouseDown$ = Rx.Observable.fromEvent(document, "mousedown");
    const mouseUp$ = Rx.Observable.fromEvent(document, "mouseup");
    const mouseMove$ = Rx.Observable.fromEvent(document, "mousemove");

    const dragSelect$ = mouseDown$.take(1).mergeMap(downData => {
      this.setState({
        dragSelect: { x: null, y: null, width: null, height: null }
      });
      return mouseMove$
        .takeUntil(mouseUp$)
        .do(moveData => {
          const { offsetX, offsetY, clientX, clientY } = downData;
          const w = moveData.clientX - clientX; //dragging right positive
          const h = moveData.clientY - clientY; //dragging down positive
          const x = w < 0 ? clientX + w : clientX;
          const y = h < 0 ? clientY + h : clientY;
          const width = Math.abs(w);
          const height = Math.abs(h);
          const dragSelect = { x, y, width, height };
          body.style.userSelect = "none";
          this.setState({ dragSelect });
        })
        .finally(moveData => {
          if (
            this.state.dragSelect.width > 10 &&
            this.state.dragSelect.height > 10
          ) {
            console.log("set canvas size", this.state.dragSelect);
            this.setState({
              canvasHeight: this.state.dragSelect.height,
              canvasWidth: this.state.dragSelect.width
            });
            this.setState({ crop: true });
          }
          body.style.userSelect = "auto";
          body.style.cursor = "auto";
        });
    });
    Rx.Observable
      .concat(dragSelect$)
      .finally(x => {
        this.setState({ display: "none" });
      })
      .subscribe();
  }
  componentDidUpdate() {
    this.updateCanvas();
  }

  render() {
    const { x, y, width, height } = this.state.dragSelect;
    return (
      <div>
        <canvas
          ref="canvas"
          width={this.state.canvasWidth || 1}
          height={this.state.canvasHeight || 1}
          style={{ left: 0, top: 0 }}
        />
        <svg
          style={{
            display: this.state.display,
            position: "absolute",
            left: 0,
            top: 0,
            z: 1
          }}
          x={0}
          y={0}
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
        >
          <rect
            stroke={"black"}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={"none"}
          />
        </svg>
      </div>
    );
  }
}

const Input = ({ label, value, handleChange }) => {
  return (
    <TextField
      id="textarea"
      value={value}
      onChange={handleChange}
      floatingLabelText={label}
      floatingLabelFixed={true}
      floatingLabelStyle={{ color: green400 }}
      floatingLabelFocusStyle={{ color: green400 }}
      underlineFocusStyle={{ borderColor: green400 }}
      multiLine={true}
      fullWidth={true}
    />
  );
};

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "...",
      title: "...",
      snippet: "...",
      comment: "",
      purpose: "",
      user: "",
      project: "",
      img: null,
      uploading: false
    };
  }

  componentWillMount() {
    _.map(["user", "purpose", "project"], key => {
      chrome.storage.local.get(key, storedVar => {
        if (storedVar) this.setState({ [key]: storedVar[key] });
      });
    });
  }

  componentDidMount() {
    this.setState({ snippet: localStorage.selectedText || "" });
    delete localStorage.selectedText;
    if (localStorage.parentWindowId) {
      chrome.tabs.query(
        {
          windowId: Math.round(+localStorage.parentWindowId),
          active: true,
          highlighted: true
        },
        tabs => {
          console.log("windowID", tabs[0].windowId);
          this.setState({ title: tabs[0].title, url: tabs[0].url });
          chrome.tabs.captureVisibleTab(
            tabs[0].windowId,
            { format: "png" },
            data => {
              //
              this.setState({ img: data });
              delete localStorage.parentWindowId;
            }
          );
        }
      );
    }
  }

  handleSubmit(e) {
    const id = uid.sync(18);
    const storagePath = "/images/" + id + ".png";
    const ref = storageRef.child(storagePath);
    const message = this.canvasComp.refs.canvas.toDataURL("image/png");
    this.setState({ uploading: true });
    ref.putString(message, "data_url").then(snapshot => {
      this.setState({ uploading: false });
      window.close();
    });

    firebase.database().ref("/snippets").push({
      snippet: this.state.snippet || "",
      imgPath: storagePath || "",
      title: this.state.title || "",
      url: this.state.url || "",
      comment: this.state.comment || "",
      created: moment().format("MMMM Do YYYY, h:mm:ss a") || "",
      purpose: this.state.purpose || "",
      project: this.state.project || "",
      user: this.state.user || ""
    });
  }

  handleChange = (e, key) => {
    console.log(e.nativeEvent.srcElement.value, key);
    this.setState({ [key]: e.nativeEvent.srcElement.value });
  };

  render() {
    const { store } = this.props;
    return (
      <div>
        <CanvasComponent
          ref={component => (this.canvasComp = component)}
          img={this.state.img}
        />
        <div style={{ width: "50vw" }}>
          {_.map(
            [
              "user",
              "project",
              "purpose",
              "title",
              "url",
              "comment",
              "snippet"
            ],
            key => {
              return (
                <Input
                  key={key}
                  label={key}
                  value={this.state[key] || ""}
                  handleChange={e => this.handleChange(e, key)}
                />
              );
            }
          )}
        </div>
        <RaisedButton
          backgroundColor={green400}
          onClick={e => this.handleSubmit(e)}
        >
          Submit
        </RaisedButton>{" "}
        {this.state.uploading &&
          <span>Uploading image. Will auto close when finished.</span>}
      </div>
    );
  }
}
