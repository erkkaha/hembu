window.Hembu = window.Hembu || {};
window.Hembu.methods = window.Hembu.methods || {};

Hembu.methods.address = {
    current: { 
        get:function(){
            if(Session.get('currentAddress')){
                return Session.get('currentAddress');
            }
            else{
                var addr = Hembu.collections.addresses.findOne();
                return addr;
            }
        },
        set: function(address){
            Session.set('currentAddress', Hembu.collections.addresses.findOne({display:address}));
        },
        display: function(){
              return Session.get('currentAddress').display.replace(/ /g, '');
        }
    },
    create: function(address, done){
        Meteor.call('addAddress', {address:address}, function(err, result){
            if(err)
            {
                done(err);
            } 
            else{
                done(null, result);
            }
        });
    },
    find: function(address, done){
        Meteor.call('findAddress', {address:address}, function(err, result){
            if(err){
                done(err);
            }
            else{
                done(null, result);
            }
        });
    },
    join: function(address, done){
        Meteor.call('joinAddress', address, function(err, result){
            if(err){
                done(err);
            }
            else{
                done(null, result);
            }
        });
    }
}