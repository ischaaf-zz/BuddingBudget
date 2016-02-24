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
		"page-tutorial" : "Tutorial"
	};

	// The page currently being displayed
	var activePage;

	this.switchPage = function(pageID) {
		if(activePage !== pageID) {
			$("#" + activePage).fadeOut("fast", function() {
				$("#titleText").text(pages[pageID]);
				$("#" + pageID).fadeIn("fast");
			});
			activePage = pageID;
		}
	};

	// Set the onclick for a pageID's button to fade to
	// the given page.
	function setUpPageSwitch(pageID) {
		//var pageIDs = Object.keys(pages);
		$("#" + pageID + "-button").click(function() {
			self.switchPage(pageID);
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
	
	this.tutorialSetup = function() {
		$("#page-main").hide();
		$("#menuBar").hide();
		$("#page-tutorial").show();
		activePage = "page-tutorial";
		
		$("#noTutorial").click(function() {
			self.switchPage("page-main");
			$("#menuBar").show();
			firstOpen = false;
		});
		
		$("#yesTutorial").click(function() {
			self.switchPage("page-assets");
			showButtons();
		});
		
		$("#page-assets-tutorial").click(function() {
			self.switchPage("page-savings");
		});
		
		$("#page-savings-tutorial").click(function() {
			self.switchPage("page-income");
		});
		
		$("#page-income-tutorial").click(function() {
			self.switchPage("page-charges");
		});
		
		$("#page-charges-tutorial").click(function() {
			self.switchPage("page-options");
		});
		
		$("#page-options-tutorial").click(function() {
			self.switchPage("page-main");
			hideButtons();
			$("#menuBar").show();
		});
	}
	
	function hideButtons() {
		$("#page-assets-tutorial").hide();
		$("#page-savings-tutorial").hide();
		$("#page-income-tutorial").hide();
		$("#page-charges-tutorial").hide();
		$("#page-options-tutorial").hide();
	}
	
	function showButtons() {
		$("#page-assets-tutorial").show();
		$("#page-savings-tutorial").show();
		$("#page-income-tutorial").show();
		$("#page-charges-tutorial").show();
		$("#page-options-tutorial").show();
	}
	
};