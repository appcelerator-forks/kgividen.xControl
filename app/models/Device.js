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
            "SortId" : 0,
            "name" : "",
            "displayName" : "",
            "address" : "",
            "type" : "unknown",
            "parent" : "unknown"
        },
        "adapter" : {
            "type" : "sql",
            "collection_name" : "xControlDevices",
            "idAttribute": "id"
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
            whereShowInView : function(viewId) {
//                var sql = "SELECT * FROM " + this.config.adapter.collection_name + " WHERE " + view_name + " ORDER BY " + sortBy + " ASC";
                var sql = "SELECT * FROM xControlDevices INNER JOIN xControlDeviceInView ON xControlDeviceInView.DeviceId = xControlDevices.id WHERE ViewId=" + viewId;
                Ti.API.info(sql);
                return this.fetch({
                    query: sql
                });
            }
//            sortByID : function(sortBy) {
//                var sql = "SELECT * FROM " + this.config.adapter.collection_name + " ORDER BY " + sortBy + " ASC";
//                Ti.API.info(sql);
//                return this.fetch({
//                    query: sql
//                });
//            }
        });
        return Collection;
    }
};