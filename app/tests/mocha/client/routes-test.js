var should = chai.should();
if (typeof MochaWeb !== 'undefined'){
  MochaWeb.testOnly(function(){
      describe("Client", function(){
          describe("Routes", function(){
              it("should have 12 routes", function(){
                  Hembu.router.routes.length.should.equal(8);
              });
              it("home path should equal '/:address?/:board?'", function(){
                  Hembu.router.routes.home.originalPath.should.equal('/:address?/:board?');
              });
          });
      });
  });
}