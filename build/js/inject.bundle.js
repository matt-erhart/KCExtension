!function(e){function n(t){if(o[t])return o[t].exports;var r=o[t]={exports:{},id:t,loaded:!1};return e[t].call(r.exports,r,r.exports,n),r.loaded=!0,r.exports}var o={};return n.m=e,n.c=o,n.p="",n(0)}({0:function(e,n,o){o(80),e.exports=o(512)},80:function(e,n,o){"use strict";o.p=chrome.extension.getURL("/js/")},512:function(e,n){"use strict";window.addEventListener("load",function(){console.log("window loaded and injected");var e=document.createElement("div");e.style.position="fixed",chrome.storage.local.get("currentGoal",function(n){n?e.innerHTML=n.currentGoal:e.innerHTML="",e.style.bottom=0,e.style.right=0,document.body.appendChild(e),chrome.storage.onChanged.addListener(function(n,o){e.innerHTML=n.currentGoal.newValue,console.log("got a change")})})})}});