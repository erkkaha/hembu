var should = chai.should();
if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Server initialization", function(){
      it("should have a Meteor version defined", function(){
        chai.assert(Meteor.release);
      });
    });
  });
}
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
        describe("Boards", function(){
            it("should have boards collection", function(){
                should.exist(Boards);
            });
        });
    });
    describe("Hembu", function(){
        it("userHasAddress should return Boolean", function(){
            Hembu.userHasAddress().should.be.a('boolean');
        });
        describe("Notices", function(){
            it("create should exist", function(){
                should.exist(Hembu.notices.create);
            });
            it("create should throw error without callback", function(){
                (function () {Hembu.notices.create()}).should.Throw(Error);
            });
            it("should pass error object to callback", function(){
                (function () {Hembu.notices.create({}, function(err, result){
                    should.exist(err);
                })});
            });
            it("should pass result object to callback", function(){
                (function () {Hembu.notices.create({
                    headline: 'headline',
                    content: 'content',
                    pinnedUntil: new Date(),
                    boardId: 'board',
                    commentsAllowed: true
                }, function(err, result){
                    should.exist(result);
                })});
            });
            
        });
    });
});