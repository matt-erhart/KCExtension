import React, { Component, PropTypes } from 'react';
import {Cropper} from 'react-image-cropper'


class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  updateCanvas = () => {
      console.log('update canvas')
        const ctx = this.refs.canvas.getContext('2d');
        if (this.props.img !== undefined) {
                var img = new Image;
                img.src = this.props.img;
                img.onload = function () {
                  var height = img.height;
                  var width = img.width;
                  console.log(img.width, img.height)
                  var canvas = ctx.canvas ;
                  var hRatio = canvas.width / img.width;
                  var vRatio = canvas.height / img.height;
                  var ratio = Math.min(hRatio, vRatio);
                  var centerShift_x = (canvas.width - img.width * ratio) / 2;
                  var centerShift_y = (canvas.height - img.height * ratio) / 2;
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, 0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);  
                //  context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                }
        }
    }



    componentDidMount() {
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    

    render() {
        return (
            <canvas ref="canvas" width={2000} height={1000}/>
        );
    }
}

export default class Root extends Component {

  // static propTypes = {
  //   store: PropTypes.object.isRequired
  // };
  constructor(props) {
    super(props);
    this.state = {
      url: '...',
      title: '...',
      snippet: '',
      img: null,
      crop: {
          x: 20,
          y: 5,
          aspect: 1,
          width: 30,
          height: 50,
        }
    };
  }

  componentDidMount() {

    // console.log('window', window)
    // console.log('mounted', this.state)
    
    // chrome.runtime.getBackgroundPage((bg) => {
    //     console.log(bg)
    //     this.setState({snippet: bg.text});
    // });
    this.setState({snippet: localStorage.selectedText || ''})
    delete localStorage.selectedText

    chrome.tabs.query({windowId: +localStorage.parentWindowId, active: true, highlighted: true}, (tabs) => {
    this.setState({title: tabs[0].title, url: tabs[0].url})
    chrome.tabs.captureVisibleTab(tabs[0].windowId, {format: "png"}, (data) => { //
        console.log('img', data)
      this.setState({img: data})
      delete localStorage.parentWindowId
   })

  });  
}
  render() {
    const { store } = this.props;
    return (
      <div>
        <CanvasComponent img={this.state.img}></CanvasComponent>
        <input value={this.state.title} onChange={e=>{this.setState({title: e.value})}}/> <br/>
        <input value={this.state.url} onChange={e=>{this.setState({url: e.value})}}/>
        <textarea name="" id="" cols="60" rows="10" placeholder='remark'></textarea> <br/>
        <textarea name="" id="" cols="60" rows="10" placeholder='snippet' value={this.state.snippet} onChange={e=>{this.setState({snippet: e.value})}}></textarea> <br/>
        <button>Submit</button>
      </div>

    )
  }
}
{/*<Provider store={store}>
  <App />
</Provider>*/}