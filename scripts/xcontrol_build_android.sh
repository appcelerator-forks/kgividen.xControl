#!/bin/sh
export XCONTROL_PATH=/Users/kgividen/Data/Titanium/xControl
cd $XCONTROL_PATH
rm $XCONTROL_PATH/delivery/*.apk
appc ti clean
appc ti build -p android -T dist-playstore -K /Users/kgividen/.android/key/$1Keystore -P $2 -L xControl -O $XCONTROL_PATH/delivery/
mv $XCONTROL_PATH/delivery/$1.apk $XCONTROL_PATH/delivery/$1Unsigned.apk
jarsigner -verbose -storepass $2 -sigalg MD5withRSA -digestalg SHA1 -keystore ~/.android/key/$1Key $XCONTROL_PATH/delivery/$1Unsigned.apk $1
jarsigner -verify -verbose -certs $XCONTROL_PATH/delivery/$1Unsigned.apk
/Users/kgividen/apps/android/tools/zipalign -v 4 $XCONTROL_PATH/delivery/$1Unsigned.apk $XCONTROL_PATH/delivery/$1.apk
rm $XCONTROL_PATH/delivery/$1Unsigned.apk
cp $XCONTROL_PATH/delivery/$1.apk ~/Dropbox/Public/
