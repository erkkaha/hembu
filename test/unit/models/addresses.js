(function () {

    "use strict";

    describe("Addresses model", function () {

        it("is only added once to the Meteor.Collection", function () {
            expect(Meteor.instantiationCounts.addresses).toBe(1);
        });

    });

})();