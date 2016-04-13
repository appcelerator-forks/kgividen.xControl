var parameters = arguments[0] || {};
var parentController = parameters.parentController || {};
var callbackFunction = parameters.callback || null;
var currentDevice = parameters.currentDevice || null;

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
    $.dd.fetch({
        success: function (data) {
            var model = data.where({"address":content.address});

            if(model) {
                model[0].save({"displayName": content.displayName});
            }

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