if ($model) {
    if($model.get($.deviceRow.viewName)){
        $.deviceRowSwitch.setValue(true);
    }else{
        $.deviceRowSwitch.setValue(false);
    }
}

$.deviceRowSwitch.addEventListener('change', function(e) {
    var viewName = $.deviceRow.viewName;

    var obj = {};
    obj[viewName] = (e.value) ? 1 : 0;
    Ti.API.info("obj: " + JSON.stringify(obj));
    $model.set(obj, {
        silent: true
    });
});
