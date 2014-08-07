xControl
========

This project is created using Appcelerator Titanium.

Easily control your Insteon devices.  List all of your Insteon devices and use an on/off button or a slider to adjust accordingly.
  
Here are some features:

 - List View making it easy to see what lights are on and off.
 - Sliders for dimming lights.
 - Favorites view, lighting view, scenes view.
 - Cross platform.  Works with iOS, Android, Kindle Fire

In this latest version we have made some major changes and cleaned up a lot of the code.

Here are some highlights:

 - Appcelerator Alloy is now used for a good MVC architecture
 - Promises (instead of callback craziness)
 - Underscore which we love.
 - Many other code enhancements since it's almost a rewrite of the entire code base.

Currently this requires an ISY controller and you need the ip/dns and port number.  xControl will then automatically load all your Insteon devices and create a button with a slider for each device.  Currently this works best for lighting control.
