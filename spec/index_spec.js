// Create a test suite
describe("Index Test Suite", function() {

    // we need to require alloy so we can access the controllers.
    var Alloy = require("alloy");
    var $;
    beforeEach(function() {
        $ = Alloy.createController("index");
    });

    // All UI elements that we will be testing are accessable
    // via the __view property of the controller.
    describe("can open and have correct fields", function() {
        // Defined a new test case.
//        it("should exist", function() {
//            runs(function () {
//                // Confirm whether the label updates as expected.
////                expect($.win).toBeDefined();
//            });
//        });
    });
});