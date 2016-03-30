var args = arguments[0] || {};

Ti.API.info("swipeViewDisabled:" + Titanium.App.Properties.getInt("swipeViewDisabled"));

var swipeViewDisabled = (Titanium.App.Properties.getInt("swipeViewDisabled")) ? true : false;

$.switchDisableViewSwipe.setValue(swipeViewDisabled);

$.switchDisableViewSwipe.addEventListener('change',function(e) {
	Ti.API.info("e.value: " + e.value);
	Titanium.App.Properties.setInt("swipeViewDisabled",e.value);
});

function closeWin () {
    $.win.close();
    Ti.App.fireEvent('refresh_ui');
}