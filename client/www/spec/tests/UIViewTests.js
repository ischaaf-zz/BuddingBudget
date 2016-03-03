$( document ).ready(function() {

	describe("UIView", function() {

	    var uiView, mock, mockController, dataListeners;

	    setUpDOMElements();

	    beforeEach(function() {
	    	dataListeners = {};

	    	mock = {
	    		getData : jasmine.createSpy('getData'),
	    		setDataListener : function(event, cb) {
	    			dataListeners[event] = dataListeners[event] || [];
	    			dataListeners[event].push(cb);
	    		},
	    		login : jasmine.createSpy('login'),
	    		createUser : jasmine.createSpy('createUser')
	    	};

	    	mockController = {
				updateAssets : jasmine.createSpy('updateAssets'),
				trackSpending : jasmine.createSpy('trackSpending'),
				setOption : jasmine.createSpy('setOption'),
				setEndDate : jasmine.createSpy('setEndDate'),
				addEntry : jasmine.createSpy('addEntry'),
				changeEntry : jasmine.createSpy('changeEntry'),
				removeEntry : jasmine.createSpy('removeEntry')
	    	};

	    	uiView = new UIView(mock.getData, mock.setDataListener, mock.login, mock.createUser, mock.setNetworkListener);

	    	uiView.registerCallback('updateAssets', mockController.updateAssets);
			uiView.registerCallback('trackSpending', mockController.trackSpending);
			uiView.registerCallback('setOption', mockController.setOption);
			uiView.registerCallback('setEndDate', mockController.setEndDate);
			uiView.registerCallback('addEntry', mockController.addEntry);
			uiView.registerCallback('changeEntry', mockController.changeEntry);
			uiView.registerCallback('removeEntry', mockController.removeEntry);
	    });

	    function fireDataListeners(event, args) {
			var callbackArr = dataListeners[event] || [];
			for(var i = 0; i < callbackArr.length; i++) {
				callbackArr[i].apply(window, args);
			}
		}

		describe('mockTest', function() {

			it('should pass kyle\'s test', function() {
				mock.getData.and.returnValue(5);
				fireDataListeners('budget');
				expect($('#budget').html()).toEqual('$5');
			});

			it("should update on button click", function() {
				$("buttonAssets").click();
				
			});

		});

	});

	function setUpDOMElements() {
		addElement("p", "budget");
		addElement('button', 'buttonAssets');
	}

	function addElement(type, id) {
		$("body").append("<" + type + " id='" + id + "'></" + type + ">")	
	}

});