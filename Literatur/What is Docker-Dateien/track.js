/*!
 * Shim for MutationObserver interface
 * Author: Graeme Yeates (github.com/megawac)
 * Repository: https://github.com/megawac/MutationObserver.js
 * License: WTFPL V2, 2004 (wtfpl.net).
 * Though credit and staring the repo will make me feel pretty, you can modify and redistribute as you please.
 * Attempts to follow spec (http:// www.w3.org/TR/dom/#mutation-observers) as closely as possible for native javascript
 * See https://github.com/WebKit/webkit/blob/master/Source/WebCore/dom/MutationObserver.cpp for current webkit source c++ implementation
 */
window.MutationObserver=window.MutationObserver||function(e){"use strict";function t(e){this._watched=[],this._listener=e}function i(e){!function i(){var r=e.takeRecords();r.length&&e._listener(r,e),e._timeout=setTimeout(i,t._period)}()}function r(t){var i={type:null,target:null,addedNodes:[],removedNodes:[],previousSibling:null,nextSibling:null,attributeName:null,attributeNamespace:null,oldValue:null};for(var r in t)h(i,r)&&t[r]!==e&&(i[r]=t[r]);return i}function n(e,t){var i=u(e,t);return function(n){var o,a=n.length;t.charData&&3===e.nodeType&&e.nodeValue!==i.charData&&n.push(new r({type:"characterData",target:e,oldValue:i.charData})),t.attr&&i.attr&&s(n,e,i.attr,t.afilter),(t.kids||t.descendents)&&(o=l(n,e,i,t)),(o||n.length!==a)&&(i=u(e,t))}}function o(e,t){return t.value}function a(e,t){return"style"!==t.name?t.value:e.style.cssText}function s(e,t,i,n){for(var o,a,s={},l=t.attributes,u=l.length;u--;)o=l[u],a=o.name,(!n||h(n,a))&&(C(t,o)!==i[a]&&e.push(r({type:"attributes",target:t,attributeName:a,oldValue:i[a],attributeNamespace:o.namespaceURI})),s[a]=!0);for(a in i)s[a]||e.push(r({target:t,type:"attributes",attributeName:a,oldValue:i[a]}))}function l(t,i,n,o){function a(e,i,n,a,u){for(var c,d,f,p=e.length-1,g=-~((p-u)/2);f=e.pop();)c=n[f.i],d=a[f.j],o.kids&&g&&Math.abs(f.i-f.j)>=p&&(t.push(r({type:"childList",target:i,addedNodes:[c],removedNodes:[c],nextSibling:c.nextSibling,previousSibling:c.previousSibling})),g--),o.attr&&d.attr&&s(t,c,d.attr,o.afilter),o.charData&&3===c.nodeType&&c.nodeValue!==d.charData&&t.push(r({type:"characterData",target:c,oldValue:d.charData})),o.descendents&&l(c,d)}function l(i,n){for(var f,p,h,m,v,C,y,k=i.childNodes,E=n.kids,P=k.length,b=E?E.length:0,_=0,w=0,x=0;P>w||b>x;)C=k[w],v=E[x],y=v&&v.node,C===y?(o.attr&&v.attr&&s(t,C,v.attr,o.afilter),o.charData&&v.charData!==e&&C.nodeValue!==v.charData&&t.push(r({type:"characterData",target:C,oldValue:v.charData})),p&&a(p,i,k,E,_),o.descendents&&(C.childNodes.length||v.kids&&v.kids.length)&&l(C,v),w++,x++):(u=!0,f||(f={},p=[]),C&&(f[h=d(C)]||(f[h]=!0,-1===(m=c(E,C,x))?o.kids&&(t.push(r({type:"childList",target:i,addedNodes:[C],nextSibling:C.nextSibling,previousSibling:C.previousSibling})),_++):p.push({i:w,j:m})),w++),y&&y!==k[w]&&(f[h=d(y)]||(f[h]=!0,-1===(m=g(k,y,w))?o.kids&&(t.push(r({type:"childList",target:n.node,removedNodes:[y],nextSibling:E[x+1],previousSibling:E[x-1]})),_--):p.push({i:m,j:x})),x++));p&&a(p,i,k,E,_)}var u;return l(i,n),u}function u(e,t){var i=!0;return function r(e){var n={node:e};return!t.charData||3!==e.nodeType&&8!==e.nodeType?(t.attr&&i&&1===e.nodeType&&(n.attr=p(e.attributes,function(i,r){return(!t.afilter||t.afilter[r.name])&&(i[r.name]=C(e,r)),i},{})),i&&(t.kids||t.charData||t.attr&&t.descendents)&&(n.kids=f(e.childNodes,r)),i=t.descendents):n.charData=e.nodeValue,n}(e)}function c(e,t,i){return g(e,t,i,m("node"))}function d(e){try{return e.id||(e[k]=e[k]||y++)}catch(t){try{return e.nodeValue}catch(i){return y++}}}function f(e,t){for(var i=[],r=0;r<e.length;r++)i[r]=t(e[r],r,e);return i}function p(e,t,i){for(var r=0;r<e.length;r++)i=t(i,e[r],r,e);return i}function g(e,t,i,r){for(;i<e.length;i++)if((r?e[i][r]:e[i])===t)return i;return-1}function h(t,i){return t[i]!==e}function m(e){return e}t._period=30,t.prototype={observe:function(e,t){for(var r={attr:!!(t.attributes||t.attributeFilter||t.attributeOldValue),kids:!!t.childList,descendents:!!t.subtree,charData:!(!t.characterData&&!t.characterDataOldValue)},o=this._watched,a=0;a<o.length;a++)o[a].tar===e&&o.splice(a,1);t.attributeFilter&&(r.afilter=p(t.attributeFilter,function(e,t){return e[t]=!0,e},{})),o.push({tar:e,fn:n(e,r)}),this._timeout||i(this)},takeRecords:function(){for(var e=[],t=this._watched,i=0;i<t.length;i++)t[i].fn(e);return e},disconnect:function(){this._watched=[],clearTimeout(this._timeout),this._timeout=null}};var v=document.createElement("i");v.style.top=0,v="null"!=v.attributes.style.value;var C=v?o:a,y=1,k="mo_id";return t}(void 0),function(e,t){"use strict";function i(){if(!o){o=!0;for(var e=0;e<n.length;e++)n[e].fn.call(window,n[e].ctx);n=[]}}function r(){"complete"===document.readyState&&i()}e=e||"docReady",t=t||window;var n=[],o=!1,a=!1;t[e]=function(e,t){if("function"!=typeof e)throw new TypeError("callback for docReady(fn) must be a function");return o?void setTimeout(function(){e(t)},1):(n.push({fn:e,ctx:t}),void("complete"===document.readyState||!document.attachEvent&&"interactive"===document.readyState?setTimeout(i,1):a||(document.addEventListener?(document.addEventListener("DOMContentLoaded",i,!1),window.addEventListener("load",i,!1)):(document.attachEvent("onreadystatechange",r),window.attachEvent("onload",i)),a=!0)))}}("docReady",window),function(){"use strict";var e,t=this&&this.__extends||function(e,t){function i(){this.constructor=e}for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)};!function(e){var t;!function(e){var t=function(){function e(){}/*!
             |*|  :: cookies.js ::
             |*|
             |*|  A complete cookies reader/writer framework with full unicode support.
             |*|
             |*|  Revision #1 - September 4, 2014
             |*|
             |*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
             |*|  https://developer.mozilla.org/User:fusionchess
             |*|
             |*|  This framework is released under the GNU Public License, version 3 or later.
             |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
             |*|
             |*|  Syntaxes:
             |*|
             |*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
             |*|  * docCookies.getItem(name)
             |*|  * docCookies.removeItem(name[, path[, domain]])
             |*|  * docCookies.hasItem(name)
             |*|  * docCookies.keys()
             |*|
             |*|  Modifications:
             |*|
             |*|  * docCookies renamed to DocCookieUtility
             |*|  * Added TypeScript type definitions
             \*/
return e.prototype.getItem=function(e){return e?decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null:null},e.prototype.setItem=function(e,t,i,r,n,o){if(!e||/^(?:expires|max\-age|path|domain|secure)$/i.test(e))return!1;var a="";if(i)switch(i.constructor){case Number:a=i===1/0?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+i;break;case String:a="; expires="+i;break;case Date:a="; expires="+i.toUTCString()}return document.cookie=encodeURIComponent(e)+"="+encodeURIComponent(t)+a+(n?"; domain="+n:"")+(r?"; path="+r:"")+(o?"; secure":""),!0},e.prototype.hasItem=function(e){return e?new RegExp("(?:^|;\\s*)"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie):!1},e.prototype.removeItem=function(e,t,i){return this.hasItem(e)?(document.cookie=encodeURIComponent(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(i?"; domain="+i:"")+(t?"; path="+t:""),!0):!1},e.prototype.keys=function(){for(var e=document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),t=e.length,i=0;t>i;i++)e[i]=decodeURIComponent(e[i]);return e},e}();e.DocCookieUtility=t}(t=e.doc_cookies||(e.doc_cookies={}))}(e||(e={}));var e;!function(e){var i;!function(e){var i=function(e){function i(t){e.call(this),this.cookieDomain=t}return t(i,e),i.prototype.setCookie=function(e,t){return this.setItem(e,t,1/0,"/",this.cookieDomain),this.getItem(e)},i.prototype.removeCookie=function(e){var t=this.getItem(e);return t?(this.removeItem(e,"/",this.cookieDomain),t):""},i}(e.DocCookieUtility);e.CaptoraDocCookieUtility=i}(i=e.doc_cookies||(e.doc_cookies={}))}(e||(e={}));var e;!function(e){var t=function(){function e(){}return e.COOKIE_NAMES={attribUrlCookieName:"colodin_attrib_url",attributableFlagCookieName:"colodin_attributable",oldCookieName:"_EXT_TRACKER_COOKIE_",origReferrerCookieName:"colodin_orig_referrer",thankYouPageReferrer:"colodin_thank_you_page_referrer",thankYouPageUrl:"colodin_thank_you_page_url",uuidCookieName:"colodin_id"},e.HIDDEN_FIELD_NAMES={asset:"cpasset",attribUrl:"cpcampaign",attributable:"cpfirstentry",origReferrer:"cpreferrer"},e.PIXEL_SRC="pixel.captora.com/img/pix.gif",e.PIXEL_CALLS=["capture_card_id","capture_card_cta_id","cta_title","config_id","segment_id"],e}();e.PixelConstants=t}(e||(e={}));var e;!function(e){var t;!function(e){var t=function(){function t(e){this.pagegroups=[],this.thankYouPagePatterns=[],"undefined"!=typeof e&&("undefined"!=typeof e.domain&&this.setDomain(e.domain),"undefined"!=typeof e.fieldFilterConfig&&this.setFieldFilterConfig(e.fieldFilterConfig),"undefined"!=typeof e.formFieldMappings&&this.setFormFieldMappings(e.formFieldMappings),"undefined"!=typeof e.pagegroups&&this.setPagegroups(e.pagegroups),"undefined"!=typeof e.thankYouPagePatterns&&this.setThankYouPagePatterns(e.thankYouPagePatterns),"undefined"!=typeof e.uuid&&this.setUuid(e.uuid))}return t.prototype.setDomain=function(e){return this.domain=e,this},t.prototype.setFieldFilterConfig=function(e){return this.fieldFilterConfig=e,this},t.prototype.setFormFieldMappings=function(e){return this.formFieldMappings=e,this},t.prototype.setPagegroups=function(e){return this.pagegroups=e,this},t.prototype.setThankYouPagePatterns=function(e){return this.thankYouPagePatterns=e,this},t.prototype.setUuid=function(e){return this.uuid=e,this},t.prototype.getDomain=function(){return this.domain},t.prototype.getFieldFilterConfig=function(){return this.fieldFilterConfig},t.prototype.getFormFieldMappings=function(){return this.formFieldMappings},t.prototype.getPagegroups=function(){return this.pagegroups},t.prototype.getThankYouPagePatterns=function(){return this.thankYouPagePatterns},t.prototype.getUuid=function(){return this.uuid},t.prototype.build=function(){return new e.PixelConfig(this)},t}();e.PixelConfigBuilder=t}(t=e.pixel_config||(e.pixel_config={}))}(e||(e={}));var e;!function(e){var t;!function(e){var t=function(){function e(e){this.domain=e.getDomain(),this.fieldFilterConfig=e.getFieldFilterConfig(),this.formFieldMappings=e.getFormFieldMappings(),this.pagegroups=e.getPagegroups(),this.thankYouPagePatterns=e.getThankYouPagePatterns(),this.uuid=e.getUuid()}return e.prototype.getDomain=function(){return this.domain},e.prototype.getFieldFilterConfig=function(){return this.fieldFilterConfig},e.prototype.getFormFieldMappings=function(){return this.formFieldMappings},e.prototype.getPagegroups=function(){return this.pagegroups},e.prototype.getThankYouPagePatterns=function(){return this.thankYouPagePatterns},e.prototype.getUuid=function(){return this.uuid},e}();e.PixelConfig=t}(t=e.pixel_config||(e.pixel_config={}))}(e||(e={}));var e;!function(e){var t;!function(e){var t=function(){function t(){}return t.newElement=function(t,i){return new e.ElementApi(t,i)},t}();e.ElementApiFactory=t}(t=e.element_api||(e.element_api={}))}(e||(e={}));var e;!function(e){var t;!function(e){var t=function(){function t(e,t){this.element=e,this.trackerClient=t}return t.prototype.getAttributes=function(){for(var e={},t=0;t<this.element.attributes.length;t++)e[this.element.attributes[t].name]=this.element.attributes[t].value;return e},t.prototype.isSearchForm=function(){var t=this.element.getElementsByTagName("input"),i=e.ElementApiFactory.newElement(this.element,this.trackerClient).getAttributes();for(var r in i)if(i.hasOwnProperty(r)&&i[r].toLowerCase().indexOf("search")>-1&&t.length<=1)return!0;for(var n=0;n<t.length;n++){var o=e.ElementApiFactory.newElement(t[n],this.trackerClient).getAttributes();for(var a in o)if(o.hasOwnProperty(a)&&o[a].toLowerCase().indexOf("search")>-1&&t.length<=1)return!0}return!1},t.prototype.addEventListenerPolyfill=function(e){if(e)for(var t=e.split(","),i=0;i<t.length;i++){var r=t[i]=t[i].trim();if(this.element.addEventListener){var n=Boolean("blur"===r||"focus"===r);this.element.addEventListener(r,this.trackerClient.eventDelegateHandler,n)}else this.element.attachEvent("on"+r,this.trackerClient.eventDelegateHandler)}},t}();e.ElementApi=t}(t=e.element_api||(e.element_api={}))}(e||(e={}));var e;!function(e){var t=function(){function e(){}return e.updateOrInjectHiddenField=function(t,i,r,n){if(i)i.value=n;else{var o=e.createHiddenInput(r,n);o&&t.appendChild(o)}},e.createHiddenInput=function(e,t){if(!e||!t)return null;var i=document.createElement("input");return i.setAttribute("type","hidden"),i.setAttribute("name",e),i.value=t,i},e.isExcludedForm=function(e,t){return Boolean("undefined"!=typeof e.getFieldFilterConfig()&&"undefined"!=typeof e.getFieldFilterConfig().filterMode&&"getforms"===e.getFieldFilterConfig().filterMode.toLowerCase()&&null!==t.getAttribute("method")&&"get"===t.getAttribute("method").toLowerCase())},e}();e.TrackerFormUtility=t}(e||(e={}));var e;!function(e){var t=e.PixelConstants,i=function(){function e(){}return e.getDocumentURL=function(){return document.URL},e.isCaptoraPageVisit=function(t){for(var i=t.getPagegroups(),r=0;r<i.length;r++){var n=String(i[r].pagegroup);if(0===n.indexOf("https://")?n=n.substring(8):0===n.indexOf("http://")&&(n=n.substring(7)),0===n.indexOf("www.")&&(n=n.substring(4)),e.getDocumentURL().indexOf(n)>-1)return!0}return!1},e.handleOldCookie=function(e,i){var r=i.split("__SEP__");e.setCookie(t.COOKIE_NAMES.uuidCookieName,r[0].split("=")[1]);var n=r[1].substr(r[1].indexOf("=")+1,r[1].length-1).split(",");n[0]&&e.setCookie(t.COOKIE_NAMES.origReferrerCookieName,n[0]),"Captora"===n[1]&&e.setCookie(t.COOKIE_NAMES.attributableFlagCookieName,String(!0)),n[2]&&e.setCookie(t.COOKIE_NAMES.attribUrlCookieName,n[2]),e.removeCookie(t.COOKIE_NAMES.oldCookieName)},e.getTrackingElements=function(){return e.HTMLCollectionToArray(document.querySelectorAll("input")).concat(e.HTMLCollectionToArray(document.querySelectorAll("select"))).concat(e.HTMLCollectionToArray(document.querySelectorAll("textarea"))).concat(e.HTMLCollectionToArray(document.querySelectorAll(".cp_element a"))).concat(e.HTMLCollectionToArray(document.querySelectorAll(".cp_element img")))},e.findHiddenFieldNameKey=function(e){var i="__c"===e.substr(-3)?e.substring(0,e.length-3):e;if("cpreferer"===i)return"origReferrer";for(var r in t.HIDDEN_FIELD_NAMES)if(t.HIDDEN_FIELD_NAMES.hasOwnProperty(r)&&i===t.HIDDEN_FIELD_NAMES[r])return r;return null},e.HTMLCollectionToArray=function(e){for(var t=[],i=e.length,r=0;i>r;r++)t.push(e[r]);return t},e.getMergedObject=function(e,t){var i={};for(var r in e)e.hasOwnProperty(r)&&(i[r]=e[r]);for(var n in t)t.hasOwnProperty(n)&&(i[n]=t[n]);return i},e.extractRootDomain=function(e){var t=e.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1],i=-2;return t.indexOf(".co.uk")>-1&&(i=-3),t.split(".").slice(i).join(".")},e.getJSONFile=function(e,t){var i;window.XDomainRequest&&"function"==typeof window.XDomainRequest?(i=new window.XDomainRequest,i.onload=function(){var e=JSON.parse(i.responseText);t&&t(e)},i.open("GET",e,!0),i.send()):(i=new XMLHttpRequest,i.onreadystatechange=function(){if(4===i.readyState&&200===i.status){var e=JSON.parse(i.responseText);t&&t(e)}},i.open("GET",e),i.send())},e}();e.TrackerUtility=i}(e||(e={}));var e;!function(e){var t;!function(e){var t=function(){function e(){}return e.init=function(t){var i=window.cpTrackingPixel||{};i.track=function(i,r,n,o,a){void 0===r&&(r={}),void 0===n&&(n=!1),void 0===o&&(o=function(){return null}),void 0===a&&(a=function(){return null}),e.validateArguments(i,r,n,o,a),t.firePixel({GOAL_CUSTOM_EVENT:!0,eventName:i,eventProperties:JSON.stringify(r),isConversion:n},!1,function(){o&&o()},function(){a&&a()})},window.cpTrackingPixel=i},e.validateArguments=function(e,t,i,r,n){if(!e||!e.length||0===e.length)throw new Error("Your event name must be of type string and must have a length.");if(i!==!0&&i!==!1)throw new Error("isConversion must be of type boolean");if("function"!=typeof r)throw new Error("onSuccess must be a function");if("function"!=typeof n)throw new Error("onError must be a function")},e}();e.GlobalTracker=t}(t=e.global_tracker||(e.global_tracker={}))}(e||(e={}));var e;!function(e){var t;!function(t){var i=e.element_api.ElementApiFactory,r=e.global_tracker.GlobalTracker,n=function(){function t(t){var i=this;this.eventDelegateHandler=function(e){e=e||window.event;var t=e.target,r=e.currentTarget;if(e&&e.type)switch(t.tagName){case"INPUT":case"SELECT":case"TEXTAREA":if("ALL"===i.pixelConfig.getFieldFilterConfig().filterMode||"password"===t.type)return;if(r.type&&"password"===r.type.toLowerCase())return;("focus"===e.type||"blur"===e.type||"change"===e.type)&&i.firePixelForInput(t);break;case"A":case"IMG":var n=t.getAttribute("href"),o="IMG"===t.tagName?t.getAttribute("src"):null;if("click"===e.type&&(o||n)){var a="true"===t.getAttribute("activator");i.firePixel({GOAL_ASSET:o||n},!a)}break;case"FORM":"submit"===e.type&&i.firePixel({GOAL_SUBMIT:!0})}},this.pixelConfig=t,this.progressiveProfile={asset:null,attribUrl:null,attributable:null,origReferrer:null,prevReferrer:null,prevUrl:null,stateReferrer:null,stateUrl:null},this.defaultPixelParams={domain:this.pixelConfig.getDomain(),url:document.URL,userid:this.pixelConfig.getUuid()},this.docCookies=new e.doc_cookies.CaptoraDocCookieUtility(this.pixelConfig.getDomain()),this.initialize(),this.firePixel({firstPixel:!0}),this.iterateAndFirePixelData(),this.fireThankYouPageCallIfNecessary()}return t.prototype.getPixelConfig=function(){return this.pixelConfig},t.prototype.iterateAndFirePixelData=function(){var t=document.querySelector("head");if(null!==t)for(var i=t.attributes,r=i.length,n=0;r>n;n++){var o=i[n].name.replace("data-",""),a=i[n].value;if(e.PixelConstants.PIXEL_CALLS.indexOf(o)>-1){var s={};s["GOAL_"+o]=a,this.firePixel(s)}"cta_title"===String(o).toLowerCase()&&(this.progressiveProfile.asset=a)}},t.prototype.firePixel=function(t,i,r,n){void 0===i&&(i=!1),void 0===r&&(r=function(){return null}),void 0===n&&(n=function(){return null});var o=t?e.TrackerUtility.getMergedObject(this.defaultPixelParams,t):this.defaultPixelParams;o.rand=Math.random();var a="";for(var s in o)o.hasOwnProperty(s)&&(a+=s+"="+encodeURIComponent(o[s])+"&");a+="timestamp="+Date.now();var l=document.location.protocol+"//"+e.PixelConstants.PIXEL_SRC+"?"+a,u=new Image;if(l.length>8500&&(l=l.substr(0,8500)),u.onload=function(){r()},u.onerror=function(){n()},u.src=l,i===!0)for(var c=new Date,d=c.getTime()+500;c.getTime()<=d;)c=new Date},t.prototype.mutationObserverCallback=function(t){for(var r=0;r<t.length;r++)if(t[r].addedNodes&&t[r].addedNodes.length)for(var n=0;n<t[r].addedNodes.length;n++){var o=t[r].addedNodes[n];switch(o.tagName){case"FORM":this.handleRuntimeFormInjection(o);break;case"INPUT":case"SELECT":case"TEXTAREA":case"A":case"IMG":i.newElement(o,this).addEventListenerPolyfill("click, focus, blur, change");break;case"DIV":for(var a=e.TrackerUtility.getTrackingElements(),s=0;s<a.length;s++)a[s].form&&(this.addHiddenFieldsToForm(a[s].form,a[s]),this.addSubmitEventListener(a[s].form)),i.newElement(a[s],this).addEventListenerPolyfill("click, focus, blur, change")}}},t.prototype.getUuid=function(){var e=this.pixelConfig.getDomain()||"";return"undefined"!=typeof window.crypto&&"function"==typeof window.crypto.getRandomValues&&"function"==typeof Uint32Array?[].slice.call(window.crypto.getRandomValues(new Uint32Array(3))).join("-")+"-"+e:Math.round(1e11*Math.random())+"-"+Math.round(1e11*Math.random())+"-"+Math.round(1e11*Math.random())+"-"+e},t.prototype.isExcludedField=function(e){for(var t=!1,i=this.pixelConfig.getFieldFilterConfig().filterFields,r=0;r<=i.length-1;r++){var n=i[r];if(e.getAttribute(n.attribute)&&n.value===e.getAttribute(n.attribute)){t=!0;break}}return t},t.prototype.addHiddenFieldsToForm=function(t,i,r){if(!e.TrackerFormUtility.isExcludedForm(this.getPixelConfig(),t)){if(i){var n=e.TrackerUtility.findHiddenFieldNameKey(i.name),o=t.elements[i.name];if(n&&o.length>1){var a=t.elements[i.name][0];return void(a!==i&&(a.parentNode.removeChild(a),i.value=this.progressiveProfile[n]))}}for(var s in e.PixelConstants.HIDDEN_FIELD_NAMES)e.PixelConstants.HIDDEN_FIELD_NAMES.hasOwnProperty(s)&&this.progressiveProfile.hasOwnProperty(s)&&(e.TrackerFormUtility.updateOrInjectHiddenField(t,t.elements[e.PixelConstants.HIDDEN_FIELD_NAMES[s]],e.PixelConstants.HIDDEN_FIELD_NAMES[s],this.progressiveProfile[s]),"asset"!==s&&e.TrackerFormUtility.updateOrInjectHiddenField(t,t.elements[e.PixelConstants.HIDDEN_FIELD_NAMES[s]+"__c"],e.PixelConstants.HIDDEN_FIELD_NAMES[s]+"__c",this.progressiveProfile[s]),"origReferrer"===s&&(e.TrackerFormUtility.updateOrInjectHiddenField(t,t.elements.cpreferer,"cpreferer",this.progressiveProfile.origReferrer),e.TrackerFormUtility.updateOrInjectHiddenField(t,t.elements.cpreferer__c,"cpreferer__c",this.progressiveProfile.origReferrer)));r===!0&&this.addSubmitEventListener(t)}},t.prototype.addSubmitEventListener=function(e){i.newElement(e,this).addEventListenerPolyfill("submit")},t.prototype.handleRuntimeFormInjection=function(t){var r=e.TrackerUtility.getTrackingElements();this.addHiddenFieldsToForm(t),this.addSubmitEventListener(t);for(var n=0;n<r.length;n++)i.newElement(r[n],this).addEventListenerPolyfill("click, focus, blur, change")},t.prototype.setStateForThankYouPages=function(){var t=this.docCookies.getItem(e.PixelConstants.COOKIE_NAMES.thankYouPageReferrer);null===t&&(t="");var i=this.docCookies.getItem(e.PixelConstants.COOKIE_NAMES.thankYouPageUrl);null===i&&(i=document.referrer,t=""),this.progressiveProfile.stateReferrer=t,this.progressiveProfile.stateUrl=i,window.parent===window&&(this.docCookies.setCookie(e.PixelConstants.COOKIE_NAMES.thankYouPageReferrer,document.referrer),this.docCookies.setCookie(e.PixelConstants.COOKIE_NAMES.thankYouPageUrl,document.URL))},t.prototype.initialize=function(){var t=this.docCookies.getItem(e.PixelConstants.COOKIE_NAMES.oldCookieName);t&&e.TrackerUtility.handleOldCookie(this.docCookies,t),this.uuid=this.docCookies.getItem(e.PixelConstants.COOKIE_NAMES.uuidCookieName),this.progressiveProfile.origReferrer=this.docCookies.getItem(e.PixelConstants.COOKIE_NAMES.origReferrerCookieName),this.progressiveProfile.attributable=this.docCookies.getItem(e.PixelConstants.COOKIE_NAMES.attributableFlagCookieName)&&!0,this.progressiveProfile.attribUrl=this.docCookies.getItem(e.PixelConstants.COOKIE_NAMES.attribUrlCookieName),this.setStateForThankYouPages(),this.uuid?e.TrackerUtility.isCaptoraPageVisit(this.pixelConfig)&&(this.progressiveProfile.attribUrl=document.URL,this.docCookies.setCookie(e.PixelConstants.COOKIE_NAMES.attribUrlCookieName,document.URL)):(this.uuid=this.getUuid(),this.docCookies.setCookie(e.PixelConstants.COOKIE_NAMES.uuidCookieName,this.uuid),document.referrer&&(this.progressiveProfile.origReferrer=document.referrer,this.docCookies.setCookie(e.PixelConstants.COOKIE_NAMES.origReferrerCookieName,document.referrer)),e.TrackerUtility.isCaptoraPageVisit(this.pixelConfig)&&(this.progressiveProfile.attributable=!0,this.progressiveProfile.attribUrl=document.URL,this.docCookies.setCookie(e.PixelConstants.COOKIE_NAMES.attributableFlagCookieName,String(!0)),this.docCookies.setCookie(e.PixelConstants.COOKIE_NAMES.attribUrlCookieName,document.URL))),this.defaultPixelParams.userid=this.uuid,""!==document.referrer&&(this.defaultPixelParams.referrer=document.referrer),r.init(this)},t.prototype.fireThankYouPageCallIfNecessary=function(){var e=this.pixelConfig.getThankYouPagePatterns();if(e&&e.length)for(var t=0;t<e.length;t++)if(document.URL.indexOf(e[t])>-1&&""!==e[t].trim()){this.defaultPixelParams.url=this.progressiveProfile.stateUrl,this.defaultPixelParams.referrer=this.progressiveProfile.stateReferrer,this.firePixel({GOAL_TRACKURL:this.progressiveProfile.attribUrl});break}},t.prototype.firePixelForInput=function(e){if(e){var t=String(e.type).toLowerCase();if("password"!==t&&"hidden"!==t&&("NONE"===this.pixelConfig.getFieldFilterConfig().filterMode||"GETFORMS"===this.pixelConfig.getFieldFilterConfig().filterMode||"ATTRIBUTES"===this.pixelConfig.getFieldFilterConfig().filterMode&&!this.isExcludedField(e))&&e.getAttribute("name")&&e.value){var i={};i["GOAL_FormField_"+e.getAttribute("name")]=e.value,this.firePixel(i)}}},t}();t.TrackerClient=n}(t=e.tracker_client||(e.tracker_client={}))}(e||(e={}));/*!
 * @copyright Captora, Inc. 2016.
 * Any modifications to this code will not be supported by Captora and its APIs.
 */
var i;!function(t){var i=e.tracker_client.TrackerClient,r=e.TrackerUtility,n=e.element_api.ElementApiFactory,o=e.pixel_config.PixelConfigBuilder,a=null,s=[],l=[],u=null;if("undefined"==typeof window.fireColodinPixel){window.docReady(function(){var e=document.getElementsByTagName("BODY")[0];u=new MutationObserver(function(e){l.push(e)}),u.observe(e,{childList:!0,subtree:!0})}),window.fireColodinPixel=function(e){s.push(e)};var c="function"==typeof window.cpTrackingClientConfig?window.cpTrackingClientConfig:null;window.cpTrackingClientConfig=function(e){for(a=new i(new o(e).build());s.length;)a.firePixel.call(a,s.shift());window.fireColodinPixel=function(e){a.firePixel.call(a,e)};var t=function(){for(var e=document.getElementsByTagName("BODY")[0],t=r.getTrackingElements(),i=0;i<t.length;i++)n.newElement(t[i],a).addEventListenerPolyfill("click, focus, blur, change");for(var o=document.getElementsByTagName("FORM"),s=0;s<o.length;s++)n.newElement(o[s],a).isSearchForm()||a.addHiddenFieldsToForm(o[s],null,!0);l.forEach(function(e){a.mutationObserverCallback.call(a,e),u.disconnect()});var c=new MutationObserver(function(e){a.mutationObserverCallback.call(a,e)});c.observe(e,{childList:!0,subtree:!0})};window.docReady(t),c&&c(e)},r.getJSONFile("//cdn.captora.com/js/"+r.extractRootDomain(window.location.href)+"/pixel-config.json",window.cpTrackingClientConfig)}}(i||(i={}))}();