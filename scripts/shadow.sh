osascript -e 'tell application "Terminal" to activate' -e 'tell application "Terminal" to do script "tishadow server" in selected tab of the front window'
osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'tell application "Terminal" to do script "cd /Users/kgividen/Data/Titanium/tishadowapp" in selected tab of the front window' -e 'tell application "Terminal" to do script "ti build -p ios" in selected tab of the front window'
#osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'tell application "Terminal" to do script "cd /Users/kgividen/Data/Titanium/tishadowapp" in selected tab of the front window' -e 'tell application "Terminal" to do script "titanium build -p android" in selected tab of the front window'
osascript -e 'tell application "Terminal" to activate' -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' -e 'tell application "Terminal" to do script "cd /Users/kgividen/Data/Titanium/xControlAlloy" in selected tab of the front window' -e 'tell application "Terminal" to do script "ulimit -n 8192" in selected tab of the front window' -e 'tell application "Terminal" to do script "tishadow @ run" in selected tab of the front window'