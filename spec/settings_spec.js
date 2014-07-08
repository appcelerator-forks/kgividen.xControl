// Create a test suite
describe("Settings Win Test Suite", function() {

    // we need to require alloy so we can access the controllers.
    var Alloy = require("alloy");
    var $;
    beforeEach(function() {
        $ = Alloy.createController("settings");
    });

    // All UI elements that we will be testing are accessable
    // via the __view property of the controller.
    describe("can open and have correct fields", function() {
        // Defined a new test case.
        it("should have correct fields and buttons", function() {
            runs(function () {
                // Confirm whether the label updates as expected.
                expect($.server.hintText).toEqual("Server IP/DNS");
                expect($.method.hintText).toEqual("HTTP or HTTPS");
                expect($.closeBtn.title).toEqual("Save and Close");
            });
        });
    });
});