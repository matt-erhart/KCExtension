// // import React, { Component } from 'react';
// // import { render } from 'react-dom';
// // import Rx from 'rxjs';

// // class InjectApp extends Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = { dragSelect: {x: null, y: null, width: null, height: null},
// //     display: 'none' }
// //   }

// //   componentDidMount() {
// //     let body = document.getElementsByTagName("body")[0];
// //     // const keyUp$ = Rx.Observable.fromEvent(document, 'keyup').filter(key=>key.altKey).map(key=>key.key);
// //     const altS$ = keyUp$.filter(key => key === 's').do(x=> body.style.cursor = 'crosshair')
// //     const mouseDown$ = Rx.Observable.fromEvent(document, 'mousedown')
// //     const mouseUp$ = Rx.Observable.fromEvent(document,   'mouseup')
// //     const mouseMove$ = Rx.Observable.fromEvent(document, 'mousemove')

// //     const dragSelect$ = mouseDown$.take(1).mergeMap(downData => {
// //       this.setState({dragSelect: {x: null, y: null, width: null, height: null}})
// //       return mouseMove$.takeUntil(mouseUp$)
// //         .do(moveData => {
// //             const {offsetX, offsetY, clientX, clientY} = downData;
// //             const w = (moveData.clientX-clientX); //dragging right positive
// //             const h = ( moveData.clientY-clientY); //dragging down positive
// //             const x = w < 0? clientX + w: clientX;
// //             const y = h < 0? clientY + h: clientY;
// //             const width = Math.abs(w);
// //             const height = Math.abs(h);
// //             const dragSelect = {x, y, width, height}
// //                 body.style.userSelect = 'none'
// //                 this.setState({dragSelect})
// //                 this.setState({display: 'block'})
// //                 console.log(dragSelect)
// //         }).finally(moveData => {
// //           body.style.userSelect='auto';
// //           body.style.cursor = 'auto'
// //           this.setState({display: 'none'});

// //           chrome.runtime.sendMessage({type: 'dragSelect', dragSelect: this.state.dragSelect}, function(response) {
// //           console.log('message response:', response);
// //           });
// //         })
// //     })
// //     Rx.Observable.concat(dragSelect$).take(1).subscribe()
// //   }

// //   render() {
// //     const {x,y,width,height} = this.state.dragSelect;
// //     let element = null;
// //     if (this.state.display === 'block'){
// //        element =  <svg style={{position: 'fixed', left: 0, top:0, z: 1, display: this.state.display }} x={0} y={0} width={window.innerWidth} height={window.innerHeight} >
// //          <rect stroke={'black'} x={x} y={y} width={width} height={height} fill={'none'}></rect>
// //          </svg>
// //     }
// //     return element;
// //   }
// // }

//  window.addEventListener('load', () => {
//   const injectDOM = document.createElement('div');
//   injectDOM.className = 'inject-react-example';
//   injectDOM.style.textAlign = 'center';
//   document.body.appendChild(injectDOM);
//   render(<InjectApp />, injectDOM);
// });

// window.addEventListener("load", () => {
//   console.log("window loaded and injected");
//   const injectDOM = document.createElement("div");
//   injectDOM.style.position = "fixed";

//   chrome.storage.local.get("currentGoal", goal => {
//     if (goal) {
//       injectDOM.innerHTML = goal.currentGoal;
//     } else {
//       injectDOM.innerHTML = "";
//     }
//     injectDOM.style.bottom = 0;
//     injectDOM.style.right = 0;
//     document.body.appendChild(injectDOM);
//     chrome.storage.onChanged.addListener(function(changes, areaName) {
//       injectDOM.innerHTML = changes.currentGoal.newValue;
//       console.log("got a change");
//     });
//   });
// });
