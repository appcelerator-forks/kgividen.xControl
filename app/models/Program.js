//Get the connection information for the REST service.
exports.definition = {
    config: {
        // "URL": //specify it in the fetch instead of here so it is dynamic,
        // "debug": 1,
        "adapter": {
            "type": "restapi",
            "collection_name": "xControlPrograms",
            "idAttribute": "id"
        },
        "parentNode": "program" //your root node
    },      
    extendModel: function(Model) { 
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {  
		_.extend(Collection.prototype, {
			comparator : function(collection) {
				return collection.get('name');
			}
		});
        return Collection;
    }       
};