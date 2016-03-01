//----------------------------------------------//
// Handles page transitions
//----------------------------------------------//

var PageTransitions = function() {

	var self = this;

	// A mapping of each page to the user-facing
	// name of the page
	var pages = {
		"page-main" : "Daily Budget",
		"page-assets" : "Assets",
		"page-savings" : "Savings",
		"page-charges" : "Recurring Charges",
		"page-income" : "Recurring Income",
		"page-tracking" : "Track Spending",
		"page-options" : "Options",
		"page-tutorial" : "Tutorial",
		"page-login" :"Login"
	};

	// The page currently being displayed
	var activePage;

	this.switchPage = function(pageID, name) {
		if(activePage !== pageID) {
			$("#" + activePage).fadeOut("fast", function() {
				$("#titleText").text(pages[pageID]);
				$("#" + pageID).fadeIn("fast");
				if(name !== undefined) {
					joyStart(name);
				}
			});
			activePage = pageID;
		}
	};

	// Set the onclick for a pageID's button to fade to
	// the given page.
	function setUpPageSwitch(pageID) {
		//var pageIDs = Object.keys(pages);
		$("#" + pageID + "-button").click(function() {
			self.switchPage(pageID, null);
		});
	}

	// Set up page switches, and set starting page
	// to the main budget page
    function initialSetup() {
    	var pageIDs = Object.keys(pages);
    	for(var i = 0; i < pageIDs.length; i++) {
    		setUpPageSwitch(pageIDs[i]);
    		$("#" + pageIDs[i]).hide();
    	}
    	$("#page-main").show();
    	$("#titleText").text(pages["page-main"]);
    	activePage = "page-main";
		hideButtons();
    }
	
	initialSetup();
	
	//--tutorial page transitions--
	
	function joyStart(name) {		
		$(name).joyride({
			autoStart : true,
			modal: true,
			postRideCallback: function() {
				$(this).joyride('destroy');
			}
		});
	}
	
	this.tutorialSetup = function() {
		$("#page-main").hide();
		$("#menuBar").hide();
		$("#page-tutorial").show();
		activePage = "page-tutorial";
		
		$("#yesTutorial").click(function() {
			self.switchPage("page-login", "#joyRideLogin");
			showButtons();
		});
		
		$("#page-login-tutorial").click(function() {
			self.switchPage("page-assets", "#joyRideAssets");
		});
		
		$("#page-assets-tutorial").click(function() {
			self.switchPage("page-savings", "#joyRideSavings");
		});
		
		$("#page-savings-tutorial").click(function() {
			self.switchPage("page-income", "#joyRideIncome");
		});
		
		$("#page-income-tutorial").click(function() {
			self.switchPage("page-charges", "#joyRideCharges");
		});
		
		$("#page-charges-tutorial").click(function() {
			self.switchPage("page-options", "#joyRideOptions");
		});
		
		$("#page-options-tutorial").click(function() {
			self.switchPage("page-main");
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
	
};