"use strict";var tl=new TimelineMax({paused:!0}),moveTime=1;window.onload=function(){tl.restart(),document.getElementById("banner").style.visibility="visible"},tl.from("#push1",moveTime,{autoAlpha:0}).to("#push1",moveTime,{autoAlpha:0},"+=2.0").from(["#push2"],moveTime,{autoAlpha:0}).to("#push2",moveTime,{autoAlpha:0},"+=2.0").from(["#push3"],moveTime,{autoAlpha:0}).to("#push3",moveTime,{autoAlpha:0},"+=2.0").from(["#cta","#arrow"],moveTime,{autoAlpha:0}).to("#arrow",.3*moveTime,{force3D:!0,x:5,repeat:3,yoyo:!0},"+=2.0").to("#arrow",.3*moveTime,{force3D:!0,x:5,repeat:3,yoyo:!0},"+=0.3");