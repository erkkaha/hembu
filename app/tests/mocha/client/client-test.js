var should = chai.should();
if (typeof MochaWeb !== 'undefined'){
  MochaWeb.testOnly(function(){
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
                         should.exist(Hembu.collections.notices);
                     });
                     it("should give pinned boolean from transform function", function(){
                         should.exist(Hembu.collections.notices._transform);
                         Hembu.collections.notices._transform({_id:'foo'}).should.have.property('pinned');
                         Hembu.collections.notices._transform({_id:'foo'}).pinned.should.be.a('boolean');
                     });
                 });
                 describe("Boards", function(){
                     it("should have boards collection", function(){
                         should.exist(Hembu.collections.boards);
                     });
                 });
             });
             describe("Hembu", function(){
                 it("userHasAddress should return Boolean", function(){
                     Hembu.user.hasAddress.should.be.a('boolean');
                 });
                 describe("Notices", function(){
                     it("create should exist", function(){
                         should.exist(Hembu.methods.notices.create);
                     });
                     it("create should throw error without callback", function(){
                         (function () {Hembu.methods.notices.create()}).should.Throw(Error);
                     });
                     it("should pass error object to callback", function(){
                         (function () {Hembu.methods.notices.create({}, function(err, result){
                             should.exist(err);
                         })});
                     });
                     it("should pass result object to callback", function(){
                         (function () {Hembu.methods.notices.create({
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
     });
}
>>>>>>> a4df93e242cb91088cdc6cc48359f0aac3e6412e
