var should = chai.should();

describe("Model", function(){
    describe("Notices Collection", function(){
        it("should exist", function(){
            should.exist(Notices);
        });
    });
    describe("Boards Collection", function(){
        it("should exist", function(){
            should.exist(Boards);
        });
    });
});