if ($model) {
    $.lightRow.model = $model.toJSON();
    var hideStyle = $.createStyle({
        classes: 'hide'
    });
    if($model.get('type') == "folder") {
        $.btn.applyProperties(hideStyle);
        $.slider.applyProperties(hideStyle);
        $.sliderLbl.applyProperties(hideStyle);
    }else{
        $.group.applyProperties(hideStyle);
    }

}

$.btn.addEventListener('click', function(e) {
    //We have to add a delay here cause the ISY will respond with a doc even though the light isn't at the right level and so we'd be off...
    Ti.API.info("e address: " + JSON.stringify(e.source.address));
    device.toggle(e.source.address).then(Alloy.Globals.updateStatus);
});

$.slider.addEventListener('touchend', function(e) {
    var level = Math.round(e.source.value);
    device.setLevel(e.source.address, level).then(Alloy.Globals.updateStatus);
    $.sliderLbl.text = level;

});