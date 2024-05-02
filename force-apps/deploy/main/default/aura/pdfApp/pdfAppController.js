({
	handlePrintReady: function (component, event, helper) {
		window.print();
		window.onafterprint = function () {
			debugger;
			window.close();
		};
	}
});
