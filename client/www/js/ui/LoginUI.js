function LoginUI(login, createUser, switchPage) {

	$("#login").click(function() {
		var un = $("#username").val();
		var pw = $("#password").val();

		login(un, pw, function() {
			$("#titleText").notify("Successfully logged in.", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
			document.getElementById("username").value = "";
			document.getElementById("password").value = "";
			pageTransitions.switchPage("page-main");
	    }, function(response) {
			var json = response.responseJSON;
			if(response.status == 422 || response.status == 401 || response.status == 500) {
				$("#titleText").notify(json.message, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
			} else {
				$("#titleText").notify("ERROR", {position:"bottom center", autoHideDelay:1500, arrowShow:false});
			}
		});

		$("#page-login-tutorial").html("NEXT");
	});

	$("#password").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#login").click();
		}
	});

	$("#addUser").click(function() {
		var name = $("#newName").val();
		$("#newName").value = "";
		var un = $("#newUsername").val();
		$("#newUsername").value = "";
		var pw = $("#newPassword").val();
		$("#newPassword").value = "";
		var pwv = $("#newPasswordVerify").val();
		$("#newPasswordVerify").value = "";

		if(pw == pwv) {
			createUser(un, pw, name, 
			function() {
				$("#titleText").notify("CREATE USER SUCCESS", {position:"bottom center", className:"success", autoHideDelay:1500, arrowShow:false});
			}, function(response) {
				console.log(response);
				var json = response.responseJSON;
				for(var property in json) {
					if(response.status == 422 || response.status == 401) {
					$("#titleText").notify("Invalid " + property, {position:"bottom center", autoHideDelay:1500, arrowShow:false});
					} else if(response.status == 500) {
						$("#titleText").notify("Username taken", {position:"bottom center", autoHideDelay:1500, arrowShow:false});
					} else {
						$("#titleText").notify("ERROR", {position:"bottom center", autoHideDelay:1500, arrowShow:false});
					}
					break;
				}
			}); 
		}

		$("#page-login-tutorial").html("NEXT");
	});

}