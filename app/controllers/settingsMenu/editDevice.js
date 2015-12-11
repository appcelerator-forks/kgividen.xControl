var parameters = arguments[0] || {};
var parentController = parameters.parentController || {};
var callbackFunction = parameters.callback || null;
var currentDevice = parameters.currentDevice || null;
Ti.API.debug(JSON.stringify(currentDevice));

// EVENT HANDLERS
function saveButtonClicked(event) {
    var content = {
        address: currentDevice.address,
        displayName: $.deviceName.value
    };

    updateDevice(content);
}

function doOpen() {
    $.deviceName.clearButtonMode = Titanium.UI.INPUT_BUTTONMODE_ALWAYS;
    $.deviceName.value = currentDevice.displayName;

    // set focus to the text input field, but
    // use set time out to give window time to draw
    setTimeout(function() {
        $.deviceName.focus();
    }, 400);

}

function updateDevice(content) {
    Ti.API.debug("updateDevice content: " + JSON.stringify(content));
    $.dd.fetch({
        success: function () {
            var model = $.dd.where({"address":content.address});
            Ti.API.debug("model before save: " + JSON.stringify(model));

            if(model) {
                model[0].save({"displayName": content.displayName});
            }
            Ti.API.debug("model after save: " + JSON.stringify(model));
            Ti.API.debug("updateDevice Success!!!");

            var returnParams = {
                success : true,
                content : content
            };

            callbackFunction && callbackFunction(returnParams);

        },
        error: function () {
            Ti.API.debug("updateDevice Failed!!!");
        }
    });
}


/**
 * event listener to destroy all event listeners setup by Alloy.
 */
$.mainWindow.addEventListener("close", function(){
    $.destroy();
});