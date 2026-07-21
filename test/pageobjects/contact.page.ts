import Page from "./page.js";

class ContactPage extends Page {
  public get helpDropdown() {
    return $(
      'select[name="Reason_for_Contact__c"], select[id*="Reason_for_Contact"]',
    );
  }
  public get countryDropdown() {
    return $('select[name="Phone_Country__c"], select[id*="Country"]');
  }
  public get firstNameInput() {
    return $('input[name="FirstName"], input[id*="FirstName"]');
  }
  public get lastNameInput() {
    return $('input[name="LastName"], input[id*="LastName"]');
  }
  public get emailInput() {
    return $('input[name="Email"], input[id*="Email"]');
  }
  public get websiteInput() {
    return $('input[name="Website"], input[id*="Website"]');
  }
  public get hearAboutInput() {
    return $('input[name="How_did_you_hear_about_Telnyx_Open__c"]');
  }
  public get phoneInput() {
    return $('input[name="Phone"], input[id*="Phone"]');
  }
  public get marketingCheckbox() {
    return $('input[type="checkbox"]');
  }
  public get submitBtn() {
    return $('button[type="submit"]');
  }
  public get errorMessages() {
    return $$('.mktoErrorMsg, [aria-invalid="true"]');
  }
  public open() {
    return super.open("contact-us");
  }
  public async submitForm() {
    await this.jsClick(await this.submitBtn);
  }
}
export default new ContactPage();