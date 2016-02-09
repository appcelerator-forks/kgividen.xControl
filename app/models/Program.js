exports.definition = {
	config : {
		//todo The different views and SortIds should be moved into their own model.
		"columns" : {
			"id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
			"name": "TEXT",
			"lastRunTime": "TEXT",
			"lastFinishTime": "TEXT",
			"nextScheduledRunTime": "TEXT",
			"parentId": "TEXT",
			"status": "TEXT",
			"folder": "TEXT",
			"enabled": "TEXT",
			"runAtStartup": "TEXT",
			"running": "TEXT"
		},
		"defaults" : {
			"name": "",
			"lastRunTime": "",
			"lastFinishTime": "",
			"nextScheduledRunTime": "",
			"parentId": "",
			"status": "",
			"folder": "",
			"enabled": "",
			"runAtStartup": "",
			"running": ""
		},
		"adapter" : {
			"type" : "sql",
			"collection_name" : "xControlPrograms",
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
				return collection.get('name');
			}
		});
		return Collection;
	}
}; 