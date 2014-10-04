window.Hembu = window.Hembu || {};
window.Hembu.methods = window.Hembu.methods || {};

Hembu.methods.notices = {
    create:function(notice, done){
        if(!done)
            throw new Meteor.Error(400, "callback is required");
        Meteor.call('addNotice', notice, function(err, result){
            if(err)
            {
                done(err);
            } 
            else{
                done(null, result);
            }
        }); 
        
    },
    pin:function(args, done){
        if(!done)
            throw new Meteor.Error(400, "callback is required");
        Meteor.call('pinNotice', args, function(err, result){
            if(err)
            {
                done(err);
            } 
            else{
                done(null, result);
            }
        });
    },
    comment: function(args, done){
        if(!done)
            throw new Meteor.Error(400, "callback is required");
        Meteor.call('addComment', {
            content: args.content,
            noticeId: args.notice._id
        }, function(err, comment){
            if(err){
                done(err)
            }
            else{
                done(null, comment);
            }
        });        
    }
};
