var should = chai.should();
var notice = function(){
                return{
                    headline: 'headline',
                    content: 'content',
                    pinnedUntil: new Date(),
                    boardId: 'board',
                    commentsAllowed: true
                };
            };


describe("Controllers", function(){
    describe("Notices controller", function(){
        it("should have addNotice function", function(){
            should.exist(Meteor.server.method_handlers.addNotice);
        });
        it("should throw an error without args", function(){
            (function () {
                Meteor.server.method_handlers.addNotice.call({userId:'fake'});
            }).should.Throw(Error);
        });
        it("should throw an error without headline", function(){
            (function () {
                var not = notice();
                delete not.headline;
                Meteor.server.method_handlers.addNotice.call({userId:'fake'}, not);
            }).should.Throw(Error);
        });
        it("should throw an error without content", function(){
            (function () {
                var not = notice();
                delete not.content;
                Meteor.server.method_handlers.addNotice.call({userId:'fake'}, not);
            }).should.Throw(Error);
        });
        it("should throw an error without boardId", function(){
            (function () {
                var not = notice();
                delete not.boardId;
                Meteor.server.method_handlers.addNotice.call({userId:'fake'}, not);
            }).should.Throw(Error);
        });
        it("should throw an error without commentsAllowed", function(){
            (function () {
                var not = notice();
                delete not.commentsAllowed;
                Meteor.server.method_handlers.addNotice.call({userId:'fake'}, not);
            }).should.Throw(Error);
        });
        it("should throw an error with all args for user not being logged in", function(){
            (function () {
                Meteor.server.method_handlers.addNotice(notice());
            }).should.Throw(Error);
        });
        it("should not throw an error with all args and fake user logged in", function(){
            (function () {
                Meteor.server.method_handlers.addNotice.call({userId:'fake'}, notice());
            }).should.not.Throw(Error);
        });
    });
});