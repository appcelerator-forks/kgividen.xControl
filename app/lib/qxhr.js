var Q = require('q');

exports.loadUrl = function(conn, data) {
    var deferred = Q.defer();
    var xhr = Titanium.Network.createHTTPClient({
        validatesSecureCertificate : false,
        timeout : 10000
    });
    var conntypes = ['POST', 'GET', 'PUT', 'DELETE'];

    var onload = function() {
        if (xhr.status === 200) {
            deferred.resolve(xhr.responseText);
        } else {
            deferred.reject(new Error({
                code : "Status: " + xhr.status,
                message : xhr.responseText
            }));
        }
    };

    var onerror = function() {
        var errorString = 'Please check the connection information. URL: ' + conn.url;
        if(conn.username) errorString += " User: " + conn.username;
		  var dialog = Ti.UI.createAlertDialog({
		    message: errorString,
		    ok: 'OK',
		    title: 'Network Error'
		  });
		  dialog.show();
		  dialog.addEventListener('click', function(e){
		  	Alloy.Globals.PW.hideIndicator();
		  });
        deferred.reject(new Error({
            code : "Status: " + xhr.status,
            message : xhr.responseText
        }));
    };

    try {
        if (!(conn) || (typeof conn !== 'object')) {
            throw new Error('invalid connection details');
        }

        if (!(conn.url)) {
            throw new Error('URL not set');
        }

        var connectiontype = conn.connectiontype;

        if (conntypes.indexOf(connectiontype) === -1) {
            throw new Error('invalid connection type');
        }

        xhr.open(connectiontype, conn.url);
        var headers = conn.headers;

        _.each(headers, function(header) {
            xhr.setRequestHeader(header.name,header.value);
        });

        xhr.enableKeepAlive = false;
        xhr.onload = onload;
        xhr.onerror = onerror;

        if (data) {
            xhr.send(data);
        } else {
            xhr.send();
        }

    } catch (ex) {
        deferred.reject(new Error({
            code : "Status: " + 0,
            message : ex.message || ex
        }));

        return;

    } finally {
        return deferred.promise;
    }
};