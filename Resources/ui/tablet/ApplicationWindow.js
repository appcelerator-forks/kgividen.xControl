//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var ListView = require('ui/common/ListView');
	var FloorPlanView = require('ui/common/FloorPlanView');
	// var SettingsWindow = require('ui/common/SettingsWindow');	

	//create component instance
	var self = Ti.UI.createWindow({
		backgroundImage : 'images/metal-bg.png',
		navBarHidden : true
	});
	
	self.orientationModes = [
		Titanium.UI.PORTRAIT,
		Titanium.UI.UPSIDE_PORTRAIT,
	    Titanium.UI.LANDSCAPE_LEFT,
	    Titanium.UI.LANDSCAPE_RIGHT
	];	

//****************SETTINGS VIEW PROPERTIES***********************
	
	var settingsViewProps = {
		formProps : {
			backgroundColor : '#ddd',
			height: '100%',
			width: '100%',
			color: 'white'
		},	
		formLabelProps : {
			top: '5dp',
            left: '35dp',
            color: '#222',
            font: {
                    fontSize: '16dp',
                    fontWeight: 'bold'
            },
            height: 'auto',
            width: 'auto'
		},
		formButton : {
            height: '40dp',
            width: '220dp',
            top:'20dp'
    	},
		formSubmitButton : {
	        height: '40dp',
	        width: '100dp',
	        top:'20dp'
	
		}	
	}
	
//****************LIST VIEW PROPERTIES***********************
	var listView = new ListView({
		settingsViewProps : settingsViewProps,
		openSettingsBtnProps : {
			top : 1,
			height: 60,
			width: 60,
			left : '92%',
			dest : 'settings',
			backgroundColor: 'transparent',
			backgroundImage: '/images/applications_system.png'
		},
		deviceBtnProps : {
			color: '#fff',
			width : '40%',
			height : '100%',
			left : 5,
			font : {
				fontSize : '35%',
				fontWeight : 'bold',
				fontFamily : 'Helvetica Neue'
			},
			backgroundImage : '/images/btn.png',
			backgroundSelectedImage : '/images/btn-hover.png',
			selectedImage : '/images/btn-hover.png',
			onImage : '/images/btn-active.png',
			offImage : '/images/btn.png',
			type : 'button'
		},
		deviceSceneOnBtnProps : {
			title: 'On',
			color: '#fff',
			width : '15%',
			height : '100%',
			left : '50%',
			font : {
				fontSize : '35%',
				fontWeight : 'bold',
				fontFamily : 'Helvetica Neue'
			},
			backgroundImage : '/images/btn.png',
			backgroundSelectedImage : '/images/btn-hover.png',
			selectedImage : '/images/btn-hover.png',
			onImage : '/images/btn-active.png',
			offImage : '/images/btn.png',
			type : 'scene'
		},
		deviceSceneOffBtnProps : {
			title : 'Off',
			color: '#fff',
			width : '15%',
			height : '100%',
			left : '75%',
			font : {
				fontSize : '35%',
				fontWeight : 'bold',
				fontFamily : 'Helvetica Neue'
			},
			backgroundImage : '/images/btn.png',
			backgroundSelectedImage : '/images/btn-hover.png',
			selectedImage : '/images/btn-hover.png',
			onImage : '/images/btn-active.png',
			offImage : '/images/btn.png',
			type : 'scene'
		},
		deviceSceneLabelProps : {
			color : 'white',
			font : {
				fontFamily : 'Helvetica Neue',
				fontSize : '30%'
			},
			textAlign : 'left',
			width : '40%',
			height : 'auto',
			left : 15
		},
		
		deviceTableViewProps : {
			top:'40dp',
			separatorColor: 'transparent',
			backgroundColor: 'transparent',
			left:10,
			borderWidth:0,
			zIndex: 0
		},
		parentSeparatorProps : {
			color : 'white',
			font : {
				fontSize : '35%'
			},
			height : '75%',
			width : '100%',
			left : 5,
			textAlign : 'left'
		},
		deviceSliderProps : {
			min : 0,
			max : 100,
			value : 0,
			width : '45%',
			// height : '50%',
			left : '45%',
			thumbImage : '/images/metal-slider-handle.png',
			leftTrackImage : '/images/metal-slider-progress.png',
			rightTrackImage : '/images/metal-slider-channel.png',
			type : 'slider'
		},
		deviceSliderLabelProps : {
			text : '0',
			color : '#999',
			font : {
				fontFamily : 'Helvetica Neue',
				fontSize : '30%'
			},
			textAlign : 'left',
			width : '30%',
			height : 'auto',
			left : '92%'
		},
		deviceRowProps : {
			height : '80dp',
			selectionStyle : 'none',
			className: 'buttonSlider'
		},
		refreshBtnProps : {
			height : 60,
			width : 60,
			top : 4,
			left : 4,
			backgroundImage : '/images/glyphicons_081_refresh.png'
		}		
	},self);
	var floorPlanView = new FloorPlanView();
	
	//Default filename for the floorplan view	
	// var filename = Titanium.Filesystem.applicationDataDirectory + "/" + new Date().getTime() + ".jpg";
	Ti.App.Properties.setString("backgroundFilename", "images/metal-bg.png");

	var scrollView = Titanium.UI.createScrollableView({
		// views:[listView,floorPlanView],
		views:[listView],
		// showPagingControl:true,
		pagingControlHeight:30,
		mainScroller:true,
		maxZoomScale:2.0,
		currentPage:0,
		lastPage:0
	});
	
				
	scrollView.addEventListener('scrollend', function(e){
	    if( !e.source.mainScroller || (e.source.lastPage == e.currentPage) ){
	      return;
	    }
	 
	    //Fire blur action on view we have just exited
	    e.source.views[ e.source.lastPage ].fireEvent('myBlur',{ 'scroller': e.source });
	 
	    //Fire focus action on view we are entering
	    e.source.views[ e.currentPage ].fireEvent('myFocus',{ 'scroller': e.source });
	 
	    //Change lastPage to currentPage
	    e.source.lastPage = e.currentPage;
 
	});
	
	self.add(scrollView);
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
