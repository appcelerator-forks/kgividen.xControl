//Settings View Component Constructor
function SettingsWindow(props,listView) {
	

	var self = Ti.UI.createView({
		scrollable : false
	});	

	var closeBtn = Ti.UI.createButton({
		title : 'Close',
		top: '90%'
	});	
		
	closeBtn.addEventListener('click', function(e){
		saveConnectionInfo();
		listView.remove(self);
		Ti.App.Properties.setString('hasRunBefore', true);
		listView.fireEvent('myFocus',{ 'scroller': e.source });
	});
	
	self.add(closeBtn);
	
	//*******CONNECTION INFORMATION****************
	// Add Login Information tableview
	
	var textFields = [];
	var connectionData = [
		{	
			label:'Server',
			field: 'ipaddress'
		},{
			label:'Method',
			field: 'http'
		},{
			label:'Port',
			field: 'port'
		},{
			label:'Username', 
			field:'username' 
		},{
			label:'Password', 
			field:'password' 
		}
	];
	
	var connSection = Ti.UI.createTableViewSection({
		headerTitle:'Connection Info'
	});
	
	for (var i = 0; i < connectionData.length; i++) { 
		var row = Titanium.UI.createTableViewRow(); 
		if (i == 0){
			row.header = 'Connection Info';
		}
		var label = Titanium.UI.createLabel({
			text:connectionData[i].label,
			textAlign:'left',
			left:8,
			selectionStyle:'none'
		});
		
		var def_ipaddress = Titanium.App.Properties.getString('ipaddress');
		var def_http = Titanium.App.Properties.getString('http');
		var def_port = Titanium.App.Properties.getString('port');
		var def_username = Titanium.App.Properties.getString('username');
		var def_password = Titanium.App.Properties.getString('password');
		
		textFields[i] = Titanium.UI.createTextField({
			font:{fontSize:16},
		    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
		    autocorrect:true,
		    height:50,
		    width:200,
		    left:150,
		    clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
	    }); 
		
		if(connectionData[i].field == 'ipaddress') {
		    textFields[i].value = def_ipaddress;
		    textFields[i].hintText = 'IP/DNS';
		    textFields[i].passwordMask = false;
		}
		
		if(connectionData[i].field == 'http') {
		    textFields[i].value = def_http;
		    textFields[i].passwordMask = false;
		    textFields[i].hintText = 'Default: http';
		}
		
		if(connectionData[i].field == 'port') {
		    textFields[i].value = def_port;
		    textFields[i].hintText = 'Default: 80';
	   	}
		
		if(connectionData[i].field == 'username') {
		    textFields[i].value = def_username;
		    textFields[i].hintText = 'Type User Name...';
		}
		
		if(connectionData[i].field == 'password') {
		    textFields[i].passwordMask = true;
		    textFields[i].value = def_password;
		    textFields[i].hintText = 'Type Password...';
		}
		row.add(label);
		row.add(textFields[i]);
		row.className = 'userinfo';
		connSection.add(row);
	};
	
	var chooseDevicesRow = Ti.UI.createTableViewRow({
		title : 'Add/Remove Devices',
		hasChild: 'true',
		dest:'ui/handheld/addRemoveDevices'
	});
	
	chooseDevicesRow.addEventListener('click', function(e){
		saveConnectionInfo();
	});
	
	connSection.add(chooseDevicesRow);
	
	var connTableView = Ti.UI.createTableView({ 
		top:5,
		height: '70%',
		width: '95%',
		borderRadius:5,
		scrollable:'false',	
		data:[connSection] 
	});
	
		// create table view event listener
	connTableView.addEventListener('click', function(e){
		if (e.source.dest){
			var destWin = require(e.source.dest);
			var win = new destWin({title: e.source.title});
			if (Ti.Platform.osname === 'android') {
				win.open({fullscreen:true});
			}else{
				win.open({modal:true});	
			}
		}
	});
	
	
	function saveConnectionInfo(){
		// get the user name and password values here and save them using //Ti.App.Properties.setString()... but how??? 
		var ipaddress = textFields[0].value;
		var http = textFields[1].value;
		var port = textFields[2].value;
		var username = textFields[3].value;
		var password = textFields[4].value;
		Ti.App.Properties.setString('ipaddress', ipaddress);
		if(http != ''){
			Ti.App.Properties.setString('http', http);	
		}else{
			Ti.App.Properties.setString('http', 'http');
		}
		if(port != ''){
			Ti.App.Properties.setString('port', port);
		}else{
			Ti.App.Properties.setString('port', '80');
		}
		Ti.App.Properties.setString('username', username);
		Ti.App.Properties.setString('password', password);
		Ti.API.info('user and pass' + username + ' ' + password + ipaddress + port);
	};
	
	
	//Button to swap out the background on the FloorPlan view.
	var f = Ti.App.Properties.getString("backgroundFilename");
	var bgImage = null;
	if (f != null && f != "") {
		bgImage	= Titanium.Filesystem.getFile(f);
	}
		
	// var addBackgroundBtn = Titanium.UI.createButton({
		// title:'Change Floor Plan Background',
		// font:{fontSize:16,fontWeight:'bold'},
		// top: 340,
		// height:60, 
		// width:300,
		// image:'/images/camera.png'	
	// });
	
	// addBackgroundBtn.addEventListener('click',function() {		
		// Titanium.Media.openPhotoGallery({	
			// success:function(event) {
				// var image = event.media;
// 				
				// // create new file name and remove old
				// var filename = Titanium.Filesystem.applicationDataDirectory + "/" + new Date().getTime() + ".jpg";
				// Ti.App.Properties.setString("backgroundFilename", filename);
				// if (bgImage != null) {
					// bgImage.deleteFile();
				// }
				// bgImage = Titanium.Filesystem.getFile(filename);
				// bgImage.write(image);
			// },
			// cancel:function() {
// 		
			// },
			// error:function(error) {
			// }
		// });
	// });
		
	
	self.add(connTableView); 		
	// self.add(addBackgroundBtn);
	
	//Todo: Add export to dropbox
	
	return self;
}

module.exports = SettingsWindow;
