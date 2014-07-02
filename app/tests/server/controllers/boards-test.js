var should = chai.should();
var board = function(){
                return{
                    name: 'Notice Board',
                    addressId: 'addressId',
                    ui:{
                        accentColour: {
                            r: 100,
                            g: 100,
                            b: 100,
                            a: .5
                        }
                    }
                };
            };


describe("Controllers", function(){
    describe("Boards controller", function(){
        it("should have addBoard function", function(){
            should.exist(Meteor.server.method_handlers.addBoard);
        });
        it("should throw an error without args", function(){
            (function () {
                Meteor.server.method_handlers.addBoard.call({userId:'fake'});
            }).should.Throw(Error);
        });
        it("should throw an error without name", function(){
            (function () {
                var b = board();
                delete b.name;
                Meteor.server.method_handlers.addBoard.call({userId:'fake'}, b);
            }).should.Throw(Error);
        });
        it("should throw an error with name 'notice'", function(){
            (function () {
                var b = board();
                b.name = "notice"
                Meteor.server.method_handlers.addBoard.call({userId:'fake'}, b);
            }).should.Throw(Error);
        });
        it("should throw an error without addressId", function(){
            (function () {
                var b = board();
                delete b.addressId;
                Meteor.server.method_handlers.addBoard.call({userId:'fake'}, b);
            }).should.Throw(Error);
        });
        
        it("should throw an error with all args for user not being logged in", function(){
            (function () {
                Meteor.server.method_handlers.addBoard(board());
            }).should.Throw(Error);
        });
        it("should not throw an error with all args and fake user logged in", function(){
            (function () {
                Meteor.server.method_handlers.addBoard.call({userId:'fake'}, board());
            }).should.not.Throw(Error);
        });
    });
});