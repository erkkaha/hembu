var should = chai.should();
if (typeof MochaWeb !== 'undefined'){
  MochaWeb.testOnly(function(){
      describe("Templates", function(){
          describe("Feed", function(){
              it("should return 'pinned' or 'unpinned' from pinnedClass function", function(){
                  should.exist(Template.feed.pinnedClass);
                  Template.feed.pinnedClass.call({pinned:false}).should.equal('unpinned');
                  Template.feed.pinnedClass.call({pinned:true}).should.equal('pinned');
              });
          });
      });
  });
}