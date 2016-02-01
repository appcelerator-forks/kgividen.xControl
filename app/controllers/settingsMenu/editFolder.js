var parameters = arguments[0] || {};
var parentController = parameters.parentController || {};
var callbackFunction = parameters.callback || null;
var item = parameters.item || null;

// // EVENT HANDLERS
function saveButtonClicked(event) {

    var content = {
        address: item.address.text,
        displayName: $.folderName.value
    };
    updateFolder(content);
}

function doOpen() {
    $.folderName.clearButtonMode = Titanium.UI.INPUT_BUTTONMODE_ALWAYS;
    $.folderName.value = item.title.text;
    $.folderName.focus();

}

function updateFolder(content) {
    Ti.API.debug("updateFolder content: " + JSON.stringify(content));
    Alloy.Collections.device.fetch({
        success: function (data) {
            var model = data.where({"address":content.address});
            Ti.API.debug("model before save: " + JSON.stringify(model));

            if(model.length > 0) {
                model[0].save({"displayName": content.displayName});
            }
            Ti.API.debug("model after save: " + JSON.stringify(model));
            Ti.API.debug("updateFolder Success!!!");

            var returnParams = {
                success : true,
                content : content
            };

            // return to folder.js controller 
            callbackFunction && callbackFunction(returnParams);
        },
        error: function () {
            Ti.API.debug("updateFolder Failed!!!");
        }
    });
}

/**
 * event listener to destroy all event listeners setup by Alloy.
 */
$.mainWindow.addEventListener("close", function(){
    $.destroy();
});
