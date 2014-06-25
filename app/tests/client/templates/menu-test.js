var should = chai.should();

describe("Templates", function(){
    describe("Menu", function(){
        it("should return profile", function(done){
            should.exist(Template.menu.profile);
            this.timeout(5000);
            //Wait for userData to load
            Meteor.setTimeout(function(){
                if(Meteor.user())
                    Template.menu.profile.call().should.be.an('object');
                else
                    should.not.exist(Template.menu.profile.call());
                done();
            }, 3000);
        });
        it("should return currentAddress", function(done){
            should.exist(Template.menu.address);
            this.timeout(5000);
            //Wait for address collection to load
            Meteor.setTimeout(function(){
                Template.menu.address.call().should.be.an('object');
                done();
            }, 3000);
        });
        it("should return url for board links", function(done){
            this.timeout(5000);
            should.exist(Template.menu.boardUrl);
            //Wait for address collection to load
            Meteor.setTimeout(function(){
                Template.menu.boardUrl.call({name:new String("noticeboard")}).should.be.a('string');
                Template.menu.boardUrl.call({name:new String("noticeboard")}).should.equal(Router.url('home', {address:Hembu.getCurrentAddress().address, board:"noticeboard"}))
                done();
            }, 3000);
        });
    });
});
