Template.address.boards = function(){
    return Hembu.collections.boards.find();
}

Template.address.addressId = function()
{
    return Hembu.methods.address.current.get()._id;
}
Template.address.events({
    'click #add-board': function(event, template){
        event.preventDefault();
        var board = $(template.find('#new-board')).serializeObject().board;
        Hembu.methods.boards.create(board, function(err, result){
            if(err){
                console.log(err)
            } 
            else{
                console.log(result)
            }
        });
    },
    'click .accent-colour-list li': function(event, template){
        var item = $(event.target).data('item');
        template.find('input[name="board[ui][accentColour]"]').value = 'accent-colour-' + item; 
        template.find('#board-colour').className = 'board-colour  accent-colour-' + item;
    }
})