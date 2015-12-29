"use strict";

var wd = require("wd");

describe("Test Opening Settings Page", function () {
    this.timeout(300000);
    var driver;
    var allPassed = true;



    before(function () {
        driver = wd.promiseChainRemote("localhost", 4723);

        var desired = {
            "appium-version": "1.0",
            platformName: "Android",
            platformVersion: "4.4",
            deviceName: "",
            app: "/Users/kgividen/Data/Titanium/xControl/delivery/xControl.temp.apk",
            "app-package": "com.netsmartcompany.xControl",
            "app-activity": ".XcontrolActivity"
        };
        return driver
            .init(desired)
            .setImplicitWaitTimeout(3000);
    });

  after(function () {
    return driver
        .quit()
        .finally(function () {
        });
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it("should find all of the settings", function () {
    return driver
        .elementByXPath("//android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.LinearLayout[3]/android.widget.LinearLayout[1]/android.widget.Button[1]")
            .click()
		.elementByXPath("//android.view.View[1]/android.widget.FrameLayout[2]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[1]/android.view.View[2]/android.widget.FrameLayout[1]/android.widget.EditText[1]")
            .sendKeys("192.168.111.4")
        .elementByXPath("//android.view.View[1]/android.widget.FrameLayout[2]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[1]/android.view.View[3]/android.widget.FrameLayout[1]/android.widget.EditText[1]")
            .sendKeys("http")
        .elementByXPath("//android.view.View[1]/android.widget.FrameLayout[2]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[1]/android.view.View[4]/android.widget.FrameLayout[1]/android.widget.EditText[1]")
            .sendKeys("80")
        .elementByXPath("//android.view.View[1]/android.widget.FrameLayout[2]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[1]/android.view.View[5]/android.widget.FrameLayout[1]/android.widget.EditText[1]")
            .sendKeys("kgividen")
        .elementByXPath("//android.view.View[1]/android.widget.FrameLayout[2]/android.view.View[1]/android.view.View[1]/android.widget.ScrollView[1]/android.view.View[1]/android.view.View[6]/android.widget.FrameLayout[1]/android.widget.EditText[1]")
            .sendKeys("netsmart");
  });
});