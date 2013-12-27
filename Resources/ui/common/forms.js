// "Constants"
exports.STYLE_HINT = 'hint';
exports.STYLE_LABEL = 'label';

exports.TYPE_DATE = 'date';
exports.TYPE_EMAIL = 'email';
exports.TYPE_NUMBER = 'number';
exports.TYPE_PASSWORD = 'password';
exports.TYPE_PHONE = 'phone';
exports.TYPE_PICKER = 'picker';
exports.TYPE_TEXT = 'text';
exports.TYPE_SUBMIT = 'submit';
exports.TYPE_BUTTON = 'button';
exports.TYPE_BASIC_PICKER = 'basic_picker';

var isAndroid = Ti.Platform.osname === 'android';
var textFieldDefaults = {
        height: '40dp',
        width: '250dp',
        top: '10dp',
        color: '#222',
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
};
var keyboardMap = {};
keyboardMap[exports.TYPE_EMAIL] = Ti.UI.KEYBOARD_EMAIL;
keyboardMap[exports.TYPE_NUMBER] = Ti.UI.KEYBOARD_NUMBER_PAD;
keyboardMap[exports.TYPE_PASSWORD] = Ti.UI.KEYBOARD_DEFAULT;
keyboardMap[exports.TYPE_PHONE] = Ti.UI.KEYBOARD_NUMBER_PAD;
keyboardMap[exports.TYPE_TEXT] = Ti.UI.KEYBOARD_DEFAULT;

var handleStyle = function(form, textField, title) {
        if (form.fieldStyle === exports.STYLE_HINT && textField) {
                textField.hintText = title;        
        } else {
        		var formLabel = Ti.UI.createLabel(form.props.formLabelProps)
                formLabel.text = title;
                form.container.add(formLabel); 
                if (textField) {
                        textField.top = '5dp';
                }
        }
};

var setupPickerTextField = function(textField, pickerType, data) {
        textField.editable = false;
        textField.rightButton = Ti.UI.createButton({
                style: Ti.UI.iPhone.SystemButton.DISCLOSURE,
                transform: Ti.UI.create2DMatrix().rotate(90)
        });
        textField.rightButtonMode = Ti.UI.INPUT_BUTTONMODE_ALWAYS;
        
        textField.addEventListener('focus', function(e) {
                e.source.blur(); 
                require('ui/common/semiModalPicker').createSemiModalPicker({
                        textField: textField,
                        value: textField.value,
                        type: pickerType,
                        data: data
                }).open({animated:true});
        });
};

var ctr = 1;
var addField = function(field, fieldRefs) {
        // var title = field.title || ('field' + ctr++);
        if (!field.title){
        	return;
        }
        var title = field.title;

        var id = field.id || title;
        var type = field.type || exports.TYPE_TEXT;
        var form = this;
        var fieldObject = undefined;
        
        if (type === exports.TYPE_TEXT ||
                type === exports.TYPE_EMAIL ||
                type === exports.TYPE_NUMBER ||
                type === exports.TYPE_PHONE ||
                type === exports.TYPE_PASSWORD) {
                fieldObject = Ti.UI.createTextField(textFieldDefaults);
                fieldObject.keyboardType = keyboardMap[type];
                fieldObject.passwordMask = type === exports.TYPE_PASSWORD;
                handleStyle(form, fieldObject, title);
        } else if (type === exports.TYPE_DATE) {
                if (isAndroid) {
                        fieldObject = Ti.UI.createPicker({
                                type: Ti.UI.PICKER_TYPE_DATE
                        });
                        handleStyle(form, undefined, title);
                } else {
                        fieldObject = Ti.UI.createTextField(textFieldDefaults);
                        handleStyle(form, fieldObject, title);
                        setupPickerTextField(fieldObject, Ti.UI.PICKER_TYPE_DATE);
                }
        } else if (type === exports.TYPE_PICKER) {
                if (isAndroid) {
                        fieldObject = Ti.UI.createPicker({
                                type: Ti.UI.PICKER_TYPE_PLAIN,
                                width: '250dp'
                        });
                        handleStyle(form, undefined, title);
                        for (var i in field.data) {
                                fieldObject.add(Ti.UI.createPickerRow({title:field.data[i]}));        
                        }
                } else {
                        fieldObject = Ti.UI.createTextField(textFieldDefaults);
                        handleStyle(form, fieldObject, title);
                        setupPickerTextField(fieldObject, Ti.UI.PICKER_TYPE_PLAIN, field.data);
                }
        } else if (type === exports.TYPE_SUBMIT) {
                var button = Ti.UI.createButton(form.props.formSubmitButton);
                button.title = title;
                button.addEventListener('click', function(e) {
                        var values = {};
                        for (var i in fieldRefs) {
                                values[i] = fieldRefs[i].value;        
                        }
                        form.fireEvent(id, {values:values});        
                });        
                form.container.add(button);
        } else if (type === exports.TYPE_BUTTON) {
                var button = Ti.UI.createButton(form.props.formButton);
                button.title = title;
                button.addEventListener('click', function(e) {
                        var values = {};
                        for (var i in fieldRefs) {
                                values[i] = fieldRefs[i].value;        
                        }
                        form.fireEvent(id, {values:values});        
                });        
                form.container.add(button);
                fieldRefs[id] = button;
        } else if (type == exports.TYPE_BASIC_PICKER){
        	var picker = Ti.UI.createPicker();
			var data = [];
			data[0]=Ti.UI.createPickerRow({title:field.data[0],id:field.data[0]});
			data[1]=Ti.UI.createPickerRow({title:field.data[1],id:field.data[1]});
			
			
			// turn on the selection indicator (off by default)
			picker.selectionIndicator = true;
			
			picker.add(data);
			
			form.container.add.add(picker);
						
			picker.addEventListener('change',function(e){
				Ti.API.info("You selected row: "+ e.row +", column: "+ e.column +", id: " + e.row.id);
                var values = {};
                for (var i in fieldRefs) {
                    values[i] = fieldRefs[i].value;        
                }
                form.fireEvent(id, {value: e.row.id});
			});
			
			//sets the starting selectedRow
			// picker.setSelectedRow(0,field.startup,true);
			picker.setSelectedRow(1,1,true);
        }
        
        // Add our prepared UI component to the form
        if (fieldObject) {
                form.container.add(fieldObject);
                fieldRefs[id] = fieldObject;
        }
};

var addFields = function(fields, fieldRefs) {
        for (var i in fields) {
                this.addField(fields[i], fieldRefs);
        }
};

exports.createForm = function(o) {
        var container = Ti.UI.createView({
                layout: 'vertical',
                height: 'auto'
        });
        var fieldRefs = {};
        var form = Ti.UI.createScrollView({
                contentHeight: 'auto',
                contentWidth: 'auto',
                showVerticalScrollIndicator:true,
                showHorizontalScrollIndicator:true,
            
                // new stuff
                container: container,
                fieldStyle: o.style || exports.STYLE_HINT,
                addField: addField,
                addFields: addFields,
                props: o.props
        });

        form.addFields(o.fields, fieldRefs);
        form.add(container);
        
        // Add this so each field can be accessed directly, if necessary
        form.fieldRefs = fieldRefs;
        
        return form;
};