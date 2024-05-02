import { LightningElement, api, wire } from "lwc";
import queryAccountAndContacts from "@salesforce/apex/PDF_Demo.queryAccountAndContacts";

export default class PDF_Content extends LightningElement {
 @api recordId;
 Account = {};

 @wire(queryAccountAndContacts, { recordId: "$recordId" })
 wiredAccount({ error, data }) {
  if (data) {
   this.Account = data;
   // eslint-disable-next-line @lwc/lwc/no-async-operation
   setTimeout(() => {
    this.dispatchEvent(new CustomEvent("printready"));
   }, 0);
  } else if (error) {
   debugger;
  }
 }
}
