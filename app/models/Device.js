exports.definition = {
	config : {
		//todo The different views and SortIds should be moved into their own model.
		"columns" : {
			"id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
			"name" : "TEXT",
			"displayName" : "TEXT",
			"address" : "TEXT",
			"type" : "TEXT",
			"parent" : "TEXT"
		},
		"defaults" : {
			"name" : "",
			"displayName" : "",
			"address" : "",
			"type" : "unknown",
			"parent" : "unknown"
		},
		"adapter" : {
			"type" : "sql",
			"collection_name" : "xControlDevices",
			"idAttribute" : "id"
		}
	},

	extendModel : function(Model) {
		_.extend(Model.prototype, {

		});
		// end extend

		return Model;
	},

	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			comparator : function(collection) {
				//                Ti.API.info("In comparator! SortId: " + collection.get('SortId') + "collection: " + JSON.stringify(collection));
				return collection.get('SortId');
			},
			// whereShowInView : function(viewId) {
				// var sql = "SELECT * FROM xControlDevices INNER JOIN xControlDeviceInView ON xControlDeviceInView.DeviceId = xControlDevices.id WHERE ViewId=" + viewId;
				// Ti.API.info(sql);
				// return this.fetch({
					// query : sql
				// });
			// },
			getDevicesInFolderView : function() {
				// var sql = "SELECT * FROM xControlDevices INNER JOIN xControlDeviceInView ON xControlDeviceInView.DeviceId = xControlDevices.id";
				var sql = "SELECT * FROM xControlDevices INNER JOIN xControlFolderInView ON xControlFolderInView.FolderAddress = xControlDevices.address";
				// var sql = "SELECT * FROM xControlDevices";
				Ti.API.info(sql);
				return this.fetch({
					query : sql
				});
			},
			whereShow: function() {
                //var sql = "SELECT * FROM xControlDevices INNER JOIN xControlDeviceInView ON xControlDeviceInView.DeviceId = xControlDevices.id";
                var sql = "SELECT * FROM xControlDevices";
                Ti.API.info(sql);
                return this.fetch({
                    query: sql
                });
            },
			getSortedFoldersInView : function(viewId) {
				// var sql = "SELECT xControlDevices.id, xControlDevices.name, xControlDevices.displayName, xControlDevices.address, xControlDevices.type, xControlDevices.parent, xControlFolderInView.FolderAddress, xControlFolderInView.ViewId, ifnull(xControlFolderInView.SortId,9999) as SortId FROM xControlDevices INNER JOIN xControlFolderInView ON xControlFolderInView.FolderAddress = xControlDevices.address WHERE xControlDevices.type='folder' AND ViewId=" + viewId;
				var sql = "SELECT xControlDevices.id, xControlDevices.name, xControlDevices.displayName, xControlDevices.address, xControlDevices.type, xControlDevices.parent, xControlFolderInView.FolderAddress, xControlFolderInView.ViewId, ifnull(xControlFolderInView.SortId,9999) as SortId FROM xControlDevices INNER JOIN xControlFolderInView ON xControlFolderInView.FolderAddress = xControlDevices.address WHERE ViewId=" + viewId;
				// var sql = "SELECT xControlDevices.id, xControlDevices.name, xControlDevices.displayName, xControlDevices.address, xControlDevices.type, xControlDevices.parent, xControlFolderInView.FolderAddress, xControlFolderInView.ViewId, ifnull(xControlFolderInView.SortId,9999) as SortId FROM xControlDevices INNER JOIN xControlFolderInView ON xControlFolderInView.FolderAddress = xControlDevices.address";

				Ti.API.info("sql:" + sql);
				return this.fetch({
					query : sql
				});
			},
			getDevicesByFolderAndViewAndSort : function(viewId) {
				var sql = "SELECT xControlDevices.id, xControlDevices.name, xControlDevices.displayName, xControlDevices.address, xControlDevices.type, xControlDevices.parent, xControlDeviceInView.DeviceId, xControlDeviceInView.ViewId, xControlDeviceInFolder.ViewId as Blah, ifnull(xControlDeviceInView.SortId,9999) as SortId FROM xControlDevices LEFT JOIN xControlDeviceInView ON xControlDeviceInView.DeviceId = xControlDevices.id AND ViewId=" + viewId;
				Ti.API.info(sql);
				return this.fetch({
					query : sql
				});
			},
			sortById : function(viewId) {
				var sql = "SELECT xControlDevices.id, xControlDevices.name, xControlDevices.displayName, xControlDevices.address, xControlDevices.type, xControlDevices.parent, xControlDeviceInView.DeviceId, xControlDeviceInView.ViewId, ifnull(xControlDeviceInView.SortId,9999) as SortId FROM xControlDevices LEFT JOIN xControlDeviceInView ON xControlDeviceInView.DeviceId = xControlDevices.id AND ViewId=" + viewId;

				Ti.API.info(sql);
				return this.fetch({
					query : sql
				});
			}
		});
		return Collection;
	}
}; 