#!/bin/sh
osascript -e 'tell application "Terminal" to activate' -e 'tell application "Terminal" to do script "tishadow server" in selected tab of the front window'
osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'tell application "Terminal" to do script "cd /Users/kgividen/Data/Titanium/xControl" in selected tab of the front window' -e 'tell application "Terminal" to do script "appc run -p ios --appify" in selected tab of the front window'
osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'tell application "Terminal" to do script "cd /Users/kgividen/Data/Titanium/xControl" in selected tab of the front window' -e 'tell application "Terminal" to do script "appc run -p android --device-id \"Samsung Galaxy S4 - 4.2.2 - API 17 - 1080x1920\" --appify" in selected tab of the front window'
osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'tell application "Terminal" to do script "cd /Users/kgividen/Data/Titanium/xControl" in selected tab of the front window' -e 'tell application "Terminal" to do script "ulimit -n 8192" in selected tab of the front window' -e 'tell application "Terminal" to do script "tishadow @ run" in selected tab of the front window'
