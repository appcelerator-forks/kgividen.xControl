var args = arguments[0] || {};

var swipeViewDisabled = (Titanium.App.Properties.getInt("swipeViewDisabled")) ? true : false;

$.switchDisableViewSwipe.setValue(swipeViewDisabled);

$.switchDisableViewSwipe.addEventListener('change',function(e) {
	Titanium.App.Properties.setInt("swipeViewDisabled",e.value);
});

function closeWin () {
    $.win.close();
    Ti.App.fireEvent('refresh_ui');
}