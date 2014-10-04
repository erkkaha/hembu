window.Hembu = window.Hembu || {};
window.Hembu.methods = window.Hembu.methods || {};

Hembu.methods.notices = {
    create:function(notice, callback){
        if(!callback)
            throw new Meteor.Error(400, "callback is required");
        Meteor.call('addNotice', notice, function(err, result){
            if(err)
            {
                callback(err);
            } 
            else{
                callback(null, result);
            }
        }); 
        
    },
    pin:function(args, callback){
        if(!callback)
            throw new Meteor.Error(400, "callback is required");
        Meteor.call('pinNotice', args, function(err, result){
            if(err)
            {
                callback(err);
            } 
            else{
                callback(null, result);
            }
        });
    }
};
