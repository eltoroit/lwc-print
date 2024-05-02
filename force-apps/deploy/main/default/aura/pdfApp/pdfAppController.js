({
	init: function (component, event, helper) {
		var pdfData = JSON.parse(component.get("v.pdfData"));
		component.set("v.pdfData", pdfData);
		document.title = pdfData.pageTitle;
		$A.createComponent(
			pdfData.component,
			{
				pdfData: component.getReference("v.pdfData"),
				onprintready: component.getReference("c.handlePrintReady")
			},
			function (newComponent, status, errorMessage) {
				if (status === "SUCCESS") {
					var body = component.get("v.body");
					body.push(newComponent);
					component.set("v.body", body);
				} else if (status === "ERROR") {
					alert("Failed to create component. " + errorMessage);
				}
			}
		);
	},

	handlePrintReady: function (component, event, helper) {
		window.print();
		window.onafterprint = function () {
			window.close();
		};
	}
});
