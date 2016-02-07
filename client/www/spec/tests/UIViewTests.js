$( document ).ready(function() {
	describe("UIView", function() {

	    var uiView, mock, changeData;

	    setUpDOMElements();

	    beforeEach(function() {
	    	mock = {
	    		registerListener: jasmine.createSpy('registerListener'),
	    		getData: jasmine.createSpy('getData')
	    	};
	    	changeData = jasmine.createSpy('changeData');
	    	
	    	uiView = new UIView(mock.getData, mock.registerListener);
			uiView.registerCallback("changeData", changeData);
	    });

	    it('should call the changeData callback on setAssets click', function() {
	        $("#setAssets").trigger("click");
	        expect(changeData).toHaveBeenCalled();
	    });

	});

	function setUpDOMElements() {
		addElement("button", "setAssets");
	}

	function addElement(type, id) {
		$("body").append("<" + type + " id='" + id + "'></" + type + ">")	
	}
});