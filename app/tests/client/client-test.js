var should = chai.should();

describe("Client", function(){
    it("should run on client", function(){
        Meteor.isClient.should.equal(true);
    });
    it("should have defaultOptions.rootUrl equal to window.location.host", function(){
        Meteor.absoluteUrl.defaultOptions.rootUrl.should.equal(window.location.host)
    });
    describe("Collections", function(){
        describe("Notices", function(){
            it("should have notices collection", function(){
                should.exist(Notices);
            });
            it("should give pinned boolean from transform function", function(){
                should.exist(Notices._transform);
                Notices._transform({_id:'foo'}).should.have.property('pinned');
                Notices._transform({_id:'foo'}).pinned.should.be.a('boolean');
            });
        });
    });
    describe("Hembu", function(){
        it("userHasAddress should return Boolean", function(){
            Hembu.userHasAddress().should.be.a('boolean')
        })
    })
});