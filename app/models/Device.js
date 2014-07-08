exports.definition = {
    config : {
        "columns" : {
//            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "sortId" : "INTEGER",
            "name" : "TEXT",
            "displayName" : "TEXT",
            "address" : "TEXT",
            "showInLightingView" : "INTEGER",
            "type" : "TEXT",
            "parent" : "TEXT"
        },
        "defaults" : {
            "sortId" : 0,
            "name" : "",
            "displayName" : "",
            "address" : "",
            "showInLightingView" : false,
            "type" : "unknown",
            "parent" : "unknown"
        },
        "adapter" : {
            "type" : "sql",
            "collection_name" : "devices"
//            "idAttribute": "address"
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
            comparator: function(collection) {
                return collection.get('sortId');
            },
            updatePositions : function() {
                var collection = this;
                var dbName = collection.config.adapter.db_name;
                var table = collection.config.adapter.collection_name;
                var columns = collection.config.columns;
                db = Ti.Database.open(dbName);
                db.execute("BEGIN;");
                collection.each(function(model) {
//                    if (!model.sort) {
//                        model.id = util.guid();
//                        model.attributes[model.idAttribute ] = model.id;
//                    }
                    var sql = "UPDATE " + table + " SET sortId = " + model.get('sortId') + " WHERE " + model.idAttribute + " = '" + model.id + "'";
//                    Ti.API.info("sql: " + sql);
                    db.execute(sql);
                });
                db.execute("COMMIT;");
                db.close();
                collection.sort();
                collection.trigger('sync');
            }
        });
        // end extend

        return Collection;
    }
};