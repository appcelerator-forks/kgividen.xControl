//Settings View Component Constructor
function SettingsWindow(props,listView) {
	var forms = require('ui/common/forms');
	var connectionData = [
	        { title:'Server', type:'text', id:'ipaddress' },
	        { title:'Method', type:'text', id:'http' },
	        { title:'Port', type:'number', id:'port' },
	        { title:'Username', type:'text', id:'username' },
	        { title:'Password', type:'password', id:'password' },
	        { title:'Add/Remove Devices', type:'button', id:'addRemoveDevices' },
	        { title:'Close', type:'submit', id:'close' }
       	];
	var self = Ti.UI.createView(props.settingsViewProps.formProps);
		
	var form = forms.createForm({
	        style: forms.STYLE_LABEL,
	        fields: connectionData,
	        props: props.settingsViewProps
	});
	
	form.addEventListener('close', function(e) {
        Ti.API.debug(e);
		saveConnectionInfo(e);
		listView.remove(self);
		Ti.App.Properties.setString('hasRunBefore', true);
		listView.fireEvent('myFocus',{ 'scroller': e.source });
	});
	
	form.addEventListener('addRemoveDevices', function(e) {
		saveConnectionInfo(e);
		var addRemoveDevices = require('ui/common/addRemoveDevices');
	
		var win = new addRemoveDevices();
		if (Ti.Platform.osname === 'android') {
			win.open({fullscreen:true});
		}else{
			win.open({modal:true});	
		}	
	});
	
	self.add(form);
	
	for (var i = 0; i < connectionData.length; i++) { 
		var def_ipaddress = Titanium.App.Properties.getString('ipaddress');
		var def_http = Titanium.App.Properties.getString('http');
		var def_port = Titanium.App.Properties.getString('port');
		var def_username = Titanium.App.Properties.getString('username');
		var def_password = Titanium.App.Properties.getString('password');
	
		if(connectionData[i].id == 'ipaddress') {
		    form.fieldRefs.ipaddress.value = def_ipaddress;
		    form.fieldRefs.ipaddress.hintText = 'IP/DNS';
		    form.fieldRefs.ipaddress.passwordMask = false;
		}
		
		if(connectionData[i].id == 'http') {
		    form.fieldRefs.http.value = def_http;
		    form.fieldRefs.http.passwordMask = false;
		    form.fieldRefs.http.hintText = 'Default: http';
		}
		
		if(connectionData[i].id == 'port') {
		    form.fieldRefs.port.value = def_port;
		    form.fieldRefs.port.hintText = 'Default: 80';
	   	}
		
		if(connectionData[i].id == 'username') {
		    form.fieldRefs.username.value = def_username;
		    form.fieldRefs.username.hintText = 'Type User Name...';
		}
		
		if(connectionData[i].id == 'password') {
		    form.fieldRefs.password.passwordMask = true;
		    form.fieldRefs.password.value = def_password;
		    form.fieldRefs.password.hintText = 'Type Password...';
		}
	};
	
	var chooseDevicesRow = Ti.UI.createTableViewRow({
		title : 'Add/Remove Devices',
		hasChild: 'true',
		dest:'ui/common/addRemoveDevices'
	});
	
	chooseDevicesRow.addEventListener('click', function(e){
		saveConnectionInfo();
	});
	
	function saveConnectionInfo(data){
		Ti.App.Properties.setString('ipaddress', data.values.ipaddress);
		if(data.values.http != ''){
			Ti.App.Properties.setString('http', data.values.http);	
		}else{
			Ti.App.Properties.setString('http', 'http');
		}
		if(data.values.port != ''){
			Ti.App.Properties.setString('port', data.values.port);
		}else{
			Ti.App.Properties.setString('port', '80');
		}
		Ti.App.Properties.setString('username', data.values.username);
		Ti.App.Properties.setString('password', data.values.password);
		Ti.API.info('user and pass' + data.values.username + ' ' + data.values.password + data.values.ipaddress + data.values.port);
	};
				
	return self;
}

module.exports = SettingsWindow;
