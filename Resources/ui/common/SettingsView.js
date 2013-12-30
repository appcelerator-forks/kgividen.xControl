//Settings View Component Constructor
function SettingsWindow(props,listView) {
	var forms = require('ui/common/forms');
	var db = require('db');
	
	var CONN_CURRENT = 'conn_current';
	var CONN_REMOTE = 'Remote';
	var CONN_LOCAL = 'Local';
	var NETWORK_BTN_REMOTE_TITLE = "Remote Connection Enabled";
	var NETWORK_BTN_LOCAL_TITLE = "Local Connection Enabled";
	
	var currentConnType = Ti.App.Properties.getString('network_type');
	var networkBtnTitle = "";
	if(currentConnType == CONN_REMOTE){
		networkBtnTitle = NETWORK_BTN_REMOTE_TITLE;			
	}else{
		networkBtnTitle = NETWORK_BTN_LOCAL_TITLE;
	}
	var connectionData = [
			{ title:networkBtnTitle, type:'button', id:'changeNetworkBtn'},
	        { title:'Server', type:'text', id:'ipaddress' },
	        { title:'Method', type:'text', id:'method' },
	        { title:'Port', type:'number', id:'port' },
	        { title:'Username', type:'text', id:'username' },
	        { title:'Password', type:'password', id:'password' },
	        { title:'Add/Remove Devices', type:'button', id:'addRemoveDevices' },
	        { title:'Clear All Data', type:'button', id:'clearDataPrompt' },
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
		saveConnectionInfo(e.values);
		listView.remove(self);
		Ti.App.Properties.setString('hasRunBefore', true);
		listView.fireEvent('myFocus',{ 'scroller': e.source });
	});
	
	form.addEventListener('changeNetworkBtn', function(e) {
		var currentType = Ti.App.Properties.getString('network_type');
		//Toggle the network Type todo:There's probably a more concise way to do this
		if(currentType == "Remote"){
			Ti.App.Properties.setString('network_type',CONN_LOCAL);
			form.fieldRefs.changeNetworkBtn.title = NETWORK_BTN_LOCAL_TITLE;	
		}else{
			Ti.App.Properties.setString('network_type',CONN_REMOTE);
			form.fieldRefs.changeNetworkBtn.title = NETWORK_BTN_REMOTE_TITLE;	
		}
		getConnectionInfo(Ti.App.Properties.getString('network_type'));
	});
	
	form.addEventListener('addRemoveDevices', function(e) {
		saveConnectionInfo(e.values);
		var addRemoveDevices = require('ui/common/addRemoveDevices');
	
		var win = new addRemoveDevices();
		if (Ti.Platform.osname === 'android') {
			win.open({fullscreen:true});
		}else{
			win.open({modal:true});	
		}	
	});
	
	form.addEventListener('clearDataPrompt', function(e) {
		var dialog = Ti.UI.createAlertDialog({
		  	confirm : 0,
		    cancel: 1,
		    buttonNames: ['Confirm', 'Cancel'],
		    message: 'Are you sure you want to delete all the data?',
		    title: 'Clear All Data'
		  });
		dialog.addEventListener('click', function(e){
			if (e.index === e.source.cancel){
				Ti.API.info('The cancel button was clicked');
			}
			if (e.index === e.source.confirm){
				clearData();
			}
		  });
		dialog.show();
	});

	self.add(form);
	
	function clearData(){
		db.clearDb();
		Ti.App.Properties.removeProperty('ipaddress');
		Ti.App.Properties.removeProperty('http');
		Ti.App.Properties.removeProperty('port');
		Ti.App.Properties.removeProperty('username');
		Ti.App.Properties.removeProperty('password');
		Ti.App.Properties.removeProperty('conn_' + CONN_LOCAL);
		Ti.App.Properties.removeProperty('conn_' + CONN_REMOTE);
		Ti.App.Properties.removeProperty('conn_' + CONN_CURRENT);
		for (var i in form.fieldRefs){
			form.fieldRefs[i].value = "";	
		}

		alert("Data has been cleared.");
	}	
	function getConnectionInfo(network_type){
		var connectionInfo = {};
		//connType is Remote or Local
		connectionInfo = JSON.parse(Titanium.App.Properties.getString('conn_' + network_type));
		
		if (!connectionInfo){
			//this is for backwards compatibility with the old way we used to store connections.
			//We'll see if that exists since the connectionInfo didn't work the new way and we'll load them up
			connectionInfo = {};
			if(Titanium.App.Properties.getString('ipaddress')){
				connectionInfo.ipaddress = Titanium.App.Properties.getString('ipaddress');
				connectionInfo.method = Titanium.App.Properties.getString('http');
				connectionInfo.port = Titanium.App.Properties.getString('port');
				connectionInfo.username = Titanium.App.Properties.getString('username');
				connectionInfo.password = Titanium.App.Properties.getString('password');
			}
		}	
		if (!connectionInfo){
			connectionInfo = {
				'ipaddress' : "",
				'method' : "",
				'port' : "",
				'username' : "",
				'password' : ""
			}
		}
		//todo: do we need to massage connectionData?
		for (var i = 0; i < connectionData.length; i++) { 	
			if(connectionData[i].id == 'ipaddress') {
				if(!connectionInfo.ipaddress){
					form.fieldRefs.ipaddress.value = "";	
				}else{
			    	form.fieldRefs.ipaddress.value = connectionInfo.ipaddress;
		    	}
			    form.fieldRefs.ipaddress.hintText = 'IP/DNS';
			    form.fieldRefs.ipaddress.passwordMask = false;
			}
			
			if(connectionData[i].id == 'method') {
				if(!connectionInfo.method){
					form.fieldRefs.method.value = "";	
				}else{
			    	form.fieldRefs.method.value = connectionInfo.method;
			    }
			    form.fieldRefs.method.passwordMask = false;
			    form.fieldRefs.method.hintText = 'Default: http';
			}
			
			if(connectionData[i].id == 'port') {
				if(!connectionInfo.port){
					form.fieldRefs.port.value = "";	
				}else{
			    	form.fieldRefs.port.value = connectionInfo.port;
			    }
			    form.fieldRefs.port.hintText = 'Default: 80';
		   	}
			
			if(connectionData[i].id == 'username') {
				if(!connectionInfo.username){
					form.fieldRefs.username.value = "";	
				}else{
			    	form.fieldRefs.username.value = connectionInfo.username;
			    }
			    form.fieldRefs.username.hintText = 'Type User Name...';
			}
			
			if(connectionData[i].id == 'password') {
				if(!connectionInfo.password){
					form.fieldRefs.password.value = "";	
				}else{
			    	form.fieldRefs.password.passwordMask = true;
			    }
			    form.fieldRefs.password.value = connectionInfo.password;
			    form.fieldRefs.password.hintText = 'Type Password...';
			}
		};
	}
	
	function saveConnectionInfo(data){		
		var networkType = Ti.App.Properties.getString('network_type');
		if(data.method){
			var method = data.method;	
		}else{
			var method = 'http';
		}
		if(data.port){
			var port = data.port;
		}else{
			var port = '80';
		}
	
		var data = {
			'ipaddress' : data.ipaddress,
			'method' : method,
			'port' : port,
			'username' : data.username,
			'password' : data.password
		}
		var dataStr = JSON.stringify(data);
		Ti.App.Properties.setString('conn_' + networkType, dataStr);
		//Store it to the current settings so when we use the rest server it will work
		Ti.App.Properties.setString(CONN_CURRENT, dataStr);
		
		Ti.API.info('user and pass' + data.username + ' ' + data.password + data.ipaddress + port);
	};
	
	

	
	getConnectionInfo(Titanium.App.Properties.getString('network_type'));			
	return self;
}

module.exports = SettingsWindow;
