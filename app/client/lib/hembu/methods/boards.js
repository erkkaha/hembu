window.Hembu = window.Hembu || {};
window.Hembu.methods = window.Hembu.methods || {};

Hembu.methods.boards = {
    create: function(board, done){
        Hembu.collections.boards.insert(board, function(err, result){
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