var args = arguments[0] || {};
$.slider.address = args.address;
$.slider.type = args.type;

exports.setLevel = function (level){
    var level = Math.round(e.source.value);
    $.sliderLbl.text = level;
};


$.slider.addEventListener('touchend', function(e) {
    var level = Math.round(e.source.value);
    $.sliderLbl.text = level;
});

