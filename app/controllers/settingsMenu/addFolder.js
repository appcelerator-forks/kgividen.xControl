var parameters = arguments[0] || {};
var parentController = parameters.parentController || {};
var callbackFunction = parameters.callback || null;

// EVENT HANDLERS
function saveButtonClicked(event) {
    var returnParams = {
        success : true,
        content : $.folderName.value
    };

    // return to comment.js controller to add new comment
    callbackFunction && callbackFunction(returnParams);
}

function doOpen() {
    // set focus to the text input field, but
    // use set time out to give window time to draw
    setTimeout(function() {
        $.folderName.focus();
    }, 400);

}

/**
 * event listener to destroy all event listeners setup by Alloy.
 */
$.mainWindow.addEventListener("close", function(){
    $.destroy();
});