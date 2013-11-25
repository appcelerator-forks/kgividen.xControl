exports.doRestCall = function(callback, append_url, data) {
	var restURL = Titanium.App.Properties.getString('http') + '://' + Titanium.App.Properties.getString('ipaddress') + ':' + Titanium.App.Properties.getString('port') + '/rest/';
	var url = restURL + append_url;
	var authString = Ti.App.Properties.getString('username') + ':' + Ti.App.Properties.getString('password');
	var b64encodedAuthString = Ti.Utils.base64encode(authString.toString());
	Ti.API.info('url: ' + url);
	var xhr = Ti.Network.createHTTPClient({
		onload : function(xhre) {
			//todo: why does this still fire when undefined is here.
			//todo: refactor and use typeof
			if (callback != 'undefined' && callback != null && data != 'undefined' && data != null) {
				if(this.responseData == 'undefined' || this.responseData == null || this.responseData == '') {
					alert('No updated data found.  Please check the connection information.');
					return false;
				} else {
					callback(this, data);
				}
			} else if (callback != null && callback != 'undefined') {
				callback(this);
			}
			return true;
		},
		onerror : function(xhre) {
			alert('Connection Error! Please check the connection information.')
			Ti.API.info('Error: ' + this.responseText);
			return false;
		},
		timeout : 5000
	});

	xhr.open('GET', url);
	xhr.setRequestHeader('Accept', 'application/xml');
	xhr.setRequestHeader('Authorization', 'Basic ' + b64encodedAuthString);
	// send the data
	xhr.send();
}