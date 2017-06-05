import React, { Component, PropTypes } from 'react';
import Rx from 'rxjs';
import * as firebase from 'firebase';
var config = {
    apiKey: "AIzaSyDOBWE5a-0bO8k_hBbfJjXlr2dfRAMfkK4",
    authDomain: "knowledgecollector-20674.firebaseapp.com",
    databaseURL: "https://knowledgecollector-20674.firebaseio.com",
    projectId: "knowledgecollector-20674",
    storageBucket: "knowledgecollector-20674.appspot.com",
    messagingSenderId: "441463277516"
  };
var fire = firebase.initializeApp(config);
console.log(fire)

const resizeCenterAspect = (img, canvas ) => {
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    return {ratio, centerShift_x, centerShift_y}
}


class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {canvasHeight: 1, canvasWidth: 1, 
        dragSelect: {x: null, y: null, width: null, height: null},
        crop: false,
        display: 'absolute'
    
    }
  }
  updateCanvas = () => {    
        const ctx = this.refs.canvas.getContext('2d');
        if (this.props.img !== undefined) {
                var img = new Image;
                img.src = this.props.img;
                img.onload =  () => {
                  if (this.state.canvasHeight === 1) this.setState({canvasHeight: img.height, canvasWidth: img.width})
                //   const {centerShift_x, centerShift_y, ratio} = resizeCenterAspect(img, canvas);
                  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                  if (this.state.crop && this.state.dragSelect.x !== null){
                    const {x,y,width,height} = this.state.dragSelect;
                    var hRatio = ctx.canvas.width / img.width;
                    var vRatio = ctx.canvas.height / img.height;
                    var ratio = Math.min(hRatio, vRatio);
                    ctx.drawImage(img, x,y, width, height, 0,0,width,height);
                    // ctx.drawImage(img, 0, 0, img.width, img.height,
                    // 0, 0, img.width, img.height);  
                  }
                  if (!this.state.crop) {
                    ctx.drawImage(img, 0, 0, img.width, img.height,
                    0, 0, img.width, img.height);  
                    // var toUpload = canvas1.toDataURL("image/png");
                  }
                //  context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                }
            }
        }

    componentDidMount() {
    this.updateCanvas();
    let body = document.getElementsByTagName("body")[0];

    // const keyUp$ = Rx.Observable.fromEvent(document, 'keyup').map(key=>key.key).subscribe(x=>console.log(x))
    const mouseDown$ = Rx.Observable.fromEvent(document, 'mousedown')
    const mouseUp$ = Rx.Observable.fromEvent(document,   'mouseup')
    const mouseMove$ = Rx.Observable.fromEvent(document, 'mousemove')

    const dragSelect$ = mouseDown$.take(1).mergeMap(downData => {
        body.style.cursor = 'crosshair'
      this.setState({dragSelect: {x: null, y: null, width: null, height: null}})
      return mouseMove$.takeUntil(mouseUp$)
        .do(moveData => {
            const {offsetX, offsetY, clientX, clientY} = downData;
            const w = (moveData.clientX-clientX); //dragging right positive
            const h = ( moveData.clientY-clientY); //dragging down positive
            const x = w < 0? clientX + w: clientX; 
            const y = h < 0? clientY + h: clientY;
            const width = Math.abs(w);
            const height = Math.abs(h);
            const dragSelect = {x, y, width, height}
            body.style.userSelect = 'none'
            this.setState({dragSelect})
        }).finally(moveData => {
            if (this.state.dragSelect.width>10 && this.state.dragSelect.height>10) {
                console.log('set canvas size', this.state.dragSelect)
                this.setState({canvasHeight: this.state.dragSelect.height, canvasWidth: this.state.dragSelect.width});
                this.setState({crop: true}) 
            } 
            body.style.userSelect='auto'; 
            body.style.cursor = 'auto'
        })
    })
    Rx.Observable.concat(dragSelect$).finally(x=>{this.setState({display: 'none'})}).subscribe()
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    
    render() {
        const {x,y,width,height} = this.state.dragSelect;
        console.log('canvasHeight', this.state.canvasHeight)
        return (
            <div>
                <canvas ref="canvas" width={this.state.canvasWidth || 1} height={this.state.canvasHeight || 1} style={{ left: 0, top: 0}}/>
                <svg style={{ display: this.state.display, position: 'absolute', left: 0, top: 0, z: 1 }} x={0} y={0} width={this.state.canvasWidth} height={this.state.canvasHeight} >
                    <rect stroke={'black'} x={x} y={y} width={width} height={height} fill={'none'}></rect>
                </svg>
            </div>
        );
    }
}

export default class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: '...',
      title: '...',
      snippet: '',
      img: null
    };
  }

  componentDidMount() {

    this.setState({snippet: localStorage.selectedText || ''})
    delete localStorage.selectedText
    if (localStorage.parentWindowId) {
        chrome.tabs.query({windowId: Math.round(+localStorage.parentWindowId), active: true, highlighted: true}, (tabs) => {
            console.log('windowID', tabs[0].windowId)
        this.setState({title: tabs[0].title, url: tabs[0].url})
        chrome.tabs.captureVisibleTab(tabs[0].windowId, {format: "png"}, (data) => { //
        this.setState({img: data})
        delete localStorage.parentWindowId
        })
    });  
}
}

handleSubmit(e) {
    console.log(this.canvasComp.refs.canvas.toDataURL("image/png"))

}


  render() {
    const { store } = this.props;
    return (
      <div>
        <CanvasComponent ref={component => this.canvasComp = component} img={this.state.img}></CanvasComponent>
        <input value={this.state.title} onChange={e=>{this.setState({title: e.value})}}/> <br/>
        <input value={this.state.url} onChange={e=>{this.setState({url: e.value})}}/>
        <textarea name="" id="" cols="60" rows="10" placeholder='remark'></textarea> <br/>
        <textarea name="" id="" cols="60" rows="10" placeholder='snippet' value={this.state.snippet} onChange={e=>{this.setState({snippet: e.value})}}></textarea> <br/>
        <button onClick={e => handleSubmit(e)}>Submit</button>
      </div>

    )
  }
}
{/*<Provider store={store}>
  <App />
</Provider>*/}