var should = chai.should();

Meteor.user = function(){
    return Meteor.users.findOne();
};


describe("Server", function(){
    it("should run on server", function(){
        Meteor.isServer.should.equal(true);
    });
});