var args = arguments[0] || {};

var loadFoldersCallback = function(){};

/**
 * function set on the init of the view so args can be passed from the parent view.
 * @param  {Object} args Event
 */
$.init = function(args){
    loadFoldersCallback = args.loadFoldersCallback;
};
/**
 * event listener set on view to open the devices view so devices can be added to the folder.
 * @param  {Object} e Event
 */
function loadFolders(e) {
   loadFoldersCallback(e);
}