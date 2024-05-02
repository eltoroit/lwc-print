import { LightningElement, api } from "lwc";

export default class PDF_Slots extends LightningElement {
	@api pdfData = {};

	async handlePrintClick() {
		let pdfData = encodeURIComponent(JSON.stringify(this.pdfData));
		window.open(`/c/pdfApp.app?pdfData=${pdfData}`, "_blank", "width=700,height=700");
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
