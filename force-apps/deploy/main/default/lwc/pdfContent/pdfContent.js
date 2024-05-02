import { LightningElement, api, wire } from "lwc";
import queryAccountAndContacts from "@salesforce/apex/PDF_Demo.queryAccountAndContacts";

const columns = [
	{ label: "First Name", fieldName: "FirstName", sortable: "true" },
	{ label: "Last Name", fieldName: "LastName", sortable: "true" },
	{ label: "Email", fieldName: "Email", type: "email", sortable: "true" }
];

export default class PDF_Content extends LightningElement {
	_pdfData;
	account = {};
	contacts = [];
	columns = columns;
	sortBy = "FirstName";
	sortDirection = "asc";

	@api recordId;

	connectedCallback() {
		this._saveData();
	}

	@api
	get pdfData() {
		return this._pdfData;
	}
	set pdfData(value) {
		if (value) {
			this._pdfData = value;
			this.recordId = value.data.recordId;
			this.sortBy = value.data.sortBy;
			this.sortDirection = value.data.sortDirection;
		}
	}

	@wire(queryAccountAndContacts, { recordId: "$recordId" })
	wiredAccount({ error, data }) {
		if (data) {
			this.account = data;
			this.contacts = data.Contacts;
			this.sortData(this.sortBy, this.sortDirection);
			// eslint-disable-next-line @lwc/lwc/no-async-operation
			setTimeout(() => {
				this.dispatchEvent(new CustomEvent("printready"));
			}, 0);
		} else if (error) {
			debugger;
		}
	}

	handleSort(event) {
		this.sortBy = event.detail.fieldName;
		this.sortDirection = event.detail.sortDirection;
		this.sortData(this.sortBy, this.sortDirection);
	}

	sortData(fieldname, direction) {
		let reverse = direction === "asc" ? 1 : -1;

		this.contacts = [...this.contacts];
		this.contacts.sort((a, b) => {
			let valueA = a[fieldname] ? a[fieldname] : "";
			let valueB = b[fieldname] ? b[fieldname] : "";

			let order = valueA < valueB ? -1 : 1;
			return order * reverse;
		});
		this._saveData();
	}

	_saveData() {
		this._pdfData = {
			component: "c:pdfContent",
			pageTitle: `ELTOROit PDF PRINTER: ${new Date().toJSON()}`,
			data: {
				recordId: this.recordId,
				sortBy: this.sortBy,
				sortDirection: this.sortDirection
			}
		};
	}
}
