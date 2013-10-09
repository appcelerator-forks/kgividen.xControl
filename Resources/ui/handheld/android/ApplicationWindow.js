// //Application Window Component Constructor
// function ApplicationWindow() {
	// //load component dependencies
	// var FirstView = require('ui/common/FirstView');
// 		
	// //create component instance
	// var self = Ti.UI.createWindow({
		// backgroundColor:'#ffffff',
		// navBarHidden:true,
		// exitOnClose:true
	// });
// 		
	// //construct UI
	// var firstView = new FirstView();
	// self.add(firstView);
// 	
	// return self;
// }
// 
// //make constructor function the public component interface
// module.exports = ApplicationWindow;
// 

function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	var button = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('openWindow'),
		top:20
	});
	self.add(button);
	
	button.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		self.containingTab.open(Ti.UI.createWindow({
			title: L('newWindow'),
			backgroundColor: 'white'
		}));
	});
	
	return self;
};

module.exports = ApplicationWindow;
