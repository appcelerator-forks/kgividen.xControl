//LISTENERS
var args = arguments[0] || {};

//This is the individual URL for each camera.
var url = args.url;

//WE add the zindex and the delay to avoid the flicker of the image as it reloads.
$.camera1.addEventListener('load', function () {
    $.camera11.zIndex = 0;
    $.camera1.zIndex = 1;
    setTimeout(function(){
        $.camera11.image = url + "&blah=" + Math.random();
    },500);
});

$.camera11.addEventListener('load', function () {
    $.camera1.zIndex = 0;
    $.camera11.zIndex = 1;
    setTimeout(function(){
        $.camera1.image = url + "&blah=" + Math.random();
    },500);
});


var loadImage = function() {
    $.camera1.image = url + "&blah=" + Math.random();
};

//$.win.addEventListener('open', function () {
    loadImage();
//});
