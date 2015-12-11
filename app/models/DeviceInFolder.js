exports.definition = {
    config : {
        "columns" : {
            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "DeviceAddress" : "TEXT",
            "FolderAddress" : "TEXT",
            "SortId" : "INTEGER"
        },
        "defaults" : {
            "DeviceAddress" : '0',
            "FolderAddress" : '0',
            "SortId" : 0
        },
        "adapter" : {
            "type" : "sql",
            "collection_name" : "xControlDeviceInFolder",
            "idAttribute": "id"
        }
    },

    extendModel : function(Model) {
        _.extend(Model.prototype, {

        });

        return Model;
    },

    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {
//            whereInView : function(viewId) {
////                var sql = "SELECT * FROM " + this.config.adapter.collection_name + " WHERE " + view_name + " ORDER BY " + sortBy + " ASC";
//                var sql = "SELECT * FROM xControlDeviceInView WHERE ViewId=" + viewId;
//                Ti.API.info(sql);
//                return this.fetch({
//                    query: sql
//                });
//            }

        });
        return Collection;
    }
};