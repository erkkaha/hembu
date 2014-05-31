Template.addressesCreate.events({
    'click #create': function(event, template){
        event.preventDefault();
        var address = template.find('#address').value;
        Meteor.call('addAddress', {streetAddress:address}, function(err, result){
            if(err)
            {
                //TODO
            } 
            else{
                console.log(result)
                Session.set('currentAddress', result)
                Router.go('home', {address:result.address})
            }
        })
    }
})