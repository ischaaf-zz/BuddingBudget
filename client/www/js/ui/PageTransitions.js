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
			$("#page-tutorial").hide();
			$("#page-main").show();
			activePage = "page-main";
			$("#menuBar").show();
			firstOpen = false;
		});
		
		$("#yesTutorial").click(function() {
			$("#page-tutorial").hide();
			$("#page-assets").show();
			activePage = "page-assets";
			showButtons();
		});
		
		$("#page-assets-tutorial").click(function() {
			$("#page-assets").hide();
			$("#page-savings").show();
			activePage = "page-savings";
		});
		
		$("#page-savings-tutorial").click(function() {
			$("#page-savings").hide();
			$("#page-income").show();
			activePage = "page-income";
		});
		
		$("#page-income-tutorial").click(function() {
			$("#page-income").hide();
			$("#page-charges").show();
			activePage = "page-charges";
		});
		
		$("#page-charges-tutorial").click(function() {
			$("#page-charges").hide();
			$("#page-options").show();
			activePage = "page-options";
		});
		
		$("#page-options-tutorial").click(function() {
			$("#page-options").hide();
			$("#page-main").show();
			activePage = "page-main";
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