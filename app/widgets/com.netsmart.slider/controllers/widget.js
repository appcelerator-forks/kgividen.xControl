var args = arguments[0] || {};

Ti.API.debug("ARGS: " + JSON.stringify(args));

args.defaultState = args.defaultState || '0';

//if(args.defaultState == "on") {
//    toggleButtonByIdClicked("off");
//} else {
//    toggleButtonByIdClicked("on");
//}

$.slider.value = args.defaultState;
$.sliderLbl.title = args.title;


// event handler for when the user slides slider

$.slider.addEventListener('change', function(e) {
    Ti.API.debug("slider val: " + e.value);
    // hide the clicked item, show the unclicked one
    var level = Math.round(e.value);
    $.sliderLbl.title = (level);
});



// event handler for when the user clicks button
//$.container.addEventListener('click', function(e) {
//    // hide the clicked item, show the unclicked one
//    toggleButtonByIdClicked(e.source.id);
//});
//
//// _buttonId name of the id clicked
//function toggleButtonByIdClicked(_buttonId) {
//    if (_buttonId === "on") {
//        $.on.hide();
//        $.off.show();
//    } else if (_buttonId === "off") {
//        $.on.show();
//        $.off.hide();
//    }
//}


