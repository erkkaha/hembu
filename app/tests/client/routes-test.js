var should = chai.should();

describe("Client", function(){
    describe("Routes", function(){
        it("should have 12 routes", function(){
            Router.routes.length.should.equal(12);
        });
        it("root path should equal '/'", function(){
            Router.routes.root.originalPath.should.equal('/');
        });
        it("home path should equal '/home/:addressParam/:boardParam?'", function(){
            Router.routes.home.originalPath.should.equal('/home/:addressParam/:boardParam?');
        });
    });
});