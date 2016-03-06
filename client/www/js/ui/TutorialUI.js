function TutorialUI(isTutorial, registerCallback, pageTransitions) {

	this.tutorialChangePage = function(pageID, callback) {
		if(!isTutorial) {
			pageTransitions.switchPage(pageID, callback);
		}
	};

	function joyStart(name) {		
		$(name).joyride({
			autoStart : true,
			modal: true,
			postRideCallback: function() {
				$(this).joyride('destroy');
			}
		});
	}

	function changePage(pageID, name, callback) {
		pageTransitions.switchPage(pageID, function() {
			joyStart(name);
			callFunc(callback);
		});
	}

	function removeCurtain() {
		$("#curtain").hide();
		$("#main").fadeIn('fast');
	}

	function mainPageSetup() {
		changePage("page-main", false, removeCurtain);
	}
	
	function tutorialSetup() {
		changePage("page-tutorial", false, removeCurtain);
		$("#page-tutorial").show();
		$("#menuBar").hide();
		
		$("#yesTutorial").click(function() {
			changePage("page-login", "#joyRideLogin");
			showButtons();
		});
		
		$("#page-login-tutorial").click(function() {
			changePage("page-assets", "#joyRideAssets");
		});
		
		$("#page-assets-tutorial").click(function() {
			changePage("page-savings", "#joyRideSavings");
		});
		
		$("#page-savings-tutorial").click(function() {
			changePage("page-income", "#joyRideIncome");
		});
		
		$("#page-income-tutorial").click(function() {
			changePage("page-charges", "#joyRideCharges");
		});
		
		$("#page-charges-tutorial").click(function() {
			changePage("page-options", "#joyRideOptions");
		});
		
		$("#page-options-tutorial").click(function() {
			changePage("page-tracking", "#joyRideTracking");
		});
		
		$("#page-tracking-tutorial").click(function() {
			changePage("page-main");
			hideButtons();
			$("#menuBar").show();
			isTutorial = false;
		});
	}
	
	function hideButtons() {
		$("#page-assets-tutorial").hide();
		$("#page-savings-tutorial").hide();
		$("#page-income-tutorial").hide();
		$("#page-charges-tutorial").hide();
		$("#page-options-tutorial").hide();
		$("#page-login-tutorial").hide();
		$("#page-tracking-tutorial").hide();
	}
	
	function showButtons() {
		//$("#page-assets-tutorial").show();
		$("#page-savings-tutorial").show();
		$("#page-income-tutorial").show();
		$("#page-charges-tutorial").show();
		//$("#page-options-tutorial").show();
		$("#page-login-tutorial").show();
		$("#page-tracking-tutorial").show();
	}

	// If we're in tutorial mode, show the next button once
	// we've entered a valid asset value
	registerCallback('assetsUpdatedSuccess', function() {
		if(isTutorial) {
			$("#page-assets-tutorial").show();
		}
	});

	// If we're in tutorial mode, show the end date button
	// once we've entered an end date button
	registerCallback('endDateChangedSuccess', function() {
		if(isTutorial) {
			$("#page-options-tutorial").show();
			//isTutorial = false;
		}
	});

	$("#joyPop").hide();
	hideButtons();

	if(isTutorial) {
		//setup Tutorial
		
		tutorialSetup();
		
		$("#noTutorial").click(function() {
			pageTransitions.switchPage("page-main");
			$("#menuBar").show();
			isTutorial = false;
		});
	} else {
		mainPageSetup();
	}

}