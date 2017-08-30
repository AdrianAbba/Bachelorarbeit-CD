/*
Iframe Tag Html5 sitebar	
*/

var proto = (window.location.protocol == "https:")? "https://secure-" : "http://";

var scriptAddCSS = document.createElement('script');
scriptAddCSS.src = proto+"ds.serving-sys.com/BurstingRes/CustomScripts/PL_AddCSS_NCM.js?css1=iframe%5Bid*%3D%27ebBannerIFrame_%27%5D%7B%0A%09width%3A100%25!%3B%0A%09height%3A100%25!%3B%0A%7Dhtml%2C%20body%7Bheight%3A100%25!%3B%7D";

document.getElementsByTagName('head')[0].appendChild(scriptAddCSS);