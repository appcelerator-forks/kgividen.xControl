exports.definition = {
    config : {
        //todo The different views and SortIds should be moved into their own model.
        "columns" : {
//            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "SortId" : "INTEGER",
            "name" : "TEXT",
            "displayName" : "TEXT",
            "address" : "TEXT",
            "showInLightingView" : "INTEGER",
            "showInLightingViewSortId" : "INTEGER",
            "showInFavoritesView" : "INTEGER",
            "showInFavoritesViewSortId" : "INTEGER",
            "showInScenesView" : "INTEGER",
            "showInScenesViewSortId" : "INTEGER",
            "type" : "TEXT",
            "parent" : "TEXT"
        },
        "defaults" : {
            "SortId" : 0,
            "name" : "",
            "displayName" : "",
            "address" : "",
            "showInLightingView" : 0,
            "showInLightingViewSortId" : 0,
            "showInFavoritesView" : 0,
            "showInFavoritesViewSortId" : 0,
            "showInScenesView" : 0,
            "showInScenesViewSortId" : 0,
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
//                return collection.get('SortId');
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
//                    var sql = "UPDATE " + table + " SET SortId = " + model.get('SortId') + " WHERE " + model.idAttribute + " = '" + model.id + "'";
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