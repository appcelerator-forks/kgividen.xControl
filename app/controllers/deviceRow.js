if ($model) {
    $.deviceRow.model = $model.toJSON();
    var rowGroupStyle = $.createStyle({
        classes: 'groupRow'
    });
    if (osname == "ios") {
        if ($model.get('type') == "folder") {
            $.lightContainer.hide();
            $.sceneContainer.hide();
            $.deviceRow.applyProperties(rowGroupStyle);
        } else if ($model.get('type') == "scene") {
            $.lightContainer.hide();
            $.group.hide();
        } else if ($model.get('type') == "light") {
            $.sceneContainer.hide();
            $.group.hide();
        }
    } else {
        // OLD WAY.  with 3.3 hide() works correctly on ios but not android.
        var hideStyle = $.createStyle({
            classes: 'hide'
        });
        if ($model.get('type') == "folder") {
            $.lightContainer.applyProperties(hideStyle);
            $.sceneContainer.applyProperties(hideStyle);
            $.deviceRow.applyProperties(rowGroupStyle);
            $.deviceRow.className = "folder";
        } else if ($model.get('type') == "scene") {
            $.lightContainer.applyProperties(hideStyle);
            $.group.applyProperties(hideStyle);
            $.deviceRow.className = "scene";
        } else if ($model.get('type') == "light") {
            $.sceneContainer.applyProperties(hideStyle);
            $.group.applyProperties(hideStyle);
            $.deviceRow.className = "light";
        }
    }
}