//Settings View Component Constructor
function SettingsWindow(props,listView) {
	var forms = require('ui/common/forms');
	var currentConnType = Ti.App.Properties.getString('network_type');
	var networkBtnTitle = "";
	if(currentConnType == 'Local'){
		networkBtnTitle = "Local Connection";			
	}else{
		networkBtnTitle = "Remote Connection";
	}
	var connectionData = [
			{ title:networkBtnTitle, type:'button', id:'changeNetwork'},
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
	
	form.addEventListener('changeNetwork', function(e) {
		var currentType = Ti.App.Properties.getString('network_type');
		//Toggle the network Type todo:There's probably a better way to do this
		//todo: Toggle button name
		if(currentType == "Remote"){
			Ti.App.Properties.setString('network_type',"Local");
			form.fieldRefs.changeNetwork.title = "Local Connection";	
		}else{
			Ti.App.Properties.setString('network_type',"Remote");
			form.fieldRefs.changeNetwork.title = "Remote Connection";	
		}
		getConnectionInfo(Ti.App.Properties.getString('network_type'));
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
	
	function getLocalConnectionInfo(){	
		var connInfo = {};	
		connInfo.def_ipaddress = Titanium.App.Properties.getString('ipaddress_local');
		connInfo.def_http = Titanium.App.Properties.getString('http_local');
		connInfo.def_port = Titanium.App.Properties.getString('port_local');
		connInfo.def_username = Titanium.App.Properties.getString('username_local');
		connInfo.def_password = Titanium.App.Properties.getString('password_local');
		return connInfo;
	}
	
	function getRemoteConnectionInfo(){
		connInfo = {};
		connInfo.def_ipaddress = Titanium.App.Properties.getString('ipaddress_remote');
		connInfo.def_http = Titanium.App.Properties.getString('http_remote');
		connInfo.def_port = Titanium.App.Properties.getString('port_remote');
		connInfo.def_username = Titanium.App.Properties.getString('username_remote');
		connInfo.def_password = Titanium.App.Properties.getString('password_remote');
		return connInfo;
	}
	
	function getConnectionInfo(connType){
		var connectionInfo = {};
		if(connType == 'Remote'){
			connectionInfo = getRemoteConnectionInfo();	
		}else{
			connectionInfo = getLocalConnectionInfo();
		}
		for (var i = 0; i < connectionData.length; i++) { 	
			if(connectionData[i].id == 'ipaddress') {
				if(!connectionInfo.def_ipaddress){
					form.fieldRefs.ipaddress.value = "";	
				}else{
			    	form.fieldRefs.ipaddress.value = connectionInfo.def_ipaddress;
		    	}
			    form.fieldRefs.ipaddress.hintText = 'IP/DNS';
			    form.fieldRefs.ipaddress.passwordMask = false;
			}
			
			if(connectionData[i].id == 'http') {
				if(!connectionInfo.def_http){
					form.fieldRefs.http.value = "";	
				}else{
			    	form.fieldRefs.http.value = connectionInfo.def_http;
			    }
			    form.fieldRefs.http.passwordMask = false;
			    form.fieldRefs.http.hintText = 'Default: http';
			}
			
			if(connectionData[i].id == 'port') {
				if(!connectionInfo.def_port){
					form.fieldRefs.port.value = "";	
				}else{
			    	form.fieldRefs.port.value = connectionInfo.def_port;
			    }
			    form.fieldRefs.port.hintText = 'Default: 80';
		   	}
			
			if(connectionData[i].id == 'username') {
				if(!connectionInfo.def_username){
					form.fieldRefs.username.value = "";	
				}else{
			    	form.fieldRefs.username.value = connectionInfo.def_username;
			    }
			    form.fieldRefs.username.hintText = 'Type User Name...';
			}
			
			if(connectionData[i].id == 'password') {
				if(!connectionInfo.def_password){
					form.fieldRefs.password.value = "";	
				}else{
			    	form.fieldRefs.password.passwordMask = true;
			    }
			    form.fieldRefs.password.value = connectionInfo.def_password;
			    form.fieldRefs.password.hintText = 'Type Password...';
			}
		};
	}
		
	function saveConnectionInfo(data){
		var connectionType = Ti.App.Properties.getString('network_type');
		if(connectionType == 'Remote'){
			Ti.App.Properties.setString('ipaddress_remote', data.values.ipaddress);
			if(data.values.http != ''){
				Ti.App.Properties.setString('http_remote', data.values.http);	
			}else{
				Ti.App.Properties.setString('http_remote', 'http');
			}
			if(data.values.port != ''){
				Ti.App.Properties.setString('port_remote', data.values.port);
			}else{
				Ti.App.Properties.setString('port_remote', '80');
			}
			Ti.App.Properties.setString('username_remote', data.values.username);
			Ti.App.Properties.setString('password_remote', data.values.password);
		}else{
			Ti.App.Properties.setString('ipaddress_local', data.values.ipaddress);
			if(data.values.http != ''){
				Ti.App.Properties.setString('http_local', data.values.http);	
			}else{
				Ti.App.Properties.setString('http_local', 'http');
			}
			if(data.values.port != ''){
				Ti.App.Properties.setString('port_local', data.values.port);
			}else{
				Ti.App.Properties.setString('port_local', '80');
			}
			Ti.App.Properties.setString('username_local', data.values.username);
			Ti.App.Properties.setString('password_local', data.values.password);
		}
		//Store it to the current settings so when we use the rest server it will work
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
	getConnectionInfo(Titanium.App.Properties.getString('network_type'));			
	return self;
}

module.exports = SettingsWindow;
