import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class PDF_Slots extends NavigationMixin(LightningElement) {
	@api pdfData = {};

	async handlePrintClick() {
		// let pdfData = encodeURIComponent(JSON.stringify(this.pdfData));
		// window.open(`/c/pdfApp.app?pdfData=${pdfData}`, "_blank", "width=700,height=700");
		this[NavigationMixin.Navigate]({
			// Pass in pageReference
			type: "standard__component",
			attributes: {
				componentName: "c__pdfPrinter"
			},
			state: { ...this.pdfData }
		});
	}

	get notPrinting() {
		let isPrinting = false;

		try {
			isPrinting = window.location.pathname === `/c/pdfApp.app`;
		} catch (ex) {
			isPrinting = false;
		}

		return !isPrinting;
	}
}
