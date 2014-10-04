window.Hembu = window.Hembu || {};

Hembu.error =  function(err, howl){
        if(howl){
            $.UIkit.notify(err.reason, {pos:'top-right'});
        }
        console.log(err);
    };
