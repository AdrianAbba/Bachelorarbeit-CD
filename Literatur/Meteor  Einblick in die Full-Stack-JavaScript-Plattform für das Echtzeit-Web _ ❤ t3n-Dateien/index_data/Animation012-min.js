function Animation(t){function a(){return ya}function i(t){$=t}function n(t){$t.push(t)}function e(){return _}function o(){oa=!1,Z=K,Zt=0,r()}function r(){$t[Zt]?s():(oa=!0,Z=z)}function s(){Z=V,Na=$t[Zt].delay,ba=Na*$,isNaN(ba)&&d()}function d(){Z=K,console.log("start new animation >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+Zt),h($t[Zt])}function h(t){j=document.getElementById(_).getContext("2d"),aa=!1,_t=!1,ta=!1,lt=0,tt=t.img,at=t.startX,it=t.startY,nt=t.endX,et=t.endY,ot=t.startAlpha,rt=t.endAlpha,ht=t.time,Mt=t.maskStartX,At=t.maskEndX,wt=t.maskStartY,xt=t.maskEndY,Wt=t.maskStartWidth,Ct=t.maskEndWidth,Bt=t.maskStartHeight,Ht=t.maskEndHeight,jt=t.boxStartWidth,qt=t.boxStartHeight,zt=t.boxEndWidth,Jt=t.boxEndHeight,gt=t.startScaleX,ft=t.startScaleY,pt=t.endScaleX,yt=t.endScaleY,sa=t.easingType,ra=t.blackBackground,Ot=t.gradientStartWidth,Dt=t.gradientEndWidth,Ft=t.gradientStartHeight,Lt=t.gradientEndHeight,animationFormat=t.animationFormat,L=t.borderLineWidth,Q=t.borderColor,R=t.lineWidth,G=t.htmlElement,U=t.display,ya=ca,(t.animationType==ma||t.animationType==ga||t.animationType==fa||t.animationType==pa)&&(ya=t.animationType),st=at,dt=it,mt=ot,St=gt,vt=ft,Xt=Wt,Yt=Bt,Gt=jt,Ut=qt,Tt=Mt,Pt=wt,sa=l(sa),m(),Z=J}function l(t){return t==da||t==ha||t==la||t==ua?t:la}function u(){var t=Dt-Ot,a=Lt-Ft;X=t/F,Y=a/F,isNaN(X)&&(X=0,isNaN(Ot)?(Qt=0,Ot=0,Dt=0):(Qt=Ot,Dt=Ot)),isNaN(Y)&&(Y=0,isNaN(Ft)?(Rt=0,Ft=0,Lt=0):(Rt=Ft,Lt=Ft))}function N(){var t=zt-jt,a=Jt-qt;O=t/F,D=a/F,na=isNaN(O)&&isNaN(D)?!1:!0,isNaN(O)&&(O=0,isNaN(jt)?(Gt=0,jt=0,zt=0):(Gt=jt,zt=jt)),isNaN(D)&&(D=0,isNaN(qt)?(Ut=0,qt=0,Jt=0):(Ut=qt,Jt=qt))}function c(){if(isNaN(Mt)&&isNaN(At)&&isNaN(wt)&&isNaN(xt)&&isNaN(Wt)&&isNaN(Ct)&&isNaN(Bt)&&isNaN(Ht))ia=!1,ea=!1;else{ea=!0,ia=!0;var t=At-Mt,a=xt-wt;Kt=t/F,Vt=a/F,isNaN(t)&&(Kt=0,isNaN(Mt)?(Tt=0,At=0,Mt=0):(Tt=Mt,At=Mt)),isNaN(a)&&(Vt=0,isNaN(wt)?(Pt=0,wt=0,xt=0):(Pt=wt,xt=wt));var i=Ct-Wt,n=Ht-Bt;kt=i/F,It=n/F,isNaN(kt)&&(kt=0,isNaN(Wt)?(Xt=tt.width,Wt=tt.width,Ct=tt.width):(Xt=Wt,Ct=Wt)),isNaN(It)&&(It=0,isNaN(Bt)?(Yt=tt.height,Bt=tt.height,Ht=tt.height):(Yt=Bt,Ht=Bt))}}function m(){isNaN(Na)&&(Na=0);var t=nt-at,a=et-it;F=isNaN(ht)||0==ht?1:ht*$,ut=t/F,Nt=a/F,c(),u(),N(),isNaN(ut)?(ut=0,isNaN(at)?(at=0,st=0,nt=0):(st=at,nt=at)):aa=!0,isNaN(Nt)?(Nt=0,isNaN(it)?(it=0,dt=0,et=0):(dt=it,et=it)):aa=!0,ct=(rt-ot)/F,isNaN(ct)?isNaN(ot)?(ct=0,mt=1,ot=1,rt=1):(ct=0,mt=ot,rt=ot):_t=!0,bt=(pt-gt)/F,Et=(yt-ft)/F,isNaN(bt)?(bt=0,isNaN(gt)?(gt=1,St=1,pt=1):(St=gt,pt=gt)):ta=!0,isNaN(Et)?(Et=0,isNaN(ft)?(ft=1,vt=1,yt=1):(vt=ft,yt=ft)):ta=!0}function g(){if(Z==K)h($t[Zt]);else if(Z==z||Z==J||Z==V){if(j.imageSmoothingEnabled=!0,1==ra&&b(),oa||(sa==da?w(j):sa==ha?k(j):sa==ua?I(j):x(j)),j.save(),mt=Math.round(100*mt)/100,j.globalAlpha=mt,st=Math.round(st),dt=Math.round(dt),Rt=Math.round(Rt),Qt=Math.round(Qt),Gt=Math.round(Gt),Ut=Math.round(Ut),Tt=Math.round(Tt),Pt=Math.round(Pt),Xt=Math.round(Xt),Yt=Math.round(Yt),ya==ca){ea&&A(j);var t=Math.round(tt.width*St),a=Math.round(tt.height*vt);j.beginPath(),j.drawImage(tt,st,dt,t,a),j.closePath()}else ya==ma?M(j,st,dt,Qt,Rt):ya==ga?y(j,st,dt,Gt,Ut):ya==fa?p(j,st,dt,Gt,Ut,R,Q):ya==pa&&f(G,st,dt,Gt,Ut,mt);Z!=V&&this.verifyEndAnimation(),j.restore(),S()}Sa=!0}function f(t,a,i,n,e,o){t.style.top=i+"px",t.style.left=a+"px",t.style.width=n+"px",t.style.height=e+"px",t.style.display=U,t.style.opacity=o}function p(t,a,i,n,e,o,r){t.lineWidth=o,t.beginPath(),t.moveTo(a,i),t.lineTo(n,e),t.strokeStyle=r,t.stroke()}function y(t,a,i,n,e){t.beginPath(),t.rect(a,i,n,e),t.fillStyle="white",t.fill()}function S(){Na>0&&(ba--,0>=ba&&(Na=0,d()))}function v(){return Sa}function b(){if(1==tt.fakeBleedScreenExecuted&&(va=!0),!va){va=!0;var t=document.getElementById(_);tt.fakeBleedScreenExecuted=!0,j.drawImage(tt,0,0,tt.width,tt.height),q=j.getImageData(0,0,tt.width+1,tt.height+1),E(j,q,q.data,0,0,1),tt.src=t.toDataURL(),j.clearRect(0,0,t.width,t.height)}}function E(t,a,i,n,e,o){for(var r=0;r<i.length;r+=4){var s=(i[r]+i[r+1]+i[r+2])/3;i[r]=2*i[r],i[r+1]=2*i[r+1],i[r+2]=2*i[r+2],i[r+3]=2*s*o}t.imageSmoothingEnabled=!0,t.putImageData(a,n,e)}function M(t,a,i,n,e){var o=(document.getElementById(_),t.createLinearGradient(a,0,n+a,0));o.addColorStop(0,"rgba(80,190,190,1)"),o.addColorStop(.5,"rgba(0,153,153,1)"),o.addColorStop(1,"rgba(0,153,203,1)"),t.beginPath(),t.rect(a,i,n,e),t.fillStyle=o,t.fill(),t.restore()}function A(t){t.beginPath(),t.rect(Tt,Pt,Xt,Yt),t.closePath(),t.clip()}function w(t){st+=ut,dt+=Nt,mt+=ct,St+=bt,vt+=Et,Xt+=kt,Yt+=It,Pt+=Vt,Tt+=Kt,Qt+=X,Rt+=Y,Gt+=O,Ut+=D}function x(t){var a=T(),i=B(a);P(i)}function k(t){var a=T(),i=C(a);P(i)}function I(t){var a=T(),i=W(a);P(i)}function T(){lt++;var t=100*lt/F;return t/=100}function P(t){F>=lt&&(st=at+(nt-at)*t,dt=it+(et-it)*t,mt=ot+(rt-ot)*t,St=gt+(pt-gt)*t,vt=ft+(yt-ft)*t,Xt=Wt+(Ct-Wt)*t,Yt=Bt+(Ht-Bt)*t,Pt=wt+(xt-wt)*t,Tt=Mt+(At-Mt)*t,Qt=Ot+(Dt-Ot)*t,Rt=Ft+(Lt-Ft)*t,Gt=jt+(zt-jt)*t,Ut=qt+(Jt-qt)*t)}function W(t){return(t/=.5)<1?.5*Math.pow(t,2):-.5*((t-=2)*t-2)}function C(t){return Math.pow(t,2)}function B(t){return-(Math.pow(t-1,2)-1)}function H(){oa||(0>ut?nt>=st&&(st=nt,ut=0):ut>0&&st>=nt&&(st=nt,ut=0),0>Nt?et>=dt&&(dt=et,Nt=0):Nt>0&&dt>=et&&(dt=et,Nt=0),0>ct?rt>=mt&&(ct=0,mt=rt):ct>0&&mt>=rt&&(ct=0,mt=rt),0>bt?pt>=St&&(St=pt,bt=0):bt>0&&St>=pt&&(St=pt,bt=0),0>Et?yt>=vt&&(vt=yt,Et=0):Et>0&&vt>=yt&&(vt=yt,Et=0),0>It?Ht>=Yt&&(Yt=Ht,It=0):It>0&&Yt>=Ht&&(Yt=Ht,It=0),0>kt?Ct>=Xt&&(Xt=Ct,kt=0):kt>0&&Xt>=Ct&&(Xt=Ct,kt=0),0>Kt?At>=Tt&&(Tt=At,Kt=0):Kt>0&&Tt>=At&&(Tt=At,Kt=0),0>Vt?xt>=Pt&&(Pt=xt,Vt=0):Vt>0&&Pt>=xt&&(Pt=xt,Vt=0),0>D?Jt>=Ut&&(Ut=Jt,D=0):D>0&&Ut>=Jt&&(Ut=Jt,D=0),0>O?zt>=Gt&&(Gt=zt,O=0):O>0&&Gt>=zt&&(Gt=zt,O=0),0==Vt&&0==Kt&&0==kt&&0==It&&(ia=!1),0==O&&0==D&&(na=!1),0==ut&&0==Nt&&(aa=!1),0==ct&&(_t=!1),0==bt&&0==Et&&(ta=!1),aa||_t||ta||ia||na||(console.log("END ANIMATION >> "),Zt++,r()))}var X,Y,O,D,F,L,Q,R,G,U,j,q,z="stateComplete",J="stateIncomplete",K="stateNotStarted",V="stateAnimationTimeOut",Z=K,$=0,_=t,tt=null,at=null,it=null,nt=null,et=null,ot=null,rt=null,st=0,dt=0,ht=null,lt=0,ht=0,ut=0,Nt=0,ct=0,mt=0,gt=1,ft=1,pt=1,yt=1,St=0,vt=0,bt=0,Et=0,Mt=0,At=0,wt=0,xt=0,kt=0,It=0,Tt=0,Pt=0,Wt=0,Ct=0,Bt=0,Ht=0,Xt=0,Yt=0,Ot=0,Dt=0,Ft=0,Lt=0,Qt=0,Rt=0,Gt=0,Ut=0,jt=0,qt=0,zt=0,Jt=0,Kt=0,Vt=0,Zt=0,$t=[],_t=!1,ta=!1,aa=!1,ia=!1,na=!1,ea=!1,oa=!1,ra=!1,sa="linear",da="linear",ha="easeInQuad",la="easeOutQuad",ua="easeInOutQuad",Na=0,ca="image",ma="gradient",ga="box",fa="border",pa="style",ya=ca,Sa=!1,va=!1,ba=0;this.startAnimation=h,this.verifyMoves=m,this.runAnimation=g,this.verifyEndAnimation=H,this.addParameters=n,this.nextAnimation=r,this.executeEasingOutQuadAnimation=x,this.executeLienarAnimation=w,this.getCanvasId=e,this.getReady=v,this.setFPS=i,this.replayAllAnimationsFromStart=o,this.getAnimationType=a}
