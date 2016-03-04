function LogoutUI(logout, getLoggedInUser) { 

	$("#logout").click(function() {
		logout();
		console.log("logging out");
	});
}