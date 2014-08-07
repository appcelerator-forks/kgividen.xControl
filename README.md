xControl
========

This project is created using Appcelerator Titanium.

Easily control your Insteon devices.  List all of your Insteon devices and use an on/off button or a slider to adjust accordingly.  

Currently requires an ISY controller and you need the ip/dns and port number.  xControl will then automatically load all your Insteon devices and create a button with a slider for each device.  Currently this works best for lighting control.

This list view makes it easy to see which lights are on or off.  You can then turn them on or off or to a specific level with the slider.

Works across all platforms for a consistent UI look and feel.  

Future features will include new themes, auto-discovery and more.  Check http://www.netsmartcompany.com for details.

We have updated this code to be much better.  We have cleaned up a lot of code.  Here are some highlights:

Appcelerator Alloy is now used for a good MVC architecture
Promises (instead of callback craziness)
Underscore which we love.
Many other code enhancements since it's almost a rewrite of the entire code base.
