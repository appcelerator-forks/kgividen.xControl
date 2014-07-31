if ($model) {
    var showInViewName = $.deviceRow.showInViewName;
    if($model.get(showInViewName)){
        $.deviceRowSwitch.setValue(true);
    }else{
        $.deviceRowSwitch.setValue(false);
    }
//    var obj = {};
//
//    var blah = showInViewName + "SortId";
//    Ti.API.info("combined showINView and sortID: " + blah);
//    if (osname == "android"){
////        $.deviceRowSortId.value = $model.get(blah);
//    }
}

$.deviceRowSwitch.addEventListener('change', function(e) {
    var viewName = $.deviceRow.showInViewName;
    Ti.API.info("showInViewName: " + viewName);
    var obj = {};
    obj[viewName] = (e.value) ? 1 : 0;
    $model.set(obj, {
        silent: true
    });
});
