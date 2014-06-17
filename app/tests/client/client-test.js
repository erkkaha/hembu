var should = chai.should();

describe("Client", function(){
    it("should run on client", function(){
        Meteor.isClient.should.equal(true);
    });
    it("should have defaultOptions.rootUrl equal to window.location.host", function(){
        Meteor.absoluteUrl.defaultOptions.rootUrl.should.equal(window.location.host)
    });
    describe("Collections", function(){
        it("should have notices collection", function(){
            should.exist(Notices);
        });
    });
    describe("Hembu", function(){
        it("userHasAddress should return Boolean", function(){
            Hembu.userHasAddress().should.be.a('boolean')
        })
    })
});