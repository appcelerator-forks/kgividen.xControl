//ListView Component Constructor
function FloorPlanView() {
	var self = Ti.UI.createView({
		// backgroundImage : '/images/FloorPlan.png'
	});
	
	
	var f = Ti.App.Properties.getString("backgroundFilename");
	var bgImage = null;
	if (f != null && f != "") {
		bgImage	= Titanium.Filesystem.getFile(f);
		self.backgroundImage = bgImage.nativePath;	
	}
	
	//Refresh the view when we get here again.
	self.addEventListener('myFocus', function(e) {
		self.backgroundImage = Titanium.Filesystem.getFile(Ti.App.Properties.getString("backgroundFilename")).nativePath;	
	});
				
	return self;
	

}

module.exports = FloorPlanView;
