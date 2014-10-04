window.Hembu = window.Hembu || {};
window.Hembu.methods = window.Hembu.methods || {};

Hembu.methods.address = {
    current: { 
        get:function(){
            if(Session.get('currentAddress')){
                return Session.get('currentAddress');
            }
            else{
                var addr = Addresses.findOne();
                return addr;
            }
        },
        set: function(address){
            Session.set('currentAddress', Addresses.findOne({address:address}));
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
    }
}