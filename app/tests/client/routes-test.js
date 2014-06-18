var should = chai.should();

describe("Client", function(){
    describe("Routes", function(){
        it("should have 9 routes", function(){
            Router.routes.length.should.equal(9);
        });
        it("root path should equal '/'", function(){
            Router.routes.root.originalPath.should.equal('/');
        });
        it("home path should equal '/home/:address/:board?'", function(){
            Router.routes.home.originalPath.should.equal('/home/:address/:board?');
        });
    });
});