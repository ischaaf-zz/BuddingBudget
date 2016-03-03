function TutorialUI(isTutorial, registerCallback, pageTransitions) {

	function joyStart(name) {		
		$(name).joyride({
			autoStart : true,
			modal: true,
			postRideCallback: function() {
				$(this).joyride('destroy');
			}
		});
	}

	function changePage(pageID, name) {
		pageTransitions.switchPage(pageID, function() {
			joyStart(name);
		});
	}
	
	function tutorialSetup() {
		changePage("page-tutorial");
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
			changePage("page-main");
			hideButtons();
			$("#menuBar").show();
		});
	};
	
	function hideButtons() {
		$("#page-assets-tutorial").hide();
		$("#page-savings-tutorial").hide();
		$("#page-income-tutorial").hide();
		$("#page-charges-tutorial").hide();
		$("#page-options-tutorial").hide();
		$("#page-login-tutorial").hide();
	}
	
	function showButtons() {
		//$("#page-assets-tutorial").show();
		$("#page-savings-tutorial").show();
		$("#page-income-tutorial").show();
		$("#page-charges-tutorial").show();
		//$("#page-options-tutorial").show();
		$("#page-login-tutorial").show();
	}

	registerCallback('updateAssets', function() {
		if(isTutorial) {
			$("#page-assets-tutorial").show();
		}
	});

	registerCallback('setEndDate', function() {
		if(isTutorial) {
			$("#page-options-tutorial").show();
			isTutorial = false;
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
	}

}