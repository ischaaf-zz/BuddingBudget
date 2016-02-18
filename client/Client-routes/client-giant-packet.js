var SavingsEntry = {
  name: {type: String, index: true, unique: true},
  amount: Number,
  isDefault: Boolean
};


.post(/*****SERVER*****,*/SavingsEntry/*CALLBACK?*****/),
    function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
});

var SaveSavingsEntry = $.ajax({
    url : "AJAX_POST_URL",
    type: "POST",
    data : SavingsEntry,
    success: function(data, textStatus, jqXHR)
    {
        //data - response from server
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
 
    }
});

// http://stackoverflow.com/questions/10214723/jquery-ajax-post-data