public with sharing class PDF_Demo {
	@AuraEnabled(cacheable=true)
	public static Account queryAccountAndContacts(Id recordId) {
		return [
			SELECT Id, Name, (SELECT Id, FirstName, LastName, Name, Email FROM Contacts ORDER BY FirstName)
			FROM Account
			WHERE Id = :recordId
			WITH USER_MODE
		];
	}
}
