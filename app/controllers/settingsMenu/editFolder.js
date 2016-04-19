var parameters = arguments[0] || {};
var parentController = parameters.parentController || {};
var callbackFunction = parameters.callback || null;
var model = parameters.model || null;

// // EVENT HANDLERS
function saveButtonClicked(event) {
	    model.save({"displayName": $.folderName.value}, {
		success : function(model, response) {
			callbackFunction && callbackFunction();
		},
		error : function(e) {
			Ti.API.error('error: ' + e.message);
		}
	});
}

function init() {
    $.folderName.clearButtonMode = Titanium.UI.INPUT_BUTTONMODE_ALWAYS;
    $.folderName.value = model.get("displayName");
    $.folderName.focus();
}

/**
 * event listener to destroy all event listeners setup by Alloy.
 */
$.mainWindow.addEventListener("close", function(){
    $.destroy();
});

init();
