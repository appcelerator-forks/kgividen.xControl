exports.definition = {
    config : {
        "columns" : {
            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "FolderAddress" : "TEXT",
            "ViewId" : "INTEGER",
            "SortId" : "INTEGER"
        },
        "defaults" : {
            "FolderAddress" : "0",
            "ViewId" : 0,
            "SortId" : 9999999
        },
        "adapter" : {
            "type" : "sql",
            "collection_name" : "xControlFolderInView",
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
            whereInView : function(viewId) {
                var sql = "SELECT * FROM xControlFolderInView WHERE ViewId=" + viewId;
                return this.fetch({
                    query: sql
                });
            }

        });
        return Collection;
    }
};