//Get the connection information for the REST service.
var d = require('isy');
d.init();
var connection = d.getConnection();
//Convert headers from array to obj
var headers = {};
_.each(connection.headers, function(header){
	headers[header.name] = header.value;
});

exports.definition = {
    config: {
        "URL": connection.baseURL + "/programs",
        // "debug": 1,
        "adapter": {
            "type": "restapi",
            "collection_name": "xControlPrograms",
            "idAttribute": "id"
        },
        "headers": headers,
        "parentNode": "program" //your root node
    },      
    extendModel: function(Model) { 
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {  
        _.extend(Collection.prototype, {});
        return Collection;
    }       
};