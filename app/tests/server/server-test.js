var should = chai.should();

describe("Server", function(){
    it("should run on server", function(){
        Meteor.isServer.should.equal(true);
    });
});