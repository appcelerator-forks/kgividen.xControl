exports.definition = {
    config : {
        "columns" : {
            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "name" : "TEXT",
            "type" : "TEXT"
        },
        "defaults" : {
            "name" : "",
            "type" : "unknown"
        },
        "adapter" : {
            "type" : "sql",
            "collection_name" : "xControlViews",
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

        });
        return Collection;
    }
};