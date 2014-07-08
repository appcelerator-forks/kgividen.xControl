if ($model) {
//    Ti.API.info("ROW MODEL: " + JSON.stringify($model));
    if($model.get('showInLightingView')){
        $.lightSwitch.setValue(true);
    }else{
        $.lightSwitch.setValue(false);
    }
}

$.lightSwitch.addEventListener('change', function(e) {
    $model.set({
            showInLightingView: (e.value) ? 1 : 0
        },{
           silent: true
    });
});
