var args = arguments[0] || {};

Ti.API.debug("ARGS: " + JSON.stringify(args));

args.defaultState = args.defaultState || 'on';

if(args.defaultState == "on") {
    toggleButtonByIdClicked("off");
} else {
    toggleButtonByIdClicked("on");
}

$.on.title = args.title;
$.off.title = args.title;
// event handler for when the user clicks button
$.container.addEventListener('click', function(e) {
    // hide the clicked item, show the unclicked one
    toggleButtonByIdClicked(e.source.id);
});

// _buttonId name of the id clicked
function toggleButtonByIdClicked(_buttonId) {
    if (_buttonId === "on") {
        $.on.hide();
        $.off.show();
    } else if (_buttonId === "off") {
        $.on.show();
        $.off.hide();
    }
}

