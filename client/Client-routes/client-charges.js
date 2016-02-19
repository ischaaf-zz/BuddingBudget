var ChargeEntry = {
  name: {type: String, index: true, unique: true},
  amount: Number,
  period: Number,
  start: Date,
  isConfirm: Boolean
};

$.post(/*****SERVER*****,*/ChargeEntry/*CALLBACK?*****/),
    function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
});

var SaveCharges = $.ajax({
    url : "AJAX_POST_URL",
    type: "POST",
    data : ChargeEntry,
    success: function(data, textStatus, jqXHR)
    {
        //data - response from server
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
    SaveCharges.error(function() { alert("Something went wrong"); });
    }
});