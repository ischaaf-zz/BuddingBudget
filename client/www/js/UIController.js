var UIController = function(dataManager, registerUICallback) {
	
	registerUICallback("sendNewData", function(type, newData, success, failure) {
		// get data from dataManager, verify newData can be inserted,
		// insert it, call success / failure function
	});

	registerUICallback("changeData", function(type, id, newData, success, failure) {
		// get data from dataManager, verify id can be changed,
		// insert it, call success / failure function
		dataManager.setData(type, newData);
		if(typeof(success) == "function") success();
	});

	registerUICallback("removeData", function(type, id, success, failure) {
		// get data from dataManager, verify id can be removed,
		// insert it, call success / failure function
	});

}