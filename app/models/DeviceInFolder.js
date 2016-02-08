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
            "SortId" : 99999
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

        });
        return Collection;
    }
};