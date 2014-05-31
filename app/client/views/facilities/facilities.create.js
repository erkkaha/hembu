Template.facilitiesCreate.events({
    'click #create': function(event, template){
        event.preventDefault();
        var name = template.find('#name').value;
        var address = Hembu.getCurrentAddress().address
        Meteor.call('addFacility', {name:name, address:address}, function(err, result){
            if(err)
            {
                //TODO
            } 
            else{
                console.log(Hembu.getCurrentAddress())
                Router.go('facilities.list', {address:Hembu.getCurrentAddress().address})
            }
        })
    }
})