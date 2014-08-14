var Future = Npm.require('fibers/future')

Meteor.methods({
  addAddress: function (options) {
    options = options || {};
    if (! (typeof options.streetAddress === "string" && options.streetAddress.length ))
        throw new Meteor.Error(400, "Address is missing");
    var address = {
        address: options.streetAddress.toLowerCase().trim().replace(/ /g, ''),
        displayAddress: options.streetAddress.trim() + ' ' + options.streetNumber,
        country:'',
        zipCode:'',
        streetAddress:'',
        streetNumber:''
    };
    var fut = new Future();
    Addresses.insert(address, function(err, _id){
        if(err)
            throw new Meteor.Error(500, "Adding of new address failed");
        else{
            Meteor.users.update({_id:Meteor.userId()}, {$addToSet:{'addresses':{
                _id : _id,
                verified: true
            }}}, function(err){
                address._id = _id;
                fut.return(address)
            })
        }
    });
    return fut.wait();
  }
});