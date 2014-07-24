if ($model) {
    if($model.get($.deviceRow.viewName)){
        $.deviceRowSwitch.setValue(true);
    }else{
        $.deviceRowSwitch.setValue(false);
    }
}

$.deviceRowSwitch.addEventListener('change', function(e) {
    var viewName = $.deviceRow.viewName;
    if(viewName == "showInFavoritesView") {
        $model.set({
            showInFavoritesView: (e.value) ? 1 : 0
        }, {
            silent: true
        });
    } else if (viewName == "showInLightingView"){
        $model.set({
            showInLightingView: (e.value) ? 1 : 0
        }, {
            silent: true
        });
    } else if (viewName == "showInScenesView") {
        $model.set({
            showInScenesView: (e.value) ? 1 : 0
        }, {
            silent: true
        });
    }
});
