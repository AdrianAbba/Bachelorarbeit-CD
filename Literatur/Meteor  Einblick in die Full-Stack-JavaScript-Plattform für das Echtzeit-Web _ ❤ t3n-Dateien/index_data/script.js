var loadCount = 0;

var bgImg1 = new Image();
var bgImg2 = new Image();

var copy1Img = new Image();

var ctaCopy = new Image();
var ctaArrow = new Image();


var iflLogo = new Image();
var imgIflLogoOverlay = new Image();
var imgLogoNoIfl = new Image();


if (Enabler.isInitialized())
  init();
else
  Enabler.addEventListener(studio.events.StudioEvent.INIT, init);
// Runs when Enabler is ready.

function init() {
  loadImagesWithOutPolite();

  if (Enabler.isPageLoaded()){
   politeInit();
 }  
 else
  Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeInit);
}

function loadCheck() {
	loadCount++;

	console.log("loadCount>>>" + loadCount);

	if(loadCount== 8) {
    console.log("8 images loaded");
    animationCanvas();
    draw();
  }
}

function animationCanvas(){
  var animationManager = new AnimationManager(30);

  var animationImg1 = new Animation("Img1");
  var animationImg2 = new Animation("Img2");
  var animationPetrolBox = new Animation("canvasPetrolBox");
  var animationCopy1 = new Animation("copy1");
  var animationCtaCopy = new Animation("ctaCopy");
  var animationCtaBox = new Animation("ctaBox");
  var animationArrow = new Animation("ctaArrow");
  var animationIfLogo = new Animation("iflLogo");
  var animationOverlay = new Animation("iflLogoOverlay");
  
//IMG1
var parametersBg1Start =  {img:bgImg1, startX:-150, startY:0, startScaleX:1, startScaleY:1};
var parametersBg1Move2 =  {img:bgImg1, easingType:'easeInQuad', startX:-150, startY:0, endX:-270, endY:0, startScaleX:1, startScaleY:1, endScaleX:1, endScaleY:1, delay:0.2, time:3.1};

animationImg1.addParameters(parametersBg1Start);
animationImg1.addParameters(parametersBg1Move2);

animationManager.addNewAnimation(animationImg1);

//IMG2
var parametersImg2BGStart = {img:bgImg2, startX:-150, startY:0, startAlpha:0};
var parametersImg2BGMask =  {img:bgImg2, easingType:'easeInQuad', startX:-150, endX:-167, startY:0, startAlpha:1, maskStartX:800, maskEndX:0, maskStartY:0, maskStartWidth:0, maskEndWidth:800, maskStartHeight:250, delay:2.6, time:0.8};
var parametersImg2BGMask2 = {img:bgImg2, easingType:'easeOutQuad', startX:-167, startY:0, endX:-185, endY:0, startAlpha:1, time:1.5};

animationImg2.addParameters(parametersImg2BGStart);
animationImg2.addParameters(parametersImg2BGMask);
animationImg2.addParameters(parametersImg2BGMask2);

animationManager.addNewAnimation(animationImg2);

//PETROL-BOX
var paramentersPetrolBox =  {animationType:"gradient", easingType:'easeInOutQuad', startX:800, startY:76, gradientStartWidth:1, gradientStartHeight:112, startAlpha:0.85, time:1};
var paramentersPetrolBox2 = {animationType:"gradient", easingType:'easeInOutQuad', startX:800, startY:76, gradientStartWidth:1, gradientEndWidth:286, endX:500, startAlpha:0.85, gradientStartHeight:112, delay:4.5, time:1};

animationPetrolBox.addParameters(paramentersPetrolBox);
animationPetrolBox.addParameters(paramentersPetrolBox2);

animationManager.addNewAnimation(animationPetrolBox);

//COPY1
var parametersCopy1Start = {img:copy1Img, easingType:'easeInOutQuad', startX:517, startY:93, startAlpha:0};
var parametersCopy1 =      {img:copy1Img, easingType:'easeInOutQuad', startX:517, startY:93, startAlpha:0, endAlpha:1, delay:5.5, time:0.7};

animationCopy1.addParameters(parametersCopy1Start);
animationCopy1.addParameters(parametersCopy1);

animationManager.addNewAnimation(animationCopy1);

//CTA-BOX
var paramentersCtaBox =  {animationType:"box", easingType:'easeInOutQuad', startX:800, startY:194, boxStartWidth:1, boxStartHeight:39};
var paramentersCtaBox2 = {animationType:"box", easingType:'easeInOutQuad', startX:800, startY:194, boxStartWidth:1, boxStartHeight:39, endX:500, boxEndWidth:286, delay:6.8, time:0.6};

animationCtaBox.addParameters(paramentersCtaBox);
animationCtaBox.addParameters(paramentersCtaBox2);

animationManager.addNewAnimation(animationCtaBox);

//CTA-COPY
var parametersCtaCopy =  {img:ctaCopy, easingType:'easeOutQuad', startX:656, startY:207, startAlpha:0};
var parametersCtaCopy2 = {img:ctaCopy, easingType:'easeOutQuad', startX:656, startY:207, startAlpha:0, endAlpha:1, delay:7.8, time:0.4};

animationCtaCopy.addParameters(parametersCtaCopy);
animationCtaCopy.addParameters(parametersCtaCopy2);

animationManager.addNewAnimation(animationCtaCopy);

//CTA-ARROW
var animationArrowParams =  {img:ctaArrow, easingType:'easeOutQuad', startX:751, startY:208, startAlpha:0};
var animationArrowParams2 = {img:ctaArrow, easingType:'easeOutQuad', startX:751, startY:208, endX:761, startAlpha:0, endAlpha:1, delay:8.1, time:0.4};

animationArrow.addParameters(animationArrowParams);
animationArrow.addParameters(animationArrowParams2);

animationManager.addNewAnimation(animationArrow);

//LOGO
var animationLogoParams =  {img:imgLogoNoIfl, startX:14, startY:14,  startAlpha:0};
var animationLogoParams2 = {img:imgLogoNoIfl, startX:14, endX:14, startY:14, startAlpha:0, endAlpha:1, delay:9, time:1.4};
var animationLogoParams3 = {img:iflLogo, startX:14, endX:14, startY:14, startAlpha:1, endAlpha:1, time:1.4};

animationIfLogo.addParameters(animationLogoParams);
animationIfLogo.addParameters(animationLogoParams2);
animationIfLogo.addParameters(animationLogoParams3);

animationManager.addNewAnimation(animationIfLogo);

//LOGO-OVERLAY
var animationOverlayLogoParams =  {img:imgIflLogoOverlay, startX:28, startY:52,  startAlpha:0, startScaleX:1, startScaleY:1};
var animationOverlayLogoParams2 = {img:imgIflLogoOverlay, startX:28, startY:52,  startAlpha:1, endAlpha:1, startScaleX:1, startScaleY:1, delay:10.2};
var animationOverlayLogoParams3 = {img:imgIflLogoOverlay, startX:28, endX:156, startY:52, startAlpha:1, startScaleX:1, startScaleY:1, time:2};

animationOverlay.addParameters(animationOverlayLogoParams);
animationOverlay.addParameters(animationOverlayLogoParams2);
animationOverlay.addParameters(animationOverlayLogoParams3);

animationManager.addNewAnimation(animationOverlay);

animationManager.startAnimating();

}

// Runs when the page is completely loaded.
function politeInit(){
	
  bgImg1.src = "img1.jpg";
  bgImg1.onload = loadCheck;
  
  bgImg2.src = 'img2.jpg';
  bgImg2.onload = loadCheck;
  
  copy1Img.src = 'copy1.png';
  copy1Img.onload = loadCheck;

  ctaCopy.src = 'cta_copy.png';
  ctaCopy.onload = loadCheck;

  ctaArrow.src = 'cta_arrow.png';
  ctaArrow.onload = loadCheck;

  iflLogo.src = "ifl-logo.png";
  iflLogo.onload = loadCheck;

  imgLogoNoIfl.src = "logo_noifl.png";
  imgLogoNoIfl.onload = loadCheck;

  imgIflLogoOverlay.src = 'ifl-overlay.png';
  imgIflLogoOverlay.onload = loadCheck;

};

function loadImagesWithOutPolite(){

}

function draw() {
  document.getElementById("content").style.display = "block";
}
