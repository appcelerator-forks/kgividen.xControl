exports.definition = {
    config : {
        //todo The different views and sortIDs should probably be moved into another model.
        "columns" : {
//            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "sortId" : "INTEGER",
            "name" : "TEXT",
            "displayName" : "TEXT",
            "address" : "TEXT",
            "showInLightingView" : "INTEGER",
            "lightingSortId" : "INTEGER",
            "showInFavoritesView" : "INTEGER",
            "favoritesSortId" : "INTEGER",
            "showInScenesView" : "INTEGER",
            "scenesSortId" : "INTEGER",
            "type" : "TEXT",
            "parent" : "TEXT"
        },
        "defaults" : {
            "sortId" : 0,
            "name" : "",
            "displayName" : "",
            "address" : "",
            "showInLightingView" : 0,
            "lightingSortId" : 0,
            "showInFavoritesView" : 0,
            "favoritesSortId" : 0,
            "showInScenesView" : 0,
            "scenesSortId" : 0,
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
//            comparator: function(collection) {
//                return collection.get('sortId');
//            },
//            updatePositions : function() {
//                var collection = this;
//                var dbName = collection.config.adapter.db_name;
//                var table = collection.config.adapter.collection_name;
//                var columns = collection.config.columns;
//                db = Ti.Database.open(dbName);
//                db.execute("BEGIN;");
//                collection.each(function(model) {
////                    if (!model.sort) {
////                        model.id = util.guid();
////                        model.attributes[model.idAttribute ] = model.id;
////                    }
//                    var sql = "UPDATE " + table + " SET sortId = " + model.get('sortId') + " WHERE " + model.idAttribute + " = '" + model.id + "'";
////                    Ti.API.info("sql: " + sql);
//                    db.execute(sql);
//                });
//                db.execute("COMMIT;");
//                db.close();
//                collection.sort();
//                collection.trigger('sync');
//            },
            whereShowInView : function(view_name, sortBy) {
                var sql = "SELECT * FROM " + this.config.adapter.collection_name +" WHERE " + view_name + " ORDER BY " + sortBy + " ASC";
                Ti.API.info(sql);
                return this.fetch({
                    query: sql
                });
            },
            sortByID : function(sortBy) {
                var sql = "SELECT * FROM " + this.config.adapter.collection_name + " ORDER BY " + sortBy + " ASC";
                Ti.API.info(sql);
                return this.fetch({
                    query: sql
                });
            }
        });
        return Collection;
    }
};