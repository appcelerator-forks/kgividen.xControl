var parameters = arguments[0] || {};
var parentController = parameters.parentController || {};
var callbackFunction = parameters.callback || null;
var model = parameters.model || null;

Ti.API.info("model: " + JSON.stringify(model));
// EVENT HANDLERS
function saveButtonClicked(event) {
    model.save({"displayName": $.deviceName.value}, {
		success : function(model, response) {
			callbackFunction && callbackFunction();
		},
		error : function(e) {
			Ti.API.error('error: ' + e.message);
		}
	});
}

function init() {
    $.deviceName.clearButtonMode = Titanium.UI.INPUT_BUTTONMODE_ALWAYS;
    $.deviceName.value = model.get("displayName");
    $.deviceName.focus();
}

/**
 * event listener to destroy all event listeners setup by Alloy.
 */
$.mainWindow.addEventListener("close", function(){
    $.destroy();
});

init();
