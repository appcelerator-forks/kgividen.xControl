//Get the connection information for the REST service.
exports.definition = {
    config: {
        // "URL": //specify it in the fetch instead of here so it is dynamic,
        "debug": 1,
        "adapter": {
            "type": "restapi",
            "collection_name": "xControlIsyNodes",
            "idAttribute": "id"
        },
        "parentNode": "node" //your root node
        // "parentNode": function(data){
        	// return data;
        // }
    },      
    extendModel: function(Model) { 
        _.extend(Model.prototype, {
        	//TODO get this to work and take it out of folders.js
        	// transform: function transform() {
        		// Ti.API.info("Hello!!!!!!");
		        // var transformed = this.toJSON();
		        // transformed.property.value = "111";
		        // return transformed;
		      // }
        });
        
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