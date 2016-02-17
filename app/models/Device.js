exports.definition = {
	config : {
		//todo The different views and SortIds should be moved into their own model.
		"columns" : {
			"id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
			"name" : "TEXT",
			"displayName" : "TEXT",
			"address" : "TEXT",
			"type" : "TEXT",
			"data" : "TEXT",
			"parent" : "TEXT"
		},
		"defaults" : {
			"name" : "",
			"displayName" : "",
			"address" : "",
			"type" : "unknown",
			"parent" : "unknown",
			"data" : ""
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
				return collection.get('SortId');
			}
		});
		return Collection;
	}
}; 